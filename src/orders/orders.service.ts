import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';

@Injectable()
export class OrdersService {
  constructor(private readonly productsService: ProductsService) {}

  quote(items: { productId: string; quantity: number }[]) {
    const lines = items.map(({ productId, quantity }) => {
      const product = this.productsService.findOne(productId);
      return {
        productId,
        quantity,
        lineTotalCents: product.priceCents * quantity,
      };
    });
    const totalCents = lines.reduce(
      (sum, line) => sum + line.lineTotalCents,
      0,
    );
    return { lines, totalCents };
  }
}
