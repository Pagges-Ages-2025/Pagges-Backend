import { TranslatedGenre } from "src/utils/genres-mapping/genres-mapping"

export class ProfileDto {
  id: number
  name: string
  biography: string
  favoriteGenres: TranslatedGenre[]
  readKm: number
  readBooks: number = 20
  //ranking: number = 10 -------- proxima sprint
  friendsNumber: number
  isAuthor: boolean
  email: string
  profileImage?: string | null = null
  points: number
}
