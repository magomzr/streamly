import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SecretsService } from '../services/secrets.service';

@Controller('secrets')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  @Get()
  async findAll() {
    return this.secretsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: { name: string; value: string }) {
    return this.secretsService.create(body.name, body.value);
  }

  @Put(':name')
  async update(@Param('name') name: string, @Body() body: { value: string }) {
    return this.secretsService.update(name, body.value);
  }

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('name') name: string) {
    await this.secretsService.delete(name);
  }
}
