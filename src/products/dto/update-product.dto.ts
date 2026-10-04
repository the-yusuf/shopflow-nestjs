import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto.js';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
export class UpdateStockDto extends PickType(CreateProductDto, [
  'stock',
] as const) {}
