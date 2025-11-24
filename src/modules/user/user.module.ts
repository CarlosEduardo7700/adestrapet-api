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
import { UserDetailsDtoMapper } from './factories/user-details.dto.mapper';
import { UserListDtoMapper } from './factories/user-list.dto.mapper';
import { UpdateUserDtoMapper } from './factories/update-user.dto.mapper';

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
    UserDetailsDtoMapper,
    UserListDtoMapper,
    UpdateUserDtoMapper,
  ],
  exports: [UserService],
})
export class UserModule {}
