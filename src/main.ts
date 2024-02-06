import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): any => {
        const validations = {};

        errors.forEach((error: ValidationError) => {
          validations[error.property] = Object.values(error.constraints);
        });

        return new BadRequestException({ type: 'validation', validations });
      },
    }),
  );

  app.enableCors();
  app.use(cookieParser());
  await app.listen(5000);
}

bootstrap();
