import { Injectable } from '@nestjs/common';
import { Client, Psycho } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Promise<Client | Psycho | undefined> {
    const client = await this.prisma.client.findFirst({
      where: {
        email: {
          equals: email
        },
        password: {
          equals: password
        }
      }
    });

    const psycho = await this.prisma.psycho.findFirst({
      where: {
        email: {
          startsWith: email
        },
        password: {
          startsWith: password
        }
      }
    });

    return psycho || client;
  }
}
