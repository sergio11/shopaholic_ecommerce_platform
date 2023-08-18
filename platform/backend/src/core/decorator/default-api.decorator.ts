import { Controller, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function ApiController(name: string) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags(name),
    Controller(name)
  );
}