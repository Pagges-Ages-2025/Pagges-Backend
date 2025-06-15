import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { fromByteArray } from "base64-js";
import { translateGenresToPTBR } from "src/utils/genres-mapping/genres-mapping";
import { PrismaService } from "../prisma/prisma.service";
import { ProfileDto } from "./dto/profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          followers: true,
          following: true,
          genres: {
            include: {
              genre: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }
      const genres = user.genres.map((genre) => {
        return genre.genre;
      });
      const friendsNumber = user.followers.length;
      const favoriteGenres = translateGenresToPTBR(genres);

      const usersAboveCount = await this.prisma.user.count({
        where: {
          points: {
            gt: user.points,
          },
        },
      });

      const position = usersAboveCount + 1;

      const profileImage = user.profile_image
        ? fromByteArray(user.profile_image)
        : null;

      const profileDto: ProfileDto = {
        id: user.user_id,
        name: user.name,
        email: user.email,
        biography: user.biography || "",
        favoriteGenres: favoriteGenres,
        readKm: user.pages || 0,
        readBooks: user.pages || 0,
        ranking_position: position,
        friendsNumber: friendsNumber,
        isAuthor: user.is_author,
        profileImage: profileImage,
        points: user.points || 0,
      };

      return {
        status: 200,
        message: "Perfil encontrado com sucesso.",
        data: profileDto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro ao buscar perfil: " + error.message);
    }
  }

  async getProfileImage(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }

      return {
        status: 200,
        message: "Perfil encontrado com sucesso.",
        data: user.profile_image ? fromByteArray(user.profile_image) : null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro ao buscar perfil: " + error.message);
    }
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    if (
      !updateProfileDto.name &&
      !updateProfileDto.biography &&
      !updateProfileDto.genreIds
    ) {
      throw new BadRequestException("Nenhum campo fornecido para atualização");
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { user_id: id },
      });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }

      return await this.prisma.$transaction(async (tx) => {
        if (updateProfileDto.name || updateProfileDto.biography) {
          await tx.user.update({
            where: { user_id: id },
            data: {
              ...(updateProfileDto.name && { name: updateProfileDto.name }),
              ...(updateProfileDto.biography && {
                biography: updateProfileDto.biography,
              }),
            },
          });
        }

        if (updateProfileDto.genreIds && updateProfileDto.genreIds.length > 0) {
          await tx.userGenre.deleteMany({
            where: { user_id: id },
          });

          const genres = await tx.genre.findMany({
            where: {
              genre_id: {
                in: updateProfileDto.genreIds,
              },
            },
          });

          if (genres.length !== updateProfileDto.genreIds.length) {
            throw new BadRequestException(
              "Um ou mais gêneros informados não existem"
            );
          }

          for (const genreId of updateProfileDto.genreIds) {
            await tx.userGenre.create({
              data: {
                user_id: id,
                genre_id: genreId,
              },
            });
          }
        }

        return {
          status: 200,
          message: "Perfil atualizado com sucesso.",
          userId: id,
        };
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new BadRequestException(
            "Um ou mais gêneros informados não existem"
          );
        }
      }

      throw new BadRequestException(
        "Erro ao atualizar perfil: " + error.message
      );
    }
  }

  async updateProfileImage(id: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        "Nenhum arquivo foi enviado. Por favor, envie uma imagem para atualizar o perfil."
      );
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { user_id: id },
          data: {
            profile_image: file.buffer,
          },
        });

        return {
          status: 200,
          message: "Imagem de perfil atualizada com sucesso.",
          userId: id,
        };
      });
    } catch (error) {
      throw new BadRequestException(
        "Erro ao atualizar imagem de perfil: " + error.message
      );
    }
  }

  async getThirdPersonProfile(username: string) {
    if (!username) {
      throw new BadRequestException("Username não fornecido.");
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
        include: {
          followers: true,
          following: true,
          genres: {
            include: {
              genre: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }

      const genres = user.genres.map((genre) => genre.genre);
      const friendsNumber = user.followers.length;
      const favoriteGenres = translateGenresToPTBR(genres);

      const usersAboveCount = await this.prisma.user.count({
        where: {
          points: {
            gt: user.points,
          },
        },
      });

      const position = usersAboveCount + 1;

      const profileImage = user.profile_image
        ? fromByteArray(user.profile_image)
        : null;

      const profileDto: ProfileDto = {
        id: user.user_id,
        name: user.name,
        email: user.email,
        biography: user.biography || "",
        favoriteGenres: favoriteGenres,
        readKm: user.pages || 0,
        readBooks: user.pages || 0,
        ranking_position: position,
        friendsNumber: friendsNumber,
        isAuthor: user.is_author,
        profileImage: profileImage,
        points: user.points || 0,
      };

      return {
        status: 200,
        message: "Perfil encontrado com sucesso.",
        data: profileDto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro ao buscar perfil: " + error.message);
    }
  }
}
