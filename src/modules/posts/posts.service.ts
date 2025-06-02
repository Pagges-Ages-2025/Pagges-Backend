import { Injectable, NotFoundException } from "@nestjs/common";
import { PaggesLogger } from "src/config/winston-logger/pagges-logger.utils";
import { PrismaService } from "../prisma/prisma.service";
import { PostDto } from "./dto/post.dto";

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRecentReviewsFromUser(userId: number) {
    const reviews = await this.prismaService.post.findMany({
      where: {
        user_id: userId,
        parent_id: null,
      } 
    })
    // Fetch children for each review
    const reviewsWithChildren = await Promise.all(
      reviews.map(async (post) => {
      const children = await this.prismaService.post.findMany({
        where: { parent_id: post.post_id },
      });
      return {
        ...post,
        children,
        likes: post._count?.liked_by
      };
      })
    );

    return reviewsWithChildren;
  }

  async createNewPost(dto: PostDto, userId: number) {
    const post = await this.prismaService.post.create({
      data: {
        ...dto,
        user_id: userId,
      },
    });
    PaggesLogger.log("Created new Post entity: " + post.post_id);
    return post;
  }

  async getBookReviews(id: number) {
    const livro = await this.prismaService.book.findUnique({
      where: { book_id: id },
    });

    if (!livro) {
      throw new NotFoundException("Livro não encontrado");
    }

    const postsByBook = await this.prismaService.post.findMany({
      where: {
        book_id: id,
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profile_image: true
          },
        },
        livro: {
          select: {
            book_id: true,
            google_image_url: true,
            title: true,
          },
        },
        _count: {
          select: {
            liked_by: true,
            comments: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (postsByBook.length == 0) {
      throw new NotFoundException({
        status: 204,
        message: 'Não existe comentários ou resenhas sobre esse livro'
      })
    }
    return {
      status: 200,
      message: "Resenhas e comentários encontrados com sucesso",
      data: postsByBook.map((post) => ({
        post
      })),
    };
  }
}
