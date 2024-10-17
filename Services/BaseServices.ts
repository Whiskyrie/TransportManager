import BaseModel from "../Models/BaseModel";

abstract class BaseService<T extends BaseModel> {

    protected items: T[] = [];

    create(item: T): T {
        this.items.push(item);
        return item;
    }

    getAll(): T[] {
        return this.items;
    }

    getById(id: string): T | undefined {
        return this.items.find(item => item.id === id);
    }

    update(id: string, updatedItem: Partial<T>): T | undefined {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...updatedItem };
            return this.items[index];
        }
        return undefined;
    }

    delete(id: string): boolean {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
}

export default BaseService;

