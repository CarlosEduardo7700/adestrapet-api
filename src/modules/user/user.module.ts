import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRegister } from './delegates/user-register';
import { UserReader } from './delegates/user-reader';
import { UserUpdater } from './delegates/user-updater';
import { UserDeleter } from './delegates/user-deleter';
import { UserFactory } from './factories/user.factory';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    UserService,
    UserRegister,
    UserReader,
    UserUpdater,
    UserDeleter,
    UserFactory,
  ],
  exports: [UserService],
})
export class UserModule {}
