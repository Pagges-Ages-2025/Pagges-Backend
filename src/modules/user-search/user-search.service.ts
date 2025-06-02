import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetUserInfosDto } from "./dto/get_user_infos.dto";

@Injectable()
export class UserSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserInfos(userLoggedId: number, toSearch: GetUserInfosDto) {
    const { userId, username } = toSearch

    const userToSearch = await this.prisma.user.findFirst({
        where: {
            user_id: userId,
            username: username,
        },
        select: {
            username: true,
            name: true,
            email: true,
            points: true,
            pages: true,
            is_author: true,
            profile_image: true,
            created_at: true,
            biography: true,
        },
    });

    const followRecord = await this.prisma.userFollow.findFirst({
        where: {
          follower_id:  userLoggedId,
          following_id: userId,
        },
      });
      
    const isFollowing = Boolean(followRecord);
    return {
      user: userToSearch,
      "following?": isFollowing,
    }
  }
}
