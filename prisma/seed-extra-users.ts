import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPasswords = await Promise.all(
    Array.from({ length: 12 }, (_, i) => bcrypt.hash(`password${i + 4}`, 10))
  );

  const extraUsers = [
    {
      name: "Diego Costa",
      username: "dcosta",
      email: "diego@example.com",
      password: hashedPasswords[0],
      points: 250,
      pages: 500,
      is_author: false,
      biography: "Aficionado por thrillers psicológicos e mistérios antigos.",
    },
    {
      name: "Lívia Martins",
      username: "livinha",
      email: "livia@example.com",
      password: hashedPasswords[1],
      points: 420,
      pages: 720,
      is_author: true,
      biography: "Autora de romances contemporâneos e poesia moderna.",
    },
    {
      name: "Henrique Souza",
      username: "h_souza",
      email: "henrique@example.com",
      password: hashedPasswords[2],
      points: 130,
      pages: 300,
      is_author: false,
      biography: "Leitor casual e amante de biografias históricas.",
    },
    {
      name: "Juliana Lima",
      username: "julilima",
      email: "juliana@example.com",
      password: hashedPasswords[3],
      points: 510,
      pages: 880,
      is_author: true,
      biography: "Autora premiada de literatura infantojuvenil.",
    },
    {
      name: "Bruno Mendes",
      username: "brunom",
      email: "bruno@example.com",
      password: hashedPasswords[4],
      points: 75,
      pages: 180,
      is_author: false,
      biography: "Entusiasta de mangás e quadrinhos underground.",
    },
    {
      name: "Camila Rocha",
      username: "camirocha",
      email: "camila@example.com",
      password: hashedPasswords[5],
      points: 610,
      pages: 900,
      is_author: true,
      biography: "Escritora de ficção científica e tecnologia.",
    },
    {
      name: "Eduardo Almeida",
      username: "edualmeida",
      email: "edu@example.com",
      password: hashedPasswords[6],
      points: 310,
      pages: 410,
      is_author: false,
      biography: "Leitor assíduo de clássicos russos.",
    },
    {
      name: "Patrícia Gonçalves",
      username: "patgoncalves",
      email: "patricia@example.com",
      password: hashedPasswords[7],
      points: 285,
      pages: 620,
      is_author: false,
      biography: "Apaixonada por histórias de fantasia épica.",
    },
    {
      name: "Fernando Ribeiro",
      username: "fer_ribeiro",
      email: "fernando@example.com",
      password: hashedPasswords[8],
      points: 470,
      pages: 750,
      is_author: true,
      biography: "Autor de ensaios políticos e análises sociais.",
    },
    {
      name: "Beatriz Nunes",
      username: "bia_nunes",
      email: "beatriz@example.com",
      password: hashedPasswords[9],
      points: 95,
      pages: 1020,
      is_author: false,
      biography: "Leitora de fantasia urbana e ficção LGBTQIA+.",
    },
    {
      name: "Rodrigo Tavares",
      username: "rodrigotav",
      email: "rodrigo@example.com",
      password: hashedPasswords[10],
      points: 80,
      pages: 660,
      is_author: false,
      biography: "Engenheiro e fã de hard sci-fi.",
    },
    {
      name: "Sofia Barbosa",
      username: "sofiab",
      email: "sofia@example.com",
      password: hashedPasswords[11],
      points: 90,
      pages: 330,
      is_author: true,
      biography: "Jovem autora de contos minimalistas.",
    },
  ];

  await prisma.user.createMany({
    data: extraUsers,
    skipDuplicates: true, // evita falha se executar o script mais de uma vez
  });

  console.log("✅ 12 usuários extras inseridos com sucesso.");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
