export interface IBaseModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
abstract class BaseModel implements IBaseModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;

    constructor(id: string, createdAt: Date, updatedAt: Date, isActive: boolean) {
        this.id = id;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isActive = true;
    }

    activate(): void {
        this.isActive = true;
        this.updateTimestamp();
    }

    protected updateTimestamp(): void {
        this.updatedAt = new Date();
    }

    abstract toJSON(): object;
}

export default BaseModel;
