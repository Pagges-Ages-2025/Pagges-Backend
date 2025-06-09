import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { fromByteArray } from "base64-js";
import { PrismaService } from "../prisma/prisma.service";
import { ProfileFollowersResponseDto } from "./dto/profile-followers.dto";

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

  async getFollowers(userId: number): Promise<ProfileFollowersResponseDto> {
    const profileFollowers = await this.prisma.userFollow.findMany({
      where: {
        following_id: userId,
      },
      include: {
        follower: {
          select: {
            user_id: true,
            profile_image: true,
            username: true,
          },
        },
      },
    });

    if (profileFollowers == undefined || profileFollowers.length === 0) {
      return {
        followers: [],
      };
    }

    const followersList = profileFollowers.map((profileFollower) => {
      return profileFollower.follower;
    });

    const result = await Promise.all(
      followersList.map(async (follower) => {
        const followerId = follower.user_id;
        const isFollowedBack = await this.prisma.userFollow.findFirst({
          where: {
            follower_id: userId,
            following_id: followerId,
          },
        });

        return {
          user_id: follower.user_id,
          profile_image: follower.profile_image
            ? fromByteArray(follower.profile_image)
            : null,
          username: follower.username,
          imFollowing: Boolean(isFollowedBack),
        };
      })
    );
    return {
      followers: result,
    };
  }

  async getOthersFollowers(
    myId: number,
    targetId: number
  ): Promise<ProfileFollowersResponseDto> {
    const thirdPersonProfileFollowers = await this.prisma.userFollow.findMany({
      where: {
        following_id: targetId,
      },
      include: {
        follower: {
          select: {
            user_id: true,
            profile_image: true,
            username: true,
          },
        },
      },
    });

    if (
      thirdPersonProfileFollowers == undefined ||
      thirdPersonProfileFollowers.length === 0
    ) {
      return {
        followers: [],
      };
    }

    // The myIdUser cant be in the followers list
    const followersListWithoutMyId = thirdPersonProfileFollowers.filter(
      (profileFollower) => profileFollower.follower_id !== myId
    );

    const followersList = followersListWithoutMyId.map((profileFollower) => {
      return profileFollower.follower;
    });

    const result = await Promise.all(
      followersList.map(async (follower) => {
        const followerId = follower.user_id;
        const isMyUserFollowing = await this.prisma.userFollow.findFirst({
          where: {
            follower_id: myId,
            following_id: followerId,
          },
        });

        return {
          user_id: follower.user_id,
          profile_image: follower.profile_image
            ? fromByteArray(follower.profile_image)
            : null,
          username: follower.username,
          imFollowing: Boolean(isMyUserFollowing),
        };
      })
    );

    return {
      followers: result,
    };
  }
}
