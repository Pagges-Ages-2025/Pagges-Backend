import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { fromByteArray } from "base64-js";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  async getRanking() {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: {
          points: "desc",
        },
        take: 10,
        select: {
          name: true,
          profile_image: true,
          points: true,
        },
      });

      const ranking = users.map((user, index) => {
        const fotoBase64 = user.profile_image
          ? fromByteArray(user.profile_image as Uint8Array)
          : null;

        return {
          position: index + 1,
          name: user.name,
          profile_image: fotoBase64,
          points: user.points,
        };
      });

      return { ranking };
    } catch (error) {
      throw new InternalServerErrorException(
        "Erro ao buscar ranking dos usuários."
      );
    }
  }

  async getUserPersonalRanking(user_id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          user_id: user_id,
        },
        select: {
          name: true,
          profile_image: true,
          points: true,
        },
      });

      if (!user) throw new NotFoundException("usuário não encontrado");

      const usersAboveCount = await this.prisma.user.count({
        where: {
          points: {
            gt: user.points,
          },
        },
      });

      const position = usersAboveCount + 1;

      const fotoBase64 = user.profile_image
        ? fromByteArray(user.profile_image as Uint8Array)
        : null;

      return {
        position: position,
        name: user.name,
        profile_image: fotoBase64,
        points: user.points,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Erro ao buscar ranking dos usuários."
      );
    }
  }
}
