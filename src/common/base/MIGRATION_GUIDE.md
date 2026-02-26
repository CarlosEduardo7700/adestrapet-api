# 🚀 Guia de Migração para Classes Base

Este guia mostra como migrar um módulo existente para usar as classes base reutilizáveis.

## 📋 Checklist de Migração

### Preparação
- [ ] Entenda a estrutura atual do módulo
- [ ] Identifique delegates customizados que precisam ser preservados
- [ ] Faça backup ou commit do código atual
- [ ] Prepare testes unitários para validar a migração

### Migração
- [ ] 1. Atualizar a entidade para implementar `IBaseEntity`
- [ ] 2. Migrar Reader Delegate
- [ ] 3. Migrar Creator Delegate
- [ ] 4. Migrar Updater Delegate
- [ ] 5. Migrar Deleter Delegate
- [ ] 6. Migrar Service
- [ ] 7. Migrar Controller
- [ ] 8. Atualizar Module (providers)
- [ ] 9. Executar testes
- [ ] 10. Testar endpoints manualmente

---

## Passo 1: Atualizar a Entidade

### ✅ Faça a entidade implementar `IBaseEntity`

**Antes:**
```typescript
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ... outros campos

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

**Depois:**
```typescript
import { IBaseEntity } from '@/common/base';

