/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";
import { challengeSeed } from "./seed-dev-challenges";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword1 = await bcrypt.hash("password1", 10);
  const hashedPassword2 = await bcrypt.hash("password2", 10);
  const hashedPassword3 = await bcrypt.hash("password3", 10);

  const users = await prisma.user.createMany({
    data: [
      {
        name: "Alice",
        username: "alice123",
        email: "alice@example.com",
        password: hashedPassword1,
        points: 100,
        pages: 200,
        is_author: false,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "kermit_o_sapo.jpeg")
        ),
        biography:
          "Leitora apaixonada por ficção científica e fantasia. Sempre em busca de novas histórias para explorar.",
      },
      {
        name: "Bob",
        username: "bob456",
        email: "bob@example.com",
        password: hashedPassword2,
        points: 80,
        pages: 150,
        is_author: true,
        biography:
          "Escritor e crítico literário com mais de 10 anos de experiência. Apaixonado por ficção científica e fantasia, já publicou três livros best-sellers.",
      },
      {
        name: "Carol",
        username: "carol789",
        email: "carol@example.com",
        password: hashedPassword3,
        points: 60,
        pages: 100,
        is_author: false,
        biography:
          "Leitora voraz e amante de histórias. Sempre em busca de novos mundos e aventuras literárias.",
      },
    ],
  });

  const createdUsers = await prisma.user.findMany();

  await prisma.userFollow.createMany({
    data: [
      {
        follower_id: createdUsers[0].user_id,
        following_id: createdUsers[1].user_id,
      },
      {
        follower_id: createdUsers[1].user_id,
        following_id: createdUsers[2].user_id,
      },
    ],
  });

  const books = await prisma.book.createMany({
    data: [
      {
        title: "Clean Code",
        synopsis: "A guide to writing clean code.",
        year: 2008,
        pages: 464,
        authors: "Robert C. Martin",
        google_book_id: "1111111111",
        google_image_url:
          "https://books.google.com/books/content?id=_i6bDeoCQzsC&printsec=frontcover&img=1&zoom=10&edge=curl&source=gbs_api",
      },
      {
        title: "The Hobbit",
        synopsis: "A hobbit goes on an adventure.",
        year: 1937,
        pages: 310,
        authors: "J.R.R. Tolkien",
        google_book_id: "2222222222",
        google_image_url:
          "https://books.google.com/books/content?id=CixXEAAAQBAJ&printsec=frontcover&img=1&zoom=10&source=gbs_api",
      },
      {
        title: "1984",
        synopsis: "A chilling dystopian future.",
        year: 1949,
        pages: 328,
        authors: "George Orwell",
        google_book_id: "3333333333",
        google_image_url:
          "https://books.google.com/books/content?id=EKgWEAAAQBAJ&printsec=frontcover&img=1&zoom=10&edge=curl&source=gbs_api",
      },
      {
        title: "The Great Gatsby",
        synopsis: "A story of the American Dream and its corruption.",
        year: 1925,
        pages: 180,
        authors: "F. Scott Fitzgerald",
        google_book_id: "4444444444",
        google_image_url:
          "https://books.google.com/books/content?id=adjCx-wnhWsC&printsec=frontcover&img=1&zoom=10&edge=curl&source=gbs_api",
      },
      {
        title: "To Kill a Mockingbird",
        synopsis:
          "A classic of modern American literature about racial injustice.",
        year: 1960,
        pages: 281,
        authors: "Harper Lee",
        google_book_id: "5555555555",
        google_image_url:
          "https://books.google.com/books/content?id=P5LEDQAAQBAJ&printsec=frontcover&img=1&zoom=10&edge=curl&source=gbs_api",
      },
      {
        title: "The Lord of the Rings",
        synopsis:
          "An epic high-fantasy novel about the quest to destroy the One Ring.",
        year: 1954,
        pages: 1178,
        authors: "J.R.R. Tolkien",
        google_book_id: "6666666666",
        google_image_url:
          "http://books.google.com/books/content?id=GWorEAAAQBAJ&printsec=frontcover&img=1&zoom=10&edge=curl&source=gbs_api",
      },
      {
        title: "Pride and Prejudice",
        synopsis: "A romantic novel of manners about the Bennet family.",
        year: 1813,
        pages: 432,
        authors: "Jane Austen",
        google_book_id: "7777777777",
        google_image_url:
          "http://books.google.com/books/content?id=s1gVAAAAYAAJ&printsec=frontcover&img=1&zoom=10&source=gbs_api",
      },
      {
        title: "The Catcher in the Rye",
        synopsis: "A classic coming-of-age story about teenage alienation.",
        year: 1951,
        pages: 277,
        authors: "J.D. Salinger",
        google_book_id: "8888888888",
        google_image_url: "https://m.media-amazon.com/images/I/91fQEUwFMyL.jpg",
      },
      {
        title: "The Alchemist",
        synopsis: "A philosophical novel about following your dreams.",
        year: 1988,
        pages: 208,
        authors: "Paulo Coelho",
        google_book_id: "9999999999",
        google_image_url:
          "https://m.media-amazon.com/images/I/71+2-t7M35L._AC_UF1000,1000_QL80_DpWeblab_.jpg",
      },
      {
        title: "The Little Prince",
        synopsis:
          "A poetic tale about a young prince who visits various planets.",
        year: 1943,
        pages: 111,
        authors: "Antoine de Saint-Exupéry",
        google_book_id: "0000000000",
        google_image_url: "https://m.media-amazon.com/images/I/71OZY035QKL.jpg",
      },
    ],
  });

  const createdBooks = await prisma.book.findMany();

  const postData = [
    {
      user_id: createdUsers[0].user_id,
      book_id: 1,
      text: "One of the best books about software craftsmanship.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 2,
      text: "I love how Bilbo becomes brave.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 3,
      text: "1984 is a warning we all should read.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[0].user_id,
      book_id: 4,
      text: "A masterpiece about the American Dream. The symbolism is incredible.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 5,
      text: "A powerful story about justice and growing up. Atticus Finch is one of the greatest literary characters.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 6,
      text: "The world-building in this book is absolutely incredible. Tolkien's masterpiece.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[0].user_id,
      book_id: 7,
      text: "Jane Austen's wit and social commentary are timeless. Elizabeth Bennet is such a strong character.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 8,
      text: "Holden's voice is so authentic. A perfect portrayal of teenage alienation.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 9,
      text: "A beautiful allegory about following your dreams. Very inspiring.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[0].user_id,
      book_id: 10,
      text: "A profound story that speaks to both children and adults. The Little Prince teaches us about love and loss.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
  ];

  const posts = await prisma.post.createMany({ data: postData });

  const createdPosts = await prisma.post.findMany();

  await prisma.post.create({
    data: {
      user_id: createdUsers[1].user_id,
      book_id: 1,
      text: "I agree, Clean Code is amazing!",
      is_spoiler: false,
      is_review: false,
      parent_id: 1,
    },
  });

  await challengeSeed(prisma);

  const challenges = await prisma.challenge.findMany();

  for (const challenge of challenges) {
    // Create challenge-user relationships for all users
    for (const user of createdUsers) {
      // Randomly decide if this user has attempted this challenge
      if (Math.random() > 0.3) {
        // 70% chance of having attempted the challenge
        await prisma.challengeUser.create({
          data: {
            user_id: user.user_id,
            challenge_id: challenge.challenge_id,
            has_user_guessed_correctly: Math.random() > 0.5, // Randomly assign if user guessed correctly
          },
        });
      }
    }
  }

  await prisma.genre.createMany({
    data: [
      { genre_name: "Fiction" },
      { genre_name: "Drama" },
      { genre_name: "Biography & Autobiography" },
      { genre_name: "Children's stories" },
      { genre_name: "History" },
      { genre_name: "Art" },
      { genre_name: "England" },
      { genre_name: "Religion" },
      { genre_name: "Psychology" },
      { genre_name: "Comics & Graphic Novels" },
      { genre_name: "Medical" },
      { genre_name: "Computers" },
      { genre_name: "Action" },
    ],
  });
  const createdGenres = await prisma.genre.findMany();

  // Add BookGenre relationships
  await prisma.bookGenre.createMany({
    data: [
      {
        book_id: createdBooks[0].book_id, // Clean Code
        genre_id: createdGenres[3].genre_id, // Technology
      },
      {
        book_id: createdBooks[1].book_id, // The Hobbit
        genre_id: createdGenres[0].genre_id, // Fantasy
      },
      {
        book_id: createdBooks[2].book_id, // 1984
        genre_id: createdGenres[2].genre_id, // Dystopian
      },
      {
        book_id: createdBooks[3].book_id, // The Great Gatsby
        genre_id: createdGenres[4].genre_id, // Classic Literature
      },
      {
        book_id: createdBooks[4].book_id, // To Kill a Mockingbird
        genre_id: createdGenres[4].genre_id, // Classic Literature
      },
      {
        book_id: createdBooks[5].book_id, // The Lord of the Rings
        genre_id: createdGenres[0].genre_id, // Fantasy
      },
      {
        book_id: createdBooks[6].book_id, // Pride and Prejudice
        genre_id: createdGenres[5].genre_id, // Romance
      },
      {
        book_id: createdBooks[7].book_id, // The Catcher in the Rye
        genre_id: createdGenres[7].genre_id, // Coming of Age
      },
      {
        book_id: createdBooks[8].book_id, // The Alchemist
        genre_id: createdGenres[6].genre_id, // Philosophy
      },
      {
        book_id: createdBooks[9].book_id, // The Little Prince
        genre_id: createdGenres[6].genre_id, // Philosophy
      },
    ],
  });

  await prisma.userGenre.createMany({
    data: [
      {
        user_id: createdUsers[0].user_id,
        genre_id: createdGenres[0].genre_id,
      },
      {
        user_id: createdUsers[0].user_id,
        genre_id: createdGenres[1].genre_id,
      },
      {
        user_id: createdUsers[0].user_id,
        genre_id: createdGenres[2].genre_id,
      },
    ],
  });

  await prisma.postLike.createMany({
    data: [
      { user_id: createdUsers[0].user_id, post_id: createdPosts[0].post_id },
      { user_id: createdUsers[0].user_id, post_id: createdPosts[1].post_id },
      { user_id: createdUsers[1].user_id, post_id: createdPosts[1].post_id },
      { user_id: createdUsers[2].user_id, post_id: createdPosts[2].post_id },
    ],
  });

  await prisma.rateBook.createMany({
    data: [
      {
        user_id: createdUsers[0].user_id,
        book_id: createdBooks[0].book_id,
        rating: 5,
      },
      {
        user_id: createdUsers[1].user_id,
        book_id: createdBooks[1].book_id,
        rating: 4,
      },
      {
        user_id: createdUsers[2].user_id,
        book_id: createdBooks[2].book_id,
        rating: 3,
      },
      {
        user_id: createdUsers[0].user_id,
        book_id: createdBooks[3].book_id,
        rating: 5,
      },
      {
        user_id: createdUsers[1].user_id,
        book_id: createdBooks[4].book_id,
        rating: 5,
      },
      {
        user_id: createdUsers[2].user_id,
        book_id: createdBooks[5].book_id,
        rating: 5,
      },
      {
        user_id: createdUsers[0].user_id,
        book_id: createdBooks[6].book_id,
        rating: 4,
      },
      {
        user_id: createdUsers[1].user_id,
        book_id: createdBooks[7].book_id,
        rating: 4,
      },
      {
        user_id: createdUsers[2].user_id,
        book_id: createdBooks[8].book_id,
        rating: 5,
      },
      {
        user_id: createdUsers[0].user_id,
        book_id: createdBooks[9].book_id,
        rating: 5,
      },
    ],
  });

  await prisma.userBookshelfState.createMany({
    data: [
      {
        user_id: createdUsers[0].user_id,
        book_id: createdBooks[0].book_id,
        state: "READ",
      },
      {
        user_id: createdUsers[1].user_id,
        book_id: createdBooks[1].book_id,
        state: "READING",
      },
      {
        user_id: createdUsers[2].user_id,
        book_id: createdBooks[2].book_id,
        state: "TO_BE_READ",
      },
      {
        user_id: createdUsers[0].user_id,
        book_id: createdBooks[3].book_id,
        state: "READ",
      },
      {
        user_id: createdUsers[1].user_id,
        book_id: createdBooks[4].book_id,
        state: "READ",
      },
      {
        user_id: createdUsers[2].user_id,
        book_id: createdBooks[5].book_id,
        state: "READING",
      },
      {
        user_id: createdUsers[0].user_id,
        book_id: createdBooks[6].book_id,
        state: "READ",
      },
      {
        user_id: createdUsers[1].user_id,
        book_id: createdBooks[7].book_id,
        state: "TO_BE_READ",
      },
      {
        user_id: createdUsers[2].user_id,
        book_id: createdBooks[8].book_id,
        state: "READ",
      },
      {
        user_id: createdUsers[0].user_id,
        book_id: createdBooks[9].book_id,
        state: "READ",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
