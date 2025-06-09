import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUsersByName(name: string, myId: number) {
    const users = await this.prisma.user.findMany({
      select: {
        user_id: true,
        name: true,
        username: true,
        profile_image: true,
      },
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    const usersWithoutMe = users.filter((user) => user.user_id !== myId);

    if (usersWithoutMe.length === 0) {
      return [];
    }
    return usersWithoutMe;
  }
}