@Entity({ name: 'users' })
export class User implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ... outros campos

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;  // Opcional na interface
}
```

**Nota:** Garanta que sua entidade tem os campos `id`, `createdAt`, `updatedAt` e `deletedAt`.

---

## Passo 2: Migrar Reader Delegate

### ✅ Estender `BaseReader` e mover métodos customizados

**Antes:**
```typescript
@Injectable()
export class UserReader {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userListDtoMapper: UserListDtoMapper,
    private readonly userDetailsDtoMapper: UserDetailsDtoMapper,
  ) {}

  async getUsers(page: number, limit: number): Promise<UserListDto[]> {
    // ... lógica de paginação
  }

  async getUserById(id: string): Promise<UserDetailsDto> {
    // ... busca por ID
  }

  async getUserByEmailForAuth(email: string): Promise<User | null> {
    // ... método customizado
  }
}
```

**Depois:**
```typescript
import { BaseReader } from '@/common/base';

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

  // APENAS métodos customizados (não presentes na classe base)
  async getUserByEmailForAuth(email: string): Promise<User | null> {
    const user: User | null = await this.repository.findOne({
      where: { email },
      select: ['id', 'password', 'email'],
    });
    return user;
  }
}
```

**Mudanças:**
- ✅ Remover métodos `getUsers()` e `getUserById()` (agora são `getAll()` e `getById()`)
- ✅ Manter apenas métodos customizados
- ✅ Implementar `getEntityName()` para mensagens de erro

---

## Passo 3: Migrar Creator Delegate

### ✅ Estender `BaseCreator` e adicionar hooks se necessário

**Antes:**
```typescript
@Injectable()
export class UserRegister {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userFactory: UserFactory,
    private readonly userDetailsDtoMapper: UserDetailsDtoMapper,
  ) {}

  async resgisterUser(dto: RegisterUserDto): Promise<UserDetailsDto> {
    const user: User = await this.userFactory.createFromDto(dto);
    const registeredUser: User = await this.userRepository.save(user);
    const userDetails: UserDetailsDto =
      this.userDetailsDtoMapper.createFromEntity(registeredUser);
    return userDetails;
  }
}
```

**Depois:**
```typescript
import { BaseCreator } from '@/common/base';

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

  // Opcional: validações antes de criar
  protected async beforeCreate(dto: RegisterUserDto): Promise<void> {
    const existingUser = await this.repository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new Error('Email já cadastrado!');
    }
  }

  // Opcional: ações após criar
  protected async afterCreate(entity: User): Promise<void> {
    console.log(`Novo usuário criado: ${entity.name}`);
    // Enviar email, disparar eventos, etc.
  }
}
```

**Mudanças:**
- ✅ Remover método `registerUser()` (agora é `create()` herdado)
- ✅ Adicionar hooks `beforeCreate()` e `afterCreate()` se necessário

---

## Passo 4: Migrar Updater Delegate

### ✅ Estender `BaseUpdater` e implementar `mapDtoToEntity()`

**Antes:**
```typescript
@Injectable()
export class UserUpdater {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly updateUserDtoMapper: UpdateUserDtoMapper,
    private readonly userDetailsDtoMapper: UserDetailsDtoMapper,
  ) {}

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDetailsDto> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error(`Usuário de ID '${id}' não encontrado!`);

    const updatedData = this.updateUserDtoMapper.toUpdatedData(dto);
    Object.assign(user, updatedData);

    const updatedUser: User = await this.userRepository.save(user);
    const userDetails: UserDetailsDto =
      this.userDetailsDtoMapper.createFromEntity(updatedUser);

    return userDetails;
  }
}
```

**Depois:**
```typescript
import { BaseUpdater } from '@/common/base';

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

  // OBRIGATÓRIO: mapear DTO para dados da entidade
  protected async mapDtoToEntity(dto: UpdateUserDto): Promise<Partial<User>> {
    return this.updateUserDtoMapper.toUpdatedData(dto);
  }

  // Opcional: validações antes de atualizar
  protected async beforeUpdate(entity: User, dto: UpdateUserDto): Promise<void> {
    if (dto.email && dto.email !== entity.email) {
      const existingUser = await this.repository.findOne({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new Error('Email já está em uso!');
      }
    }
  }
}
```

**Mudanças:**
- ✅ Remover método `updateUser()` (agora é `update()` herdado)
- ✅ Implementar `mapDtoToEntity()` (obrigatório)
- ✅ Implementar `getEntityName()` para mensagens de erro
- ✅ Adicionar hooks `beforeUpdate()` e `afterUpdate()` se necessário

---

## Passo 5: Migrar Deleter Delegate

### ✅ Estender `BaseDeleter`

**Antes:**
```typescript
@Injectable()
export class UserDeleter {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userDetailsDtoMapper: UserDetailsDtoMapper,
  ) {}

  async deleteUser(id: string): Promise<UserDetailsDto> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error(`Usuário de ID '${id}' não encontrado!`);

    user.deletedAt = new Date();
    const deletedUser: User = await this.userRepository.save(user);
    const userDetails: UserDetailsDto =
      this.userDetailsDtoMapper.createFromEntity(deletedUser);

    return userDetails;
  }
}
```

**Depois:**
```typescript
import { BaseDeleter } from '@/common/base';

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

  // Opcional: validações antes de deletar
  protected async beforeDelete(entity: User): Promise<void> {
    console.log(`Deletando usuário: ${entity.name}`);
    // Verificar dependências, etc.
  }
}
```

**Mudanças:**
- ✅ Remover método `deleteUser()` (agora é `delete()` herdado)
- ✅ Implementar `getEntityName()` para mensagens de erro
- ✅ Adicionar hooks se necessário
- ✅ Bônus: agora também tem `hardDelete()` disponível!

---

## Passo 6: Migrar Service

### ✅ Estender `BaseService`

**Antes:**
```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly userRegister: UserRegister,
    private readonly userReader: UserReader,
    private readonly userUpdater: UserUpdater,
    private readonly userDeleter: UserDeleter,
  ) {}

  async resgisterUser(dto: RegisterUserDto): Promise<UserDetailsDto> {
    return await this.userRegister.resgisterUser(dto);
  }

  async getUsers(page: number, limit: number): Promise<UserListDto[]> {
    return await this.userReader.getUsers(page, limit);
  }

  async getUserById(id: string): Promise<UserDetailsDto> {
    return await this.userReader.getUserById(id);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDetailsDto> {
    return await this.userUpdater.updateUser(id, dto);
  }

  async deleteUser(id: string): Promise<UserDetailsDto> {
    return await this.userDeleter.deleteUser(id);
  }

  // Método customizado
  async getUserByEmailForAuth(email: string): Promise<User | null> {
    return await this.userReader.getUserByEmailForAuth(email);
  }
}
```

**Depois:**
```typescript
import { BaseService } from '@/common/base';

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

  // APENAS métodos customizados
  async getUserByEmailForAuth(email: string): Promise<User | null> {
    return await (this.reader as UserReader).getUserByEmailForAuth(email);
  }
}
```

**Mudanças:**
- ✅ Remover todos os métodos CRUD básicos (create, getAll, getById, update, delete herdados)
- ✅ Manter apenas métodos customizados específicos do domínio

---

## Passo 7: Migrar Controller

### ✅ Estender `BaseController`

**Antes:**
```typescript
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async resgisterUser(@Body() dto: RegisterUserDto): Promise<ControllerResponseDto> {
    const userDetails = await this.userService.resgisterUser(dto);
    return {
      message: 'Usuário cadastrado com sucesso!',
      data: userDetails,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ControllerResponseDto> {
    const users = await this.userService.getUsers(page, limit);
    return {
      message: `Quantidade de usuários encontrados: ${users.length}.`,
      data: users,
    };
  }

  // ... outros endpoints
}
```

**Depois:**
```typescript
import { BaseController } from '@/common/base';

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

  // Opcional: customizar mensagens
  protected getCreateSuccessMessage(): string {
    return 'Usuário cadastrado com sucesso!';
  }

  // APENAS endpoints customizados
  @Get('/details')
  @UseGuards(AuthGuard)
  async getUserDetails(@Req() request: AuthRequest): Promise<ControllerResponseDto> {
    const id = request.userData.id;
    const user = await this.service.getById(id);
    return {
      message: `Usuário de ID '${id}' encontrado.`,
      data: user,
    };
  }
}
```

**Mudanças:**
- ✅ Remover endpoints CRUD básicos (herdados automaticamente)
- ✅ Implementar `getEntityName()` para mensagens
- ✅ Manter apenas endpoints customizados

---

## Passo 8: Atualizar o Module

### ✅ Nenhuma mudança necessária! 🎉

O module continua igual, pois os providers são os mesmos:

```typescript
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
```

---

## Passo 9: Atualizar Chamadas ao Service

### ✅ Atualizar nomes de métodos em outros módulos

Se outros módulos chamam o UserService, você precisa atualizar os nomes dos métodos:

**Antes:**
```typescript
await this.userService.resgisterUser(dto);
await this.userService.getUsers(page, limit);
await this.userService.getUserById(id);
await this.userService.updateUser(id, dto);
await this.userService.deleteUser(id);
```

**Depois:**
```typescript
await this.userService.create(dto);
await this.userService.getAll(page, limit);
await this.userService.getById(id);
await this.userService.update(id, dto);
await this.userService.delete(id);
```

**Nota:** Métodos customizados mantêm os nomes originais:
```typescript
await this.userService.getUserByEmailForAuth(email);  // Sem mudança
```

---

## Passo 10: Executar Testes

### ✅ Verificar se tudo funciona

```powershell
# Executar testes unitários
npm run test

