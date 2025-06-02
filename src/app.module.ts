import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import * as Joi from "joi";
import { WinstonModule } from "nest-winston";
import { winstonLoggerConfig } from "./config/winston-logger/winston-config";
import { MiddlewareModule } from "./middlewares/middleware.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BooksModule } from "./modules/books/books.module";
import { ChallengesModule } from "./modules/challenges/challenges.module";
import { GoogleIntegrationModule } from "./modules/google-integration/google-integration.module";
import { PersonalLibraryModule } from "./modules/personal-library/personal-library.module";
import { PostsModule } from "./modules/posts/posts.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { UserGenresModule } from "./modules/user-genres/user-genres.module";
import { SocialModule } from "./modules/social/social.module";
import { UserSearchModule } from "./modules/user-search/user-search.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default("30d"),
        GOOGLE_API_KEY: Joi.string().required(),
      }),
    }),
    WinstonModule.forRoot(winstonLoggerConfig),
    PrismaModule,
    GoogleIntegrationModule,
    AuthModule,
    PostsModule,
    MiddlewareModule,
    ProfileModule,
    BooksModule,
    ChallengesModule,
    UserGenresModule,
    PersonalLibraryModule,
    SocialModule,
    UserSearchModule
  ],
  providers: [],
})
export class AppModule {}
