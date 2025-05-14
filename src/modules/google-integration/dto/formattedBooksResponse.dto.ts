export type FormattedBooksDtoResponse = {
  id: string       // Adicionando campo id
  titulo: string
  autores: string[]
  capa: string
  paginas: number
  sinopse: string
  generos: string[] | undefined
  anoDePublicacao: string
}
