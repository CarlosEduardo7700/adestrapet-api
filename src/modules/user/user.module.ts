import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRegister } from './delegates/user-register';
import { UserReader } from './delegates/user-reader';
import { UserUpdater } from './delegates/user-updater';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRegister, UserReader, UserUpdater],
})
export class UserModule {}
