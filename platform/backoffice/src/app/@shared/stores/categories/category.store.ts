import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  image: string;
  description: string;
}

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ICategoryState {
  items: Category[];
  meta: Meta;
}

export function createInitialState(): ICategoryState {
  return {
    items: [],
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 10,
      totalPages: 0,
      currentPage: 0,
    },
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'category' })
export class CategoryStore extends Store<ICategoryState> {
  constructor() {
    super(createInitialState());
  }

  //* Crete Category
  createCategory(cat: Category) {
    const newData: Category[] = [cat, ...this.getValue().items];
    this.update({
      ...this.getValue(),
      items: newData,
    });
  }

  //* Delete Category
  deleteCategory(id: string) {
    const updatedData: Category[] = this.getValue().items.filter(
      (x: Category) => x.id !== id
    );
    this.update({
      ...this.getValue(),
      items: updatedData,
    });
  }

  //* Update category
  updateCategory(data: Category) {
    const updatedData: Category[] = [...this.getValue().items];
    const idx = updatedData.findIndex((x: Category) => x.id === data.id);
    if (idx !== -1) {
      updatedData[idx] = data;
      this.update({
        ...this.getValue(),
        items: updatedData,
      });
    }
  }

  //* Update meta
  updateMeta(meta: Meta) {
    this.update({
      ...this.getValue(),
      meta: { ...this.getValue().meta, ...meta },
    });
  }
}
