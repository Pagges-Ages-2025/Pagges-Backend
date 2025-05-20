import { Alternative } from "@prisma/client"
import { IsNotEmpty, IsString } from "class-validator"

export class ChallengeDto {
    challenge_id?: number
    points: number
    question: string
    alternatives: Alternative[]
}

export class ChallengeRequestDto {
    @IsNotEmpty({ message: 'O campo points não pode ser vazio.' })
    points: number
    @IsString({ message: 'O campo question deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo question não pode ser vazio.' })
    question: string
    @IsNotEmpty({ message: 'O campo alternatives não pode ser vazio.' })
    alternatives: Alternative[]
}
