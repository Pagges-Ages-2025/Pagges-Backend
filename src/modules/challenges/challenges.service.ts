import { Injectable } from "@nestjs/common";
import { ChallengeDto, ChallengeRequestDto } from "./dto/challenge.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChallengesService {
    constructor( private prisma: PrismaService ) {}

    getAllChallenges() {
        return this.prisma.challenge.findMany({
            include: { alternatives: true }
        })
    }

    getChallengeById(id: string) {
        return this.prisma.challenge.findUnique({
            where: { challenge_id: Number(id) },
            include: { alternatives: true }
        })
    }

    createChallenge(challenge: ChallengeRequestDto) {
        return this.prisma.challenge.create({
            data: {
                points: challenge.points,
                question: challenge.question,
                alternatives: {
                    create: challenge.alternatives
                }
            },
            include: { alternatives: true }
        })
    }

    removeChallenge(id: string) {
        this.prisma.alternative.deleteMany({
            where: { challenge_id: Number(id) }
        })
        return this.prisma.challenge.delete({
            where: { challenge_id: Number(id)},
        })
    }
}
