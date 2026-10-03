import { Injectable } from '@nestjs/common';

export interface Category {
  id: string;
  name: string;
}

@Injectable()
export class CategoriesService {
  private readonly categories: Category[] = [
    {
      id: '13',
      name: 'Tech',
    },
    {
      id: '1',
      name: 'Clothes',
    },
    {
      id: '2',
      name: 'Furniture',
    },
  ];

  findAll(): Category[] {
    return this.categories;
  }
}
