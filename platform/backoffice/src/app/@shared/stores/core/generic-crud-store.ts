import { Store, StoreConfig } from '@datorama/akita';

export interface IMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Represents the state of an entity with a list of items.
 */
export interface EntityState<T> {
  items: T[];
  meta: IMeta;
}

/**
 * Creates the initial state for an entity with an empty list of items.
 */
export function createInitialState<T>(): EntityState<T> {
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

/**
 * A generic store for handling CRUD operations on entities.
 * @template T - The type of entity to manage. It should include an "id" property.
 */
@StoreConfig({ name: 'generic-crud' })
export class GenericCrudStore<T extends { id: string }> extends Store<EntityState<T>> {
  constructor() {
    super(createInitialState<T>());
  }

  /**
   * Adds a new item to the store.
   * @param item - The item to add.
   */
  public addItem(item: T) {
    this.update((state) => {
      return {
        ...state,
        items: [item, ...state.items],
      };
    });
  }

  /**
   * Removes an item from the store by its ID.
   * @param id - The ID of the item to remove.
   */
  public removeItem(id: string) {
    this.update((state) => {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== id),
      };
    });
  }

  /**
   * Updates an item in the store.
   * @param updatedItem - The updated item to replace the existing one.
   */
  public updateItem(updatedItem: T) {
    this.update((state) => {
      const index = state.items.findIndex((item) => item.id === updatedItem.id);
      if (index > -1) {
        const updatedItems = [...state.items];
        updatedItems[index] = updatedItem;
        return {
          ...state,
          items: updatedItems,
        };
      }
      return state;
    });
  }
}
