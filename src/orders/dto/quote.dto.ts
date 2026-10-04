import { PickType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto.js';

export class QuoteDto extends PickType(CreateOrderDto, ['items'] as const) {}
