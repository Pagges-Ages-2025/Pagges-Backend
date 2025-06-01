import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  async followUser(userId: number, username: string) {
    const userToFollow = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!userToFollow) {
      throw new NotFoundException(
        "Usuário a ser seguido não encontrado no banco de dados"
      );
    }

    if (userToFollow.user_id === userId) {
      throw new BadRequestException("Você não pode seguir você mesmo");
    }

    const existingFollow = await this.prisma.userFollow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: userToFollow.user_id,
        },
      },
    });

    if (existingFollow) {
      throw new BadRequestException("Você já segue este usuário");
    }

    const follow = await this.prisma.userFollow.create({
      data: {
        follower_id: userId,
        following_id: userToFollow.user_id,
      },
      include: {
        following: {
          select: {
            user_id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return {
      status: 201,
      message: "Usuário seguido com sucesso!",
      data: {
        followId: `${follow.follower_id}-${follow.following_id}`,
        followedAt: follow.created_at,
        userFollowedData: follow.following,
      },
    };
  }

  async unfollowUser(userId: number, username: string) {
    const userToUnfollow = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!userToUnfollow) {
      throw new NotFoundException(
        "Usuário a ser deixado de seguir não encontrado no banco de dados"
      );
    }

    if (userToUnfollow.user_id === userId) {
      throw new BadRequestException(
        "Você não pode deixar de seguir você mesmo"
      );
    }

    const existingFollow = await this.prisma.userFollow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: userToUnfollow.user_id,
        },
      },
    });

    if (!existingFollow) {
      throw new BadRequestException("Você não segue este usuário");
    }

    await this.prisma.userFollow.delete({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: userToUnfollow.user_id,
        },
      },
    });
  }

  async isFollowing(userId: number, username: string) {
    const userFollowing = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!userFollowing) {
      throw new NotFoundException(
        "Usuário a verificar se está seguindo não encontrado no banco de dados"
      );
    }

   const existingFollow = await this.prisma.userFollow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: userFollowing.user_id,
        },
      },
    });

    if(existingFollow){
      return true;
    }

    return false;

  }
}
