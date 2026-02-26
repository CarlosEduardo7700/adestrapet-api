import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { IBaseEntity } from './interfaces/base-entity.interface';
import { ControllerResponseDto } from '../../modules/dtos/responses/controller-response.dto';
import { AuthGuard } from '../../modules/auth/guards/auth.guard';

/**
 * Classe base abstrata para Controllers
 * Fornece endpoints CRUD genéricos
 *
 * @template TEntity - Tipo da entidade
 * @template TCreateDto - Tipo do DTO de criação
 * @template TUpdateDto - Tipo do DTO de atualização
 * @template TListDto - Tipo do DTO para listagem
 * @template TDetailsDto - Tipo do DTO para detalhes
 */
export abstract class BaseController<
  TEntity extends IBaseEntity,
  TCreateDto,
  TUpdateDto,
  TListDto,
  TDetailsDto,
> {
  constructor(
    protected readonly service: BaseService<
      TEntity,
      TCreateDto,
      TUpdateDto,
      TListDto,
      TDetailsDto
    >,
  ) {}

  /**
   * Endpoint POST para criar uma nova entidade
   * @param dto - DTO com dados para criação
   * @returns Promise com resposta padronizada
   */
  @Post()
  async create(@Body() dto: TCreateDto): Promise<ControllerResponseDto> {
    const result: TDetailsDto = await this.service.create(dto);
    return {
      message: this.getCreateSuccessMessage(),
      data: result,
    };
  }

  /**
   * Endpoint GET para listar entidades com paginação
   * @param page - Número da página
   * @param limit - Itens por página
   * @returns Promise com resposta padronizada
   */
  @Get()
  @UseGuards(AuthGuard)
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ControllerResponseDto> {
    const results: TListDto[] = await this.service.getAll(page, limit);
    return {
      message: this.getListSuccessMessage(results.length),
      data: results,
    };
  }

  /**
   * Endpoint GET para buscar uma entidade por ID
   * @param id - ID da entidade
   * @returns Promise com resposta padronizada
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  async getById(@Param('id') id: string): Promise<ControllerResponseDto> {
    const result: TDetailsDto = await this.service.getById(id);
    return {
      message: this.getByIdSuccessMessage(id),
      data: result,
    };
  }

  /**
   * Endpoint PATCH para atualizar uma entidade
   * @param id - ID da entidade
   * @param dto - DTO com dados para atualização
   * @returns Promise com resposta padronizada
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: TUpdateDto,
  ): Promise<ControllerResponseDto> {
    const result: TDetailsDto = await this.service.update(id, dto);
    return {
      message: this.getUpdateSuccessMessage(id),
      data: result,
    };
  }

  /**
   * Endpoint DELETE para deletar uma entidade
   * @param id - ID da entidade
   * @returns Promise com resposta padronizada
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string): Promise<ControllerResponseDto> {
    const result: TDetailsDto = await this.service.delete(id);
    return {
      message: this.getDeleteSuccessMessage(id),
      data: result,
    };
  }

  /**
   * Métodos abstratos para mensagens customizadas
   * Devem ser implementados pelas classes filhas
   */
  protected abstract getEntityName(): string;

  protected getCreateSuccessMessage(): string {
    return `${this.getEntityName()} cadastrado com sucesso!`;
  }

  protected getListSuccessMessage(count: number): string {
    return `Quantidade de ${this.getEntityName().toLowerCase()}s encontrados: ${count}.`;
  }

  protected getByIdSuccessMessage(id: string): string {
    return `${this.getEntityName()} de ID '${id}' encontrado.`;
  }

  protected getUpdateSuccessMessage(id: string): string {
    return `${this.getEntityName()} de ID '${id}' atualizado.`;
  }

  protected getDeleteSuccessMessage(id: string): string {
    return `${this.getEntityName()} de ID ${id} deletado.`;
  }
}
