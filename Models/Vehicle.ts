import BaseModel, { IBaseModel } from "./BaseModel";

export interface IVehicle extends IBaseModel {

    plate: string;
    model: string;
    capacity: number;
    inUse: boolean;

}

class Vehicle extends BaseModel implements IVehicle {

    plate: string;
    model: string;
    capacity: number;
    inUse: boolean;

    constructor(id: string, plate: string, model: string, capacity: number, createdAt: Date, updatedAt: Date, isActive: boolean) {

        super(id, createdAt, updatedAt, isActive);
        this.plate = plate;
        this.model = model;
        this.capacity = capacity;
        this.inUse = false;

    }

    startUse(): void {
        this.inUse = true;
        this.updateTimestamp();
    }

    endUse(): void {
        this.inUse = false;
        this.updateTimestamp();
    }

    getStatus(): string {
        return this.inUse ? 'Indisponível' : 'Disponível';
    }

    toJSON(): object {
        return {
            id: this.id,
            plate: this.plate,
            model: this.model,
            capacity: this.capacity,
            inUse: this.inUse,
        };
    }
}

export default Vehicle;