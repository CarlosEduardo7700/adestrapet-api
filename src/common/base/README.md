# Estrutura Base Reutilizável

Este diretório contém classes base abstratas e interfaces que fornecem uma estrutura reutilizável para criar módulos CRUD no projeto.

## 📁 Estrutura

```
common/
  base/
    ├── interfaces/
    │   ├── base-entity.interface.ts    # Interface para entidades
    │   ├── base-mapper.interface.ts    # Interface para mappers
    │   └── base-factory.interface.ts   # Interface para factories
    ├── delegates/
    │   ├── base-reader.delegate.ts     # Delegate base para leitura
    │   ├── base-creator.delegate.ts    # Delegate base para criação
    │   ├── base-updater.delegate.ts    # Delegate base para atualização
    │   └── base-deleter.delegate.ts    # Delegate base para deleção
    ├── base.service.ts                 # Service base genérico
    ├── base.controller.ts              # Controller base genérico
    └── index.ts                        # Exporta todas as classes
```

## 🎯 Objetivo

Reduzir duplicação de código e fornecer uma estrutura consistente para todos os módulos do projeto, seguindo os princípios:
- **DRY** (Don't Repeat Yourself)
- **Single Responsibility Principle**
- **Open/Closed Principle**

## 📚 Como Usar

### 1. Entidade deve implementar `IBaseEntity`

```typescript
import { IBaseEntity } from '@/common/base';

@Entity({ name: 'users' })
export class User implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Outros campos específicos...
}
```

### 2. Criar Delegates estendendo as classes base

#### Reader Delegate

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseReader } from '@/common/base';
import { User } from '../user.entity';
import { UserListDto } from '../dto/responses/user-list.dto';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UserListDtoMapper } from '../factories/user-list.dto.mapper';
import { UserDetailsDtoMapper } from '../factories/user-details.dto.mapper';

@Injectable()
export class UserReader extends BaseReader<User, UserListDto, UserDetailsDto> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    listMapper: UserListDtoMapper,
    detailsMapper: UserDetailsDtoMapper,
  ) {
    super(repository, listMapper, detailsMapper);
  }

  protected getEntityName(): string {
    return 'Usuário';
  }

  // Métodos customizados específicos do User
  async getUserByEmailForAuth(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
      select: ['id', 'password', 'email'],
    });
  }
}
```

#### Creator Delegate

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCreator } from '@/common/base';
import { User } from '../user.entity';
import { RegisterUserDto } from '../dto/requests/register-user.dto';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UserFactory } from '../factories/user.factory';
import { UserDetailsDtoMapper } from '../factories/user-details.dto.mapper';

@Injectable()
export class UserRegister extends BaseCreator<User, RegisterUserDto, UserDetailsDto> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    factory: UserFactory,
    detailsMapper: UserDetailsDtoMapper,
  ) {
    super(repository, factory, detailsMapper);
  }

  // Hook: executado antes de criar
  protected async beforeCreate(dto: RegisterUserDto): Promise<void> {
    // Validações customizadas, ex: verificar se email já existe
    const existingUser = await this.repository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new Error('Email já cadastrado!');
    }
  }
}
```

#### Updater Delegate

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUpdater } from '@/common/base';
import { User } from '../user.entity';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UpdateUserDtoMapper } from '../factories/update-user.dto.mapper';
import { UserDetailsDtoMapper } from '../factories/user-details.dto.mapper';

@Injectable()
export class UserUpdater extends BaseUpdater<User, UpdateUserDto, UserDetailsDto> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    detailsMapper: UserDetailsDtoMapper,
    private readonly updateUserDtoMapper: UpdateUserDtoMapper,
  ) {
    super(repository, detailsMapper);
  }

  protected getEntityName(): string {
    return 'Usuário';
  }

  protected async mapDtoToEntity(dto: UpdateUserDto): Promise<Partial<User>> {
    return this.updateUserDtoMapper.toUpdatedData(dto);
  }
}
```

#### Deleter Delegate

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseDeleter } from '@/common/base';
import { User } from '../user.entity';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UserDetailsDtoMapper } from '../factories/user-details.dto.mapper';

@Injectable()
export class UserDeleter extends BaseDeleter<User, UserDetailsDto> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    detailsMapper: UserDetailsDtoMapper,
  ) {
    super(repository, detailsMapper);
  }

  protected getEntityName(): string {
    return 'Usuário';
  }

  // Hook: executado antes de deletar
  protected async beforeDelete(entity: User): Promise<void> {
    // Validações antes de deletar, ex: verificar dependências
    console.log(`Preparando para deletar usuário: ${entity.name}`);
  }
}
```

### 3. Service estendendo BaseService

```typescript
import { Injectable } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UserListDto } from './dto/responses/user-list.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserRegister } from './delegates/user-register';
import { UserReader } from './delegates/user-reader';
import { UserUpdater } from './delegates/user-updater';
import { UserDeleter } from './delegates/user-deleter';

@Injectable()
export class UserService extends BaseService<
  User,
  RegisterUserDto,
  UpdateUserDto,
  UserListDto,
  UserDetailsDto
> {
  constructor(
    creator: UserRegister,
    reader: UserReader,
    updater: UserUpdater,
    deleter: UserDeleter,
  ) {
    super(creator, reader, updater, deleter);
  }

  // Métodos específicos do UserService
  async getUserByEmailForAuth(email: string): Promise<User | null> {
    return await (this.reader as UserReader).getUserByEmailForAuth(email);
  }
}
```

### 4. Controller estendendo BaseController

```typescript
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BaseController } from '@/common/base';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UserListDto } from './dto/responses/user-list.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { ControllerResponseDto } from '../dtos/responses/controller-response.dto';

@Controller('user')
export class UserController extends BaseController<
  User,
  RegisterUserDto,
  UpdateUserDto,
  UserListDto,
  UserDetailsDto
> {
  constructor(service: UserService) {
    super(service);
  }

  protected getEntityName(): string {
    return 'Usuário';
  }

  // Endpoints customizados específicos do User
  @Get('/details')
  @UseGuards(AuthGuard)
  async getUserDetails(
    @Req() request: AuthRequest,
  ): Promise<ControllerResponseDto> {
    const id = request.userData.id;
    const user = await this.service.getById(id);
    return {
      message: `Usuário de ID '${id}' encontrado.`,
      data: user,
    };
  }
}
```

## ✨ Benefícios

1. **Menos Código**: Reduz drasticamente a quantidade de código boilerplate
2. **Consistência**: Todos os módulos seguem a mesma estrutura e padrões
3. **Manutenibilidade**: Mudanças na lógica base afetam todos os módulos automaticamente
4. **Flexibilidade**: Hooks `beforeCreate`, `afterCreate`, etc. permitem customização
5. **Type Safety**: TypeScript Generics garantem type safety em toda a aplicação
6. **Extensibilidade**: Fácil adicionar métodos customizados mantendo funcionalidade base

## 🔧 Customização

Cada delegate, service e controller pode:
- Sobrescrever métodos base se necessário
- Adicionar métodos específicos do domínio
- Usar hooks para adicionar lógica antes/depois de operações
- Customizar mensagens de sucesso/erro

## 📝 Exemplo Completo

Veja o módulo User refatorado como exemplo de implementação completa usando as classes base.
