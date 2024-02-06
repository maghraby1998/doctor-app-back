import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JWTSERCRET } from './constants';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { OfficeModule } from './office/office.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWTSERCRET,
      signOptions: { expiresIn: '3600s' },
    }),
    EventEmitterModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'maghraby1998@gmail.com',
          pass: 'kkbj pkvs cwcn lwcb',
        },
      },
      defaults: {
        from: 'maghraby1998@gmail.com',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    AuthModule,
    CompanyModule,
    OfficeModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaClient],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