# Executar testes específicos do módulo
npm run test -- user

# Executar modo watch
npm run test:watch

# Verificar cobertura
npm run test:cov
```

---

## Passo 11: Testar Manualmente

### ✅ Testar endpoints com Postman/Insomnia

```bash
POST   /user              # Criar usuário
GET    /user?page=1       # Listar usuários
GET    /user/:id          # Buscar por ID
PATCH  /user/:id          # Atualizar usuário
DELETE /user/:id          # Deletar usuário
```

---

## ⚠️ Troubleshooting

### Problema: "Cannot find module '@/common/base'"

**Solução:** Configurar path alias no `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Problema: Tipos TypeScript não estão corretos

**Solução:** Verificar se os generics estão na ordem correta:

```typescript
BaseService<Entity, CreateDto, UpdateDto, ListDto, DetailsDto>
```

### Problema: Factory não implementa a interface correta

**Solução:** Fazer o factory implementar `IBaseFactory`:

```typescript
export class UserFactory implements IBaseFactory<User, RegisterUserDto> {
  async createFromDto(dto: RegisterUserDto): Promise<User> {
    // ...
  }
}
```

---

## 🎯 Checklist Final

Antes de considerar a migração completa:

- [ ] Todos os testes passam
- [ ] Endpoints funcionam corretamente
- [ ] Validações customizadas estão preservadas
- [ ] Mensagens de erro estão corretas
- [ ] Documentação está atualizada
- [ ] Code review foi feito
- [ ] Deploy em ambiente de teste foi bem-sucedido

---

## 📚 Recursos Adicionais

- [README.md](./README.md) - Documentação completa das classes base
- [COMPARISON.md](./COMPARISON.md) - Comparação antes vs depois
- [examples/](./examples/) - Exemplos de refatoração do User module

## 🤝 Suporte

Se tiver dúvidas durante a migração:
1. Consulte os exemplos em `src/common/base/examples/`
2. Revise a documentação em `src/common/base/README.md`
3. Verifique se sua entidade implementa `IBaseEntity`
4. Confirme que os generics estão na ordem correta
