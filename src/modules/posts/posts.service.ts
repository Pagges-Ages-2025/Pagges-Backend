import { Injectable, NotFoundException } from "@nestjs/common";
import { fromByteArray } from "base64-js";
import { PaggesLogger } from "src/config/winston-logger/pagges-logger.utils";
import { PrismaService } from "../prisma/prisma.service";
import { PostDto } from "./dto/post.dto";
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
    });

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
    return await this.prismaService.post.findMany({
      where: {
        user_id: userId,
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
    });
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

  async getFollowingPosts(userId: number) {
    const followingUsers = await this.prismaService.userFollow.findMany({
      where: { follower_id: userId },
      select: { following_id: true },
    });

    const followingIds = followingUsers.map((follow) => follow.following_id);

    const posts = await this.prismaService.post.findMany({
      where: {
        user_id: { in: followingIds },
        is_review: true,
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            name: true,
            profile_image: true,
          },
        },
        livro: {
          select: {
            title: true,
            google_image_url: true,
          },
        },
        _count: {
          select: {
            liked_by: true,
            comments: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return {
      status: 200,
      message: "Posts dos usuários seguidos retornados com sucesso",
      data: posts.map((post) => ({
        post_id: post.post_id,
        autor: {
          ...post.user,
          profile_image: post.user.profile_image
            ? fromByteArray(post.user.profile_image)
            : null,
        },
        texto: post.text,
        dataPostagem: post.created_at,
        curtidas: post._count.liked_by,
        comentarios: post._count.comments,
        spoiler: post.is_spoiler,
        livro: post.livro,
        id_postPai: post.parent_id,
      })),
    };
  }
}
