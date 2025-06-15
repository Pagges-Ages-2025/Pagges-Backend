import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { fromByteArray } from "base64-js";

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
}
