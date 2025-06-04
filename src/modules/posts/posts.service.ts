import { Injectable, NotFoundException } from "@nestjs/common";
import { PaggesLogger } from "src/config/winston-logger/pagges-logger.utils";
import { PrismaService } from "../prisma/prisma.service";
import { PostDto } from "./dto/post.dto";
import { fromByteArray } from "base64-js";
@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getReviewsByParentId(postId: number) {
    const reviews = await this.prismaService.post.findMany({
      where: {
        parent_id: postId,
      }, 
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profile_image: true,
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
    })

    const response = reviews.map((post) => ({
      ...post,
      user: {
        ...post.user,
        profile_image: post.user.profile_image
          ? fromByteArray(post.user.profile_image)
          : null,
      },
    }));
    if (reviews.length == 0) {
      throw new NotFoundException({
        status: 204,
        message: "Não existe comentários ou resenhas sobre esse livro",
      });
    }
    return {
      status: 200,
      message: "Resenhas e comentários encontrados com sucesso",
      data: response,
    };
  }

  async getRecentReviewsFromUser(userId: number) {
    const reviews = await this.prismaService.post.findMany({
      where: {
        user_id: userId,
        parent_id: null,
      },
    });
    // Fetch children for each review
    const reviewsWithChildren = await Promise.all(
      reviews.map(async (post) => {
        const children = await this.prismaService.post.findMany({
          where: { parent_id: post.post_id },
        });
        return {
          ...post,
          children,
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
        parent_id: null, 
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            profile_image: true,
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

    const response = postsByBook.map((post) => ({
      ...post,
      user: {
        ...post.user,
        profile_image: post.user.profile_image
          ? fromByteArray(post.user.profile_image)
          : null,
      },
    }));

    if (postsByBook.length == 0) {
      throw new NotFoundException({
        status: 204,
        message: "Não existe comentários ou resenhas sobre esse livro",
      });
    }
    return {
      status: 200,
      message: "Resenhas e comentários encontrados com sucesso",
      data: response,
    };
  }
}
