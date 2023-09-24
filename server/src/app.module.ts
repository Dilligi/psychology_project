import { Module } from '@nestjs/common';
import { AppService } from './app.service';
// !
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [],
  // !
  providers: [PrismaService, AppService],
})
export class AppModule {}
