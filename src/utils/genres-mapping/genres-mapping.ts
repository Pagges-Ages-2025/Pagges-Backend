type Genre = {
  genre_id: number;
  genre_name: string;
  created_at: string | Date;
};

type TranslatedGenre = {
  genre_id: number;
  translated_name: string;
};

const GENRE_TRANSLATIONS: Record<string, string> = {
  "Fiction": "Ficção",
  "Drama": "Drama",
  "Biography & Autobiography": "Autobiografia",
  "Children's stories": "Infantojuvenil",
  "History": "História",
  "Art": "Arte",
  "England": "Inglaterra",
  "Religion": "Religião",
  "Psychology": "Psicologia",
  "Comics & Graphic Novels": "Quadrinhos",
  "Medical": "Medicina",
  "Computers": "Computação",
  "Action": "Ação",
};

export function translateGenresToPTBR(genres: Genre[]): TranslatedGenre[] {
  return genres
    .filter((genre) => GENRE_TRANSLATIONS.hasOwnProperty(genre.genre_name))
    .map((genre) => ({
        genre_id:genre.genre_id,
      translated_name: GENRE_TRANSLATIONS[genre.genre_name],
    }));
}

export function translateGenresOnlyGenreNamesPTBR(genres: Genre[]): string[] {
  return genres
    .filter((genre) => GENRE_TRANSLATIONS.hasOwnProperty(genre.genre_name))
    .map((genre) => GENRE_TRANSLATIONS[genre.genre_name]);
}
