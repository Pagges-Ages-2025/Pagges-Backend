/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if we already have challenges in the database
    const existingChallenges = await prisma.challenge.count();

    if (existingChallenges === 0) {
      console.log("No challenges found in database. Loading from JSON file...");

      // Read the JSON file
      const jsonPath = path.join(process.cwd(), "desafios_diarios.json");
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

      // Process each category
      for (const [, questions] of Object.entries(jsonData)) {
        for (const question of questions as any[]) {
          // Create the challenge
          await prisma.challenge.create({
            data: {
              question: question.Pergunta,
              points: Math.floor(Math.random() * (40 - 10 + 1)) + 10, // Random points between 10 and 40
              is_current: false,
              alternatives: {
                create: [
                  {
                    answer: String(question["Opção 1"]),
                    is_correct:
                      String(question["Opção 1"]) ===
                      String(question["Resposta Correta"]),
                  },
                  {
                    answer: String(question["Opção 2"]),
                    is_correct:
                      String(question["Opção 2"]) ===
                      String(question["Resposta Correta"]),
                  },
                  {
                    answer: String(question["Opção 3"]),
                    is_correct:
                      String(question["Opção 3"]) ===
                      String(question["Resposta Correta"]),
                  },
                ],
              },
            },
          });
        }
      }

      console.log("Challenges loaded successfully!");
    } else {
      console.log("Challenges already exist in database.");
    }
  } catch (error) {
    console.error("Error loading challenges:", error);
    throw error;
  }
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
