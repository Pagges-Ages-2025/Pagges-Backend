/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";
import { bookSeed } from "./seed-dev-book";
import { challengeSeed } from "./seed-dev-challenges";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword1 = await bcrypt.hash("password1", 10);
  const hashedPassword2 = await bcrypt.hash("password2", 10);
  const hashedPassword3 = await bcrypt.hash("password3", 10);
  const hashedPassword4 = await bcrypt.hash("password4", 10);
  const hashedPassword5 = await bcrypt.hash("password5", 10);
  const hashedPassword6 = await bcrypt.hash("password6", 10);
  const hashedPassword7 = await bcrypt.hash("password7", 10);
  const hashedPassword8 = await bcrypt.hash("password8", 10);
  const hashedPassword9 = await bcrypt.hash("password9", 10);
  const hashedPassword10 = await bcrypt.hash("password10", 10);
  const hashedPassword11 = await bcrypt.hash("password11", 10);
  const hashedPassword12 = await bcrypt.hash("password12", 10);

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
      { genre_name: "Dystopian" },
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

  await bookSeed(prisma);

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
          path.join(__dirname, "../src/assets", "images.png")
        ),
        biography:
          "Leitora apaixonada por ficção científica e fantasia. Sempre em busca de novas histórias para explorar.",
      },
      {
        name: "Pedro",
        username: "pedro456",
        email: "pedro@example.com",
        password: hashedPassword2,
        points: 80,
        pages: 150,
        is_author: true,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-7.png")
        ),
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
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-1.png")
        ),
        biography:
          "Leitora voraz e amante de histórias. Sempre em busca de novos mundos e aventuras literárias.",
      },
      {
        name: "Diego",
        username: "diego",
        email: "diego@example.com",
        password: hashedPassword4,
        points: 210,
        pages: 450,
        is_author: true,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-8.png")
        ),
        biography:
          "Escritor de fantasia épica. Criador de mundos e contador de lendas.",
      },
      {
        name: "Elisa",
        username: "elisa",
        email: "elisa@example.com",
        password: hashedPassword5,
        points: 70,
        pages: 120,
        is_author: false,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-2.png")
        ),
        biography:
          "Curiosa por natureza, adora livros de mistério e biografias inspiradoras.",
      },
      {
        name: "Fernando",
        username: "fernando",
        email: "fernando@example.com",
        password: hashedPassword6,
        points: 190,
        pages: 370,
        is_author: true,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-9.png")
        ),
        biography: "Historiador e autor de romances baseados em fatos reais.",
      },
      {
        name: "Giovana",
        username: "giovana",
        email: "giovana@example.com",
        password: hashedPassword7,
        points: 110,
        pages: 250,
        is_author: false,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-3.png")
        ),
        biography:
          "Fã de mundos mágicos e criaturas encantadas. Leitora fiel de sagas.",
      },
      {
        name: "Henrique",
        username: "henrique",
        email: "henrique@example.com",
        password: hashedPassword8,
        points: 300,
        pages: 600,
        is_author: true,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-10.png")
        ),
        biography: "Poeta moderno que busca traduzir sentimentos em palavras.",
      },
      {
        name: "Isabela",
        username: "isabela",
        email: "isabela@example.com",
        password: hashedPassword9,
        points: 95,
        pages: 180,
        is_author: false,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-4.png")
        ),
        biography:
          "Leitora casual, adora descobrir novos autores independentes.",
      },
      {
        name: "João",
        username: "joao",
        email: "joao@example.com",
        password: hashedPassword10,
        points: 160,
        pages: 290,
        is_author: true,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-11.png")
        ),
        biography: "Autor de romances contemporâneos e histórias de amor.",
      },
      {
        name: "Kátia",
        username: "katia",
        email: "katia@example.com",
        password: hashedPassword11,
        points: 125,
        pages: 240,
        is_author: false,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-5.png")
        ),
        biography:
          "Viciada em suspenses e investigações. Nada escapa ao seu olhar atento.",
      },
      {
        name: "Alinne",
        username: "alinne",
        email: "alinne@example.com",
        password: hashedPassword12,
        points: 180,
        pages: 350,
        is_author: true,
        profile_image: fs.readFileSync(
          path.join(__dirname, "../src/assets", "images-6.png")
        ),
        biography:
          "Escritor de ficção científica com um toque de realismo tecnológico.",
      },
    ],
  });

  const createdUsers = await prisma.user.findMany();

  await prisma.userFollow.createMany({
    data: [
      {
        follower_id: createdUsers[3].user_id,
        following_id: createdUsers[1].user_id,
      },
      {
        follower_id: createdUsers[5].user_id,
        following_id: createdUsers[2].user_id,
      },
      {
        follower_id: createdUsers[0].user_id,
        following_id: createdUsers[4].user_id,
      },
      {
        follower_id: createdUsers[6].user_id,
        following_id: createdUsers[3].user_id,
      },
      {
        follower_id: createdUsers[2].user_id,
        following_id: createdUsers[7].user_id,
      },
      {
        follower_id: createdUsers[1].user_id,
        following_id: createdUsers[5].user_id,
      },
      {
        follower_id: createdUsers[8].user_id,
        following_id: createdUsers[0].user_id,
      },
      {
        follower_id: createdUsers[4].user_id,
        following_id: createdUsers[6].user_id,
      },
      {
        follower_id: createdUsers[7].user_id,
        following_id: createdUsers[9].user_id,
      },
      {
        follower_id: createdUsers[9].user_id,
        following_id: createdUsers[8].user_id,
      },
      {
        follower_id: createdUsers[10].user_id,
        following_id: createdUsers[3].user_id,
      },
      {
        follower_id: createdUsers[11].user_id,
        following_id: createdUsers[2].user_id,
      },
      {
        follower_id: createdUsers[6].user_id,
        following_id: createdUsers[10].user_id,
      },
      {
        follower_id: createdUsers[3].user_id,
        following_id: createdUsers[11].user_id,
      },
      {
        follower_id: createdUsers[1].user_id,
        following_id: createdUsers[9].user_id,
      },
      {
        follower_id: createdUsers[5].user_id,
        following_id: createdUsers[7].user_id,
      },
      {
        follower_id: createdUsers[2].user_id,
        following_id: createdUsers[0].user_id,
      },
      {
        follower_id: createdUsers[7].user_id,
        following_id: createdUsers[1].user_id,
      },
      {
        follower_id: createdUsers[10].user_id,
        following_id: createdUsers[4].user_id,
      },
      {
        follower_id: createdUsers[8].user_id,
        following_id: createdUsers[6].user_id,
      },
      {
        follower_id: createdUsers[0].user_id,
        following_id: createdUsers[9].user_id,
      },
      {
        follower_id: createdUsers[4].user_id,
        following_id: createdUsers[10].user_id,
      },
      {
        follower_id: createdUsers[9].user_id,
        following_id: createdUsers[11].user_id,
      },
      {
        follower_id: createdUsers[10].user_id,
        following_id: createdUsers[2].user_id,
      },
      {
        follower_id: createdUsers[11].user_id,
        following_id: createdUsers[8].user_id,
      },
      {
        follower_id: createdUsers[3].user_id,
        following_id: createdUsers[6].user_id,
      },
      {
        follower_id: createdUsers[5].user_id,
        following_id: createdUsers[1].user_id,
      },
      {
        follower_id: createdUsers[6].user_id,
        following_id: createdUsers[9].user_id,
      },
      {
        follower_id: createdUsers[7].user_id,
        following_id: createdUsers[4].user_id,
      },
      {
        follower_id: createdUsers[1].user_id,
        following_id: createdUsers[3].user_id,
      },
      {
        follower_id: createdUsers[2].user_id,
        following_id: createdUsers[5].user_id,
      },
      {
        follower_id: createdUsers[0].user_id,
        following_id: createdUsers[7].user_id,
      },
      {
        follower_id: createdUsers[8].user_id,
        following_id: createdUsers[10].user_id,
      },
      {
        follower_id: createdUsers[10].user_id,
        following_id: createdUsers[5].user_id,
      },
      {
        follower_id: createdUsers[9].user_id,
        following_id: createdUsers[0].user_id,
      },
      {
        follower_id: createdUsers[11].user_id,
        following_id: createdUsers[6].user_id,
      },
      {
        follower_id: createdUsers[4].user_id,
        following_id: createdUsers[2].user_id,
      },
      {
        follower_id: createdUsers[5].user_id,
        following_id: createdUsers[0].user_id,
      },
      {
        follower_id: createdUsers[2].user_id,
        following_id: createdUsers[9].user_id,
      },
      {
        follower_id: createdUsers[6].user_id,
        following_id: createdUsers[1].user_id,
      },
      {
        follower_id: createdUsers[7].user_id,
        following_id: createdUsers[10].user_id,
      },
      {
        follower_id: createdUsers[3].user_id,
        following_id: createdUsers[8].user_id,
      },
      {
        follower_id: createdUsers[1].user_id,
        following_id: createdUsers[11].user_id,
      },
      {
        follower_id: createdUsers[0].user_id,
        following_id: createdUsers[6].user_id,
      },
      {
        follower_id: createdUsers[9].user_id,
        following_id: createdUsers[2].user_id,
      },
      {
        follower_id: createdUsers[10].user_id,
        following_id: createdUsers[7].user_id,
      },
      {
        follower_id: createdUsers[11].user_id,
        following_id: createdUsers[5].user_id,
      },
      {
        follower_id: createdUsers[8].user_id,
        following_id: createdUsers[3].user_id,
      },
      {
        follower_id: createdUsers[4].user_id,
        following_id: createdUsers[1].user_id,
      },
      {
        follower_id: createdUsers[7].user_id,
        following_id: createdUsers[0].user_id,
      },
    ],
  });

  const postData = [
    {
      user_id: createdUsers[0].user_id,
      book_id: 1,
      text: "One of the best books about software craftsmanship. Uncle Bob really knows how to explain complex concepts in simple terms.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 2,
      text: "I love how Bilbo becomes brave throughout his journey. The character development is incredible!",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 3,
      text: "1984 is a warning we all should read. The parallels to modern society are terrifying.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[0].user_id,
      book_id: 4,
      text: "A masterpiece about the American Dream. The symbolism is incredible, especially the green light.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 5,
      text: "A powerful story about justice and growing up. Atticus Finch is one of the greatest literary characters ever created.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 6,
      text: "The world-building in this book is absolutely incredible. Tolkien's masterpiece of fantasy literature.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[0].user_id,
      book_id: 7,
      text: "Jane Austen's wit and social commentary are timeless. Elizabeth Bennet is such a strong and relatable character.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 8,
      text: "Holden's voice is so authentic. A perfect portrayal of teenage alienation and the search for meaning.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 9,
      text: "A beautiful allegory about following your dreams. Very inspiring and thought-provoking.",
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
    // Additional posts from other users
    {
      user_id: createdUsers[3].user_id,
      book_id: 1,
      text: "Just finished Clean Code and it completely changed how I think about programming. Highly recommend for any developer!",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[4].user_id,
      book_id: 2,
      text: "Reading The Hobbit for the third time and it's still magical. The adventure never gets old!",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[5].user_id,
      book_id: 3,
      text: "1984 was way ahead of its time. The surveillance themes are more relevant than ever.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[6].user_id,
      book_id: 4,
      text: "The Great Gatsby is so beautifully written. Fitzgerald's prose is absolutely stunning.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[7].user_id,
      book_id: 5,
      text: "To Kill a Mockingbird should be required reading. The lessons about empathy and justice are timeless.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[8].user_id,
      book_id: 6,
      text: "The Lord of the Rings trilogy is the ultimate fantasy epic. Nothing compares to Tolkien's imagination.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[9].user_id,
      book_id: 7,
      text: "Pride and Prejudice is the perfect romance novel. The slow burn between Elizabeth and Darcy is everything!",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[10].user_id,
      book_id: 8,
      text: "The Catcher in the Rye captures teenage angst perfectly. Holden's journey is so relatable.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[11].user_id,
      book_id: 9,
      text: "The Alchemist changed my perspective on life. Such a simple story with profound meaning.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    {
      user_id: createdUsers[3].user_id,
      book_id: 10,
      text: "The Little Prince is pure poetry. Every time I read it, I discover something new.",
      is_spoiler: false,
      is_review: true,
      parent_id: null,
    },
    // Some non-review posts
    {
      user_id: createdUsers[4].user_id,
      book_id: 1,
      text: "Currently reading Clean Code and it's blowing my mind! The chapter on naming conventions is gold.",
      is_spoiler: false,
      is_review: false,
      parent_id: null,
    },
    {
      user_id: createdUsers[5].user_id,
      book_id: 2,
      text: "Just started The Hobbit! Excited to go on this adventure with Bilbo.",
      is_spoiler: false,
      is_review: false,
      parent_id: null,
    },
    {
      user_id: createdUsers[6].user_id,
      book_id: 3,
      text: "About halfway through 1984 and I can't put it down. The world-building is incredible.",
      is_spoiler: false,
      is_review: false,
      parent_id: null,
    },
    {
      user_id: createdUsers[7].user_id,
      book_id: 4,
      text: "The Great Gatsby is next on my reading list! Heard so many great things about it.",
      is_spoiler: false,
      is_review: false,
      parent_id: null,
    },
    {
      user_id: createdUsers[8].user_id,
      book_id: 5,
      text: "To Kill a Mockingbird is such an important book. Everyone should read it at least once.",
      is_spoiler: false,
      is_review: false,
      parent_id: null,
    },
  ];

  const posts = await prisma.post.createMany({ data: postData });

  const createdPosts = await prisma.post.findMany();

  // Create subposts (replies to existing posts)
  const subpostsData = [
    // Replies to post 1 (Clean Code)
    {
      user_id: createdUsers[1].user_id,
      book_id: 1,
      text: "I agree, Clean Code is amazing! The SOLID principles chapter was a game-changer for me.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[0].post_id,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 1,
      text: "Have you read the chapter about error handling? It completely changed how I approach exceptions.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[0].post_id,
    },
    {
      user_id: createdUsers[3].user_id,
      book_id: 1,
      text: "The naming conventions section is pure gold! I've been applying those principles ever since.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[0].post_id,
    },
    // Replies to post 2 (The Hobbit)
    {
      user_id: createdUsers[0].user_id,
      book_id: 2,
      text: "Bilbo's transformation is incredible! From a timid hobbit to a true hero.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[1].post_id,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 2,
      text: "The riddles with Gollum are my favorite part! So clever and suspenseful.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[1].post_id,
    },
    // Replies to post 3 (1984)
    {
      user_id: createdUsers[0].user_id,
      book_id: 3,
      text: "The ending is absolutely chilling. Big Brother is watching indeed.",
      is_spoiler: true,
      is_review: false,
      parent_id: createdPosts[2].post_id,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 3,
      text: "The concept of doublethink is terrifying. Orwell was a genius.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[2].post_id,
    },
    // Replies to post 4 (The Great Gatsby)
    {
      user_id: createdUsers[2].user_id,
      book_id: 4,
      text: "The green light symbolism is so powerful. It represents the unattainable American Dream.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[3].post_id,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 4,
      text: "Gatsby's parties are described so vividly! You can almost hear the jazz music.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[3].post_id,
    },
    // Replies to post 5 (To Kill a Mockingbird)
    {
      user_id: createdUsers[0].user_id,
      book_id: 5,
      text: "Atticus's speech in court is one of the most powerful moments in literature.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[4].post_id,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 5,
      text: "Scout's perspective as a child makes the story even more powerful.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[4].post_id,
    },
    // Replies to post 6 (The Lord of the Rings)
    {
      user_id: createdUsers[0].user_id,
      book_id: 6,
      text: "The languages Tolkien created are incredible! Elvish is so beautiful.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[5].post_id,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 6,
      text: "The fellowship dynamics are perfect. Each character brings something unique.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[5].post_id,
    },
    // Replies to post 7 (Pride and Prejudice)
    {
      user_id: createdUsers[2].user_id,
      book_id: 7,
      text: "Mr. Darcy's character development is amazing! From proud to humble.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[6].post_id,
    },
    {
      user_id: createdUsers[0].user_id,
      book_id: 7,
      text: "The social commentary about marriage and class is still relevant today.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[6].post_id,
    },
    // Replies to post 8 (The Catcher in the Rye)
    {
      user_id: createdUsers[0].user_id,
      book_id: 8,
      text: "Holden's relationship with his sister Phoebe is so touching.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[7].post_id,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 8,
      text: "The museum scene is perfect! It captures the fear of growing up so well.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[7].post_id,
    },
    // Replies to post 9 (The Alchemist)
    {
      user_id: createdUsers[0].user_id,
      book_id: 9,
      text: "The Personal Legend concept is so inspiring! It changed how I think about goals.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[8].post_id,
    },
    {
      user_id: createdUsers[1].user_id,
      book_id: 9,
      text: "The desert scenes are so beautifully written. You can feel the heat and the journey.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[8].post_id,
    },
    // Replies to post 10 (The Little Prince)
    {
      user_id: createdUsers[1].user_id,
      book_id: 10,
      text: "The rose and the fox teach such important lessons about love and friendship.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[9].post_id,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 10,
      text: "The ending always makes me cry. It's so bittersweet and beautiful.",
      is_spoiler: true,
      is_review: false,
      parent_id: createdPosts[9].post_id,
    },
    // Replies to post 11 (Clean Code - Diego's review)
    {
      user_id: createdUsers[0].user_id,
      book_id: 1,
      text: "Welcome to the Clean Code club! Which chapter resonated with you the most?",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[10].post_id,
    },
    {
      user_id: createdUsers[4].user_id,
      book_id: 1,
      text: "I'm reading it too! The function length chapter was eye-opening.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[10].post_id,
    },
    // Replies to post 12 (The Hobbit - Elisa's review)
    {
      user_id: createdUsers[3].user_id,
      book_id: 2,
      text: "The third time is the charm! What's your favorite scene?",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[11].post_id,
    },
    {
      user_id: createdUsers[6].user_id,
      book_id: 2,
      text: "I love the barrel escape scene! So much action and humor.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[11].post_id,
    },
    // Replies to post 13 (1984 - Fernando's review)
    {
      user_id: createdUsers[7].user_id,
      book_id: 3,
      text: "The surveillance state themes are more relevant than ever with social media.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[12].post_id,
    },
    {
      user_id: createdUsers[9].user_id,
      book_id: 3,
      text: "The Newspeak concept is brilliant! Language controlling thought.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[12].post_id,
    },
    // Replies to post 14 (The Great Gatsby - Giovana's review)
    {
      user_id: createdUsers[8].user_id,
      book_id: 4,
      text: "Fitzgerald's prose is like poetry! Every sentence is crafted perfectly.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[13].post_id,
    },
    {
      user_id: createdUsers[10].user_id,
      book_id: 4,
      text: "The Valley of Ashes scene is so powerful! The symbolism is incredible.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[13].post_id,
    },
    // Replies to post 15 (To Kill a Mockingbird - Henrique's review)
    {
      user_id: createdUsers[11].user_id,
      book_id: 5,
      text: "The courtroom scene is one of the most powerful in literature.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[14].post_id,
    },
    {
      user_id: createdUsers[3].user_id,
      book_id: 5,
      text: "Boo Radley's story is so touching. It teaches us not to judge by appearances.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[14].post_id,
    },
    // Replies to post 16 (The Lord of the Rings - Isabela's review)
    {
      user_id: createdUsers[4].user_id,
      book_id: 6,
      text: "The world-building is unmatched! Every detail is so carefully crafted.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[15].post_id,
    },
    {
      user_id: createdUsers[5].user_id,
      book_id: 6,
      text: "The friendship between Sam and Frodo is the heart of the story.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[15].post_id,
    },
    // Replies to post 17 (Pride and Prejudice - João's review)
    {
      user_id: createdUsers[6].user_id,
      book_id: 7,
      text: "The slow burn romance is everything! The tension is perfect.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[16].post_id,
    },
    {
      user_id: createdUsers[7].user_id,
      book_id: 7,
      text: "Mr. Collins is such a hilarious character! The comic relief is perfect.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[16].post_id,
    },
    // Replies to post 18 (The Catcher in the Rye - Kátia's review)
    {
      user_id: createdUsers[8].user_id,
      book_id: 8,
      text: "Holden's voice is so authentic! You can hear a real teenager speaking.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[17].post_id,
    },
    {
      user_id: createdUsers[9].user_id,
      book_id: 8,
      text: "The alienation theme is so universal. Everyone feels like that sometimes.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[17].post_id,
    },
    // Replies to post 19 (The Alchemist - Alinne's review)
    {
      user_id: createdUsers[10].user_id,
      book_id: 9,
      text: "The Personal Legend concept changed my life! Such a simple but powerful idea.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[18].post_id,
    },
    {
      user_id: createdUsers[11].user_id,
      book_id: 9,
      text: "The desert journey is so symbolic! Every obstacle has meaning.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[18].post_id,
    },
    // Replies to post 20 (The Little Prince - Diego's second review)
    {
      user_id: createdUsers[4].user_id,
      book_id: 10,
      text: "It's like a different book every time you read it!",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[19].post_id,
    },
    {
      user_id: createdUsers[5].user_id,
      book_id: 10,
      text: "The illustrations are as important as the text! So beautiful.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[19].post_id,
    },
    // Replies to post 21 (Clean Code - Elisa's reading update)
    {
      user_id: createdUsers[1].user_id,
      book_id: 1,
      text: "The naming conventions chapter is pure gold! I've been applying those principles.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[20].post_id,
    },
    {
      user_id: createdUsers[2].user_id,
      book_id: 1,
      text: "Wait until you get to the SOLID principles! That's where it gets really good.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[20].post_id,
    },
    // Replies to post 22 (The Hobbit - Fernando's reading update)
    {
      user_id: createdUsers[0].user_id,
      book_id: 2,
      text: "You're in for such a treat! The adventure is just beginning.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[21].post_id,
    },
    {
      user_id: createdUsers[3].user_id,
      book_id: 2,
      text: "The riddles with Gollum are coming up! That's my favorite part.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[21].post_id,
    },
    // Replies to post 23 (1984 - Giovana's reading update)
    {
      user_id: createdUsers[4].user_id,
      book_id: 3,
      text: "The world-building is incredible! You can feel the oppression.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[22].post_id,
    },
    {
      user_id: createdUsers[5].user_id,
      book_id: 3,
      text: "The Newspeak concept is brilliant! Language controlling thought.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[22].post_id,
    },
    // Replies to post 24 (The Great Gatsby - Henrique's reading update)
    {
      user_id: createdUsers[6].user_id,
      book_id: 4,
      text: "You're going to love it! The prose is absolutely stunning.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[23].post_id,
    },
    {
      user_id: createdUsers[7].user_id,
      book_id: 4,
      text: "The parties are described so vividly! You can almost hear the jazz.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[23].post_id,
    },
    // Replies to post 25 (To Kill a Mockingbird - Isabela's reading update)
    {
      user_id: createdUsers[8].user_id,
      book_id: 5,
      text: "It's such an important book! The lessons are timeless.",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[24].post_id,
    },
    {
      user_id: createdUsers[9].user_id,
      book_id: 5,
      text: "Scout's perspective makes it even more powerful!",
      is_spoiler: false,
      is_review: false,
      parent_id: createdPosts[24].post_id,
    },
  ];

  await prisma.post.createMany({ data: subpostsData });

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

  const createdGenres = await prisma.genre.findMany();

  // Add BookGenre relationships
  await prisma.bookGenre.createMany({
    data: [
      {
        book_id: createdBooks[0].book_id, // Clean Code
        genre_id: createdGenres[11].genre_id, // Computers
      },
      {
        book_id: createdBooks[1].book_id, // The Hobbit
        genre_id: createdGenres[0].genre_id, // Fiction
      },
      {
        book_id: createdBooks[2].book_id, // 1984
        genre_id: createdGenres[13].genre_id, // Dystopian
      },
      {
        book_id: createdBooks[3].book_id, // The Great Gatsby
        genre_id: createdGenres[0].genre_id, // Fiction
      },
      {
        book_id: createdBooks[4].book_id, // To Kill a Mockingbird
        genre_id: createdGenres[0].genre_id, // Fiction
      },
      {
        book_id: createdBooks[5].book_id, // The Lord of the Rings
        genre_id: createdGenres[0].genre_id, // Fiction
      },
      {
        book_id: createdBooks[6].book_id, // Pride and Prejudice
        genre_id: createdGenres[0].genre_id, // Fiction
      },
      {
        book_id: createdBooks[7].book_id, // The Catcher in the Rye
        genre_id: createdGenres[0].genre_id, // Fiction
      },
      {
        book_id: createdBooks[8].book_id, // The Alchemist
        genre_id: createdGenres[0].genre_id, // Fiction
      },
      {
        book_id: createdBooks[9].book_id, // The Little Prince
        genre_id: createdGenres[3].genre_id, // Children's stories
      },
    ],
  });

  await prisma.userGenre.createMany({
    data: [
      { user_id: createdUsers[0].user_id, genre_id: createdGenres[2].genre_id },
      { user_id: createdUsers[0].user_id, genre_id: createdGenres[5].genre_id },
      { user_id: createdUsers[0].user_id, genre_id: createdGenres[8].genre_id },

      { user_id: createdUsers[1].user_id, genre_id: createdGenres[1].genre_id },
      { user_id: createdUsers[1].user_id, genre_id: createdGenres[6].genre_id },
      { user_id: createdUsers[1].user_id, genre_id: createdGenres[9].genre_id },

      { user_id: createdUsers[2].user_id, genre_id: createdGenres[0].genre_id },
      { user_id: createdUsers[2].user_id, genre_id: createdGenres[3].genre_id },
      { user_id: createdUsers[2].user_id, genre_id: createdGenres[4].genre_id },

      { user_id: createdUsers[3].user_id, genre_id: createdGenres[7].genre_id },
      { user_id: createdUsers[3].user_id, genre_id: createdGenres[2].genre_id },
      { user_id: createdUsers[3].user_id, genre_id: createdGenres[9].genre_id },

      { user_id: createdUsers[4].user_id, genre_id: createdGenres[5].genre_id },
      { user_id: createdUsers[4].user_id, genre_id: createdGenres[0].genre_id },
      { user_id: createdUsers[4].user_id, genre_id: createdGenres[6].genre_id },

      { user_id: createdUsers[5].user_id, genre_id: createdGenres[3].genre_id },
      { user_id: createdUsers[5].user_id, genre_id: createdGenres[8].genre_id },
      { user_id: createdUsers[5].user_id, genre_id: createdGenres[1].genre_id },

      { user_id: createdUsers[6].user_id, genre_id: createdGenres[4].genre_id },
      { user_id: createdUsers[6].user_id, genre_id: createdGenres[7].genre_id },
      { user_id: createdUsers[6].user_id, genre_id: createdGenres[0].genre_id },

      { user_id: createdUsers[7].user_id, genre_id: createdGenres[1].genre_id },
      { user_id: createdUsers[7].user_id, genre_id: createdGenres[5].genre_id },
      { user_id: createdUsers[7].user_id, genre_id: createdGenres[3].genre_id },

      { user_id: createdUsers[8].user_id, genre_id: createdGenres[6].genre_id },
      { user_id: createdUsers[8].user_id, genre_id: createdGenres[8].genre_id },
      { user_id: createdUsers[8].user_id, genre_id: createdGenres[2].genre_id },

      { user_id: createdUsers[9].user_id, genre_id: createdGenres[7].genre_id },
      { user_id: createdUsers[9].user_id, genre_id: createdGenres[9].genre_id },
      { user_id: createdUsers[9].user_id, genre_id: createdGenres[4].genre_id },

      {
        user_id: createdUsers[10].user_id,
        genre_id: createdGenres[2].genre_id,
      },
      {
        user_id: createdUsers[10].user_id,
        genre_id: createdGenres[3].genre_id,
      },
      {
        user_id: createdUsers[10].user_id,
        genre_id: createdGenres[0].genre_id,
      },

      {
        user_id: createdUsers[11].user_id,
        genre_id: createdGenres[8].genre_id,
      },
      {
        user_id: createdUsers[11].user_id,
        genre_id: createdGenres[6].genre_id,
      },
      {
        user_id: createdUsers[11].user_id,
        genre_id: createdGenres[1].genre_id,
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
