/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

export async function bookSeed(prisma: PrismaClient) {
  try {
    console.log("Loading books from JSON file...");

    // Read the JSON file
    const jsonPath = path.join(process.cwd(), "books.json");
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    // Process each book
    for (const book of jsonData) {
      // Create the book
      const createdBook = await prisma.book.create({
        data: {
          title: book.title,
          synopsis: book.synopsis,
          year: book.year === "Unknown" ? 2020 : parseInt(book.year),
          pages: book.pages,
          authors: book.authors,
          google_book_id: book.google_book_id,
          google_image_url: book.google_image_url,
        },
      });

      // Process genres for each book
      for (const genreName of book.genres) {
        // Find or create the genre
        const genre = await prisma.genre.findFirst({
          where: {
            genre_name: genreName,
          },
        });

        if (genre) {
          // Create the book-genre association
          await prisma.bookGenre.create({
            data: {
              book_id: createdBook.book_id,
              genre_id: genre.genre_id,
            },
          });
        } else {
          console.log(
            `Genre "${genreName}" not found for book "${book.title}"`
          );
        }
      }
    }

    console.log("Books loaded successfully!");
  } catch (error) {
    console.error("Error loading books:", error);
    throw error;
  }
}
