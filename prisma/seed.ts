/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";

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
          "https://books.google.com/books/content?id=1111111111&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      {
        title: "The Hobbit",
        synopsis: "A hobbit goes on an adventure.",
        year: 1937,
        pages: 310,
        authors: "J.R.R. Tolkien",
        google_book_id: "2222222222",
        google_image_url:
          "https://books.google.com/books/content?id=2222222222&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      {
        title: "1984",
        synopsis: "A chilling dystopian future.",
        year: 1949,
        pages: 328,
        authors: "George Orwell",
        google_book_id: "3333333333",
        google_image_url:
          "https://books.google.com/books/content?id=3333333333&printsec=frontcover&img=1&zoom=1&source=gbs_api",
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

  // Generate challenges with more diverse content
  const challenges = [
    {
      points: 10,
      question: "What is the main theme of 'To Kill a Mockingbird'?",
      alternatives: [
        { answer: "Racial injustice and moral growth", is_correct: true },
        { answer: "Romantic love and relationships", is_correct: false },
        { answer: "Political corruption", is_correct: false },
        { answer: "Environmental conservation", is_correct: false },
      ],
    },
    {
      points: 15,
      question: "Who is the author of '1984'?",
      alternatives: [
        { answer: "George Orwell", is_correct: true },
        { answer: "Aldous Huxley", is_correct: false },
        { answer: "Ray Bradbury", is_correct: false },
        { answer: "H.G. Wells", is_correct: false },
      ],
    },
    {
      points: 20,
      question: "What is the setting of 'The Great Gatsby'?",
      alternatives: [
        { answer: "Long Island during the Roaring Twenties", is_correct: true },
        { answer: "New York City in the 1950s", is_correct: false },
        { answer: "Chicago during Prohibition", is_correct: false },
        { answer: "Los Angeles in the 1920s", is_correct: false },
      ],
    },
    {
      points: 25,
      question: "Which book features the character Holden Caulfield?",
      alternatives: [
        { answer: "The Catcher in the Rye", is_correct: true },
        { answer: "On the Road", is_correct: false },
        { answer: "The Bell Jar", is_correct: false },
        { answer: "A Separate Peace", is_correct: false },
      ],
    },
    {
      points: 30,
      question: "What is the main conflict in 'Lord of the Flies'?",
      alternatives: [
        { answer: "Civilization vs. Savagery", is_correct: true },
        { answer: "Good vs. Evil", is_correct: false },
        { answer: "Nature vs. Nurture", is_correct: false },
        { answer: "Individual vs. Society", is_correct: false },
      ],
    },
  ];

  // Create challenges and their alternatives
  for (const challengeData of challenges) {
    const challenge = await prisma.challenge.create({
      data: {
        points: challengeData.points,
        question: challengeData.question,
        alternatives: {
          create: challengeData.alternatives,
        },
      },
    });

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
      { genre_name: "Fantasy" },
      { genre_name: "Science Fiction" },
      { genre_name: "Dystopian" },
      { genre_name: "Technology" },
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
