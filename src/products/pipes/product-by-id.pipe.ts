import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ProductsService, type Product } from '../products.service.js';

@Injectable()
export class ProductByIdPipe implements PipeTransform<string, Product> {
  constructor(private readonly productsService: ProductsService) {}

  transform(id: string, metadata: ArgumentMetadata): Product {
    if (!isUUID(id)) {
      throw new BadRequestException(`"${metadata.data}" must be a valid UUID`);
    }
    return this.productsService.findOne(id); // throws 404 if it does not exist
  }
}
