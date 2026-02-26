# 🚀 Guia Rápido de Referência

## 📌 Imports

```typescript
// Importar tudo de uma vez
import {
  IBaseEntity,
  IBaseMapper,
  IBaseFactory,
  BaseReader,
  BaseCreator,
  BaseUpdater,
  BaseDeleter,
  BaseService,
  BaseController,
} from '@/common/base';

// Ou importar individualmente
import { BaseService } from '@/common/base/base.service';
```

## 🏗️ Templates Rápidos

### Entidade
```typescript
import { IBaseEntity } from '@/common/base';

@Entity({ name: 'NOME_TABELA' })
export class NomeEntity implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Seus campos aqui

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
```

### Reader Delegate
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseReader } from '@/common/base';

@Injectable()
export class NomeReader extends BaseReader<Entity, ListDto, DetailsDto> {
  constructor(
    @InjectRepository(Entity)
    repository: Repository<Entity>,
    listMapper: ListDtoMapper,
    detailsMapper: DetailsDtoMapper,
  ) {
    super(repository, listMapper, detailsMapper);
  }

  protected getEntityName(): string {
    return 'Nome da Entidade';
  }

  // Métodos customizados aqui
}
```

### Creator Delegate
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCreator } from '@/common/base';

@Injectable()
export class NomeCreator extends BaseCreator<Entity, CreateDto, DetailsDto> {
  constructor(
    @InjectRepository(Entity)
    repository: Repository<Entity>,
    factory: EntityFactory,
    detailsMapper: DetailsDtoMapper,
  ) {
    super(repository, factory, detailsMapper);
  }

  // Hooks opcionais
  protected async beforeCreate(dto: CreateDto): Promise<void> {
    // Validações antes de criar
  }

  protected async afterCreate(entity: Entity): Promise<void> {
    // Ações após criar
  }
}
```

### Updater Delegate
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUpdater } from '@/common/base';

@Injectable()
export class NomeUpdater extends BaseUpdater<Entity, UpdateDto, DetailsDto> {
  constructor(
    @InjectRepository(Entity)
    repository: Repository<Entity>,
    detailsMapper: DetailsDtoMapper,
    private readonly updateMapper: UpdateDtoMapper,
  ) {
    super(repository, detailsMapper);
  }

  protected getEntityName(): string {
    return 'Nome da Entidade';
  }

  // OBRIGATÓRIO
  protected async mapDtoToEntity(dto: UpdateDto): Promise<Partial<Entity>> {
    return this.updateMapper.toUpdatedData(dto);
  }

  // Hooks opcionais
  protected async beforeUpdate(entity: Entity, dto: UpdateDto): Promise<void> {
    // Validações antes de atualizar
  }

  protected async afterUpdate(entity: Entity): Promise<void> {
    // Ações após atualizar
  }
}
```

### Deleter Delegate
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseDeleter } from '@/common/base';

@Injectable()
export class NomeDeleter extends BaseDeleter<Entity, DetailsDto> {
  constructor(
    @InjectRepository(Entity)
    repository: Repository<Entity>,
    detailsMapper: DetailsDtoMapper,
  ) {
    super(repository, detailsMapper);
  }

  protected getEntityName(): string {
    return 'Nome da Entidade';
  }

  // Hooks opcionais
  protected async beforeDelete(entity: Entity): Promise<void> {
    // Validações antes de deletar
  }

  protected async afterDelete(entity: Entity): Promise<void> {
    // Ações após deletar
  }
}
```

### Service
```typescript
import { Injectable } from '@nestjs/common';
import { BaseService } from '@/common/base';

@Injectable()
export class NomeService extends BaseService<
  Entity,
  CreateDto,
  UpdateDto,
  ListDto,
  DetailsDto
> {
  constructor(
    creator: NomeCreator,
    reader: NomeReader,
    updater: NomeUpdater,
    deleter: NomeDeleter,
  ) {
    super(creator, reader, updater, deleter);
  }

  // Métodos customizados aqui
}
```

### Controller
```typescript
import { Controller } from '@nestjs/common';
import { BaseController } from '@/common/base';

@Controller('rota')
export class NomeController extends BaseController<
  Entity,
  CreateDto,
  UpdateDto,
  ListDto,
  DetailsDto
> {
  constructor(service: NomeService) {
    super(service);
  }

  protected getEntityName(): string {
    return 'Nome da Entidade';
  }

  // Opcional: customizar mensagens
  protected getCreateSuccessMessage(): string {
    return 'Mensagem customizada!';
  }

  // Endpoints customizados aqui
}
```

