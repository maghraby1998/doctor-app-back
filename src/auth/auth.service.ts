import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as ejs from 'ejs';
import * as path from 'path';
import { JWTSERCRET } from 'src/constants';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private mailerService: MailerService,
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signUp(user: { name: string; email: string; password: string }) {
    // check if email already exists

    const userByEmail = await this.userService.findUserByEmail(user.email);

    if (!!userByEmail) {
      throw new BadRequestException('this email already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);

    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    this.eventEmitter.emit('user.created', createdUser);

    return createdUser;
  }

  @OnEvent('user.created', { async: true })
  async handleSendEmail(user: User) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'verifying',
        html: await ejs.renderFile(
          path.resolve(__dirname + '/../templates/email.ejs'),
          {
            name: user.name,
            email: user.email,
            token: await this.jwtService.signAsync(
              {
                id: user.id,
                email: user.email,
              },
              {
                expiresIn: '300s', // a token that expires in 5 mins
              },
            ),
          },
        ),
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async verifyEmail(token: string) {
    try {
      const user = (await this.jwtService.verifyAsync(token, {
        secret: JWTSERCRET,
      })) as User;

      return this.prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: 1,
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async signIn(email: string, password: string, response: Response) {
    const user = await this.userService.findUserByEmail(email);

    if (!!!user) {
      throw new BadRequestException('wrong email or password');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException('wrong email or password');
    }

    const signInResponse = {
      user: {
        id: user.id,
        name: user.name,
      },
      access_token: await this.jwtService.signAsync({
        id: user.id,
      }),
    };

    // response.cookie('auth', JSON.stringify(signInResponse), { httpOnly: true });

    return signInResponse;
  }
}
