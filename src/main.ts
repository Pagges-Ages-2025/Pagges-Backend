import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { AppModule } from "./app.module";
import { PaggesLogger } from "./config/winston-logger/pagges-logger.utils";
import { winstonLoggerConfig } from "./config/winston-logger/winston-config";

dotenv.config();

async function bootstrap() {
  if (!process.env.PORT) {
    throw new Error("PORT environment variable is required");
  }

  const rawWinstonLogger = winston.createLogger(winstonLoggerConfig);

  PaggesLogger.setLogger(rawWinstonLogger);

  const nestLogger = WinstonModule.createLogger(winstonLoggerConfig);

  const app = await NestFactory.create(AppModule, {
    logger: nestLogger,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          const constraints = error.constraints || {};
          return Object.values(constraints).join(", ");
        });
        PaggesLogger.error(`Validation failed: ${messages.join("; ")}`);
        return new Error(messages.join("; "));
      },
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Pagges API")
    .setDescription("Pagges API description")
    .setVersion("1.0")
    .addTag("pagges")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api-docs", app, swaggerDocument);

  const { PORT } = process.env;
  await app.listen(PORT);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