### Module
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [NomeController],
  providers: [
    NomeService,
    NomeCreator,
    NomeReader,
    NomeUpdater,
    NomeDeleter,
    EntityFactory,
    DetailsDtoMapper,
    ListDtoMapper,
    UpdateDtoMapper,
  ],
  exports: [NomeService],
})
export class NomeModule {}
```

## 📋 Checklist de Criação de Novo Módulo

- [ ] Criar entidade implementando `IBaseEntity`
- [ ] Criar DTOs (CreateDto, UpdateDto, ListDto, DetailsDto)
- [ ] Criar Factory implementando `IBaseFactory`
- [ ] Criar Mappers
- [ ] Criar Reader estendendo `BaseReader`
- [ ] Criar Creator estendendo `BaseCreator`
- [ ] Criar Updater estendendo `BaseUpdater`
- [ ] Criar Deleter estendendo `BaseDeleter`
- [ ] Criar Service estendendo `BaseService`
- [ ] Criar Controller estendendo `BaseController`
- [ ] Criar Module registrando todos os providers
- [ ] Adicionar Module ao AppModule
- [ ] Criar testes unitários
- [ ] Testar endpoints

## 🎯 Métodos Herdados

### BaseReader
```typescript
getAll(page?, limit?, additionalOptions?): Promise<TListDto[]>
getById(id, relationOptions?): Promise<TDetailsDto>
getEntityById(id, relationOptions?): Promise<TEntity>  // Retorna entidade raw
```

### BaseCreator
```typescript
create(dto): Promise<TDetailsDto>
```

### BaseUpdater
```typescript
update(id, dto): Promise<TDetailsDto>
```

### BaseDeleter
```typescript
delete(id): Promise<TDetailsDto>          // Soft delete
hardDelete(id): Promise<void>             // Hard delete (permanente)
```

### BaseService
```typescript
create(dto): Promise<TDetailsDto>
getAll(page?, limit?): Promise<TListDto[]>
getById(id): Promise<TDetailsDto>
update(id, dto): Promise<TDetailsDto>
delete(id): Promise<TDetailsDto>
```

### BaseController
```typescript
@Post() create(@Body() dto)
@Get() getAll(@Query('page') page, @Query('limit') limit)
@Get(':id') getById(@Param('id') id)
@Patch(':id') update(@Param('id') id, @Body() dto)
@Delete(':id') delete(@Param('id') id)
```

## 🔧 Hooks Disponíveis

### Creator
```typescript
protected async beforeCreate(dto: CreateDto): Promise<void>
protected async afterCreate(entity: Entity): Promise<void>
```

### Updater
```typescript
protected async beforeUpdate(entity: Entity, dto: UpdateDto): Promise<void>
protected async afterUpdate(entity: Entity): Promise<void>
```

### Deleter
```typescript
protected async beforeDelete(entity: Entity): Promise<void>
protected async afterDelete(entity: Entity): Promise<void>
protected async beforeHardDelete(entity: Entity): Promise<void>
protected async afterHardDelete(): Promise<void>
```

## 💡 Dicas Rápidas

### Adicionar validação customizada
```typescript
protected async beforeCreate(dto: CreateDto): Promise<void> {
  const existing = await this.repository.findOne({ where: { email: dto.email } });
  if (existing) throw new Error('Email já existe!');
}
```

### Adicionar relações na busca
```typescript
const user = await this.reader.getById(id, {
  relations: ['lessonProgress'],
});
```

### Customizar ordem de listagem
```typescript
const users = await this.reader.getAll(1, 10, {
  order: { name: 'ASC' },
});
```

### Sobrescrever endpoint base
```typescript
@Get(':id')
@UseGuards(CustomGuard)
async getById(@Param('id') id: string): Promise<ControllerResponseDto> {
  // Implementação customizada
  const result = await this.service.getById(id);
  return {
    message: 'Mensagem customizada',
    data: result,
  };
}
```

### Adicionar endpoint customizado
```typescript
@Get('/search')
@UseGuards(AuthGuard)
async search(@Query('term') term: string): Promise<ControllerResponseDto> {
  // Lógica de busca customizada
  const results = await this.service.customSearchMethod(term);
  return {
    message: `${results.length} resultados encontrados`,
    data: results,
  };
}
```

## ⚡ Configuração de Path Alias

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@common/*": ["src/common/*"],
      "@modules/*": ["src/modules/*"]
    }
  }
}
```

## 🧪 Testando com Jest

```typescript
describe('NomeService', () => {
  let service: NomeService;
  let mockCreator: jest.Mocked<NomeCreator>;
  let mockReader: jest.Mocked<NomeReader>;
  let mockUpdater: jest.Mocked<NomeUpdater>;
  let mockDeleter: jest.Mocked<NomeDeleter>;

  beforeEach(() => {
    mockCreator = {
      create: jest.fn(),
    } as any;

    mockReader = {
      getAll: jest.fn(),
      getById: jest.fn(),
    } as any;

    mockUpdater = {
      update: jest.fn(),
    } as any;

    mockDeleter = {
      delete: jest.fn(),
    } as any;

    service = new NomeService(
      mockCreator,
      mockReader,
      mockUpdater,
      mockDeleter,
    );
  });

  it('deve criar uma entidade', async () => {
    const dto = { /* ... */ };
    const expected = { /* ... */ };
    
    mockCreator.create.mockResolvedValue(expected);
    
    const result = await service.create(dto);
    
    expect(mockCreator.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });
});
```

## 📖 Documentação Completa

- [README.md](./README.md) - Guia completo
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Guia de migração
- [COMPARISON.md](./COMPARISON.md) - Análise antes/depois
- [OVERVIEW.md](./OVERVIEW.md) - Visão geral do projeto
- [examples/](./examples/) - Exemplos práticos

---

**Dica:** Salve este arquivo como favorito para consultas rápidas! 🌟
