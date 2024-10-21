import BaseModel, { IBaseModel } from "./BaseModel";

export interface IVehicle extends IBaseModel {

    plate: string;
    model: string;
    year: number;
    brand: string;

}

class Vehicle extends BaseModel implements IVehicle {

    plate: string;
    model: string;
    brand: string;
    year: number;

    constructor(id: string, plate: string, model: string, brand: string, year: number, createdAt: Date, updatedAt: Date, isActive: boolean) {

        super(id, createdAt, updatedAt, isActive);
        this.plate = plate;
        this.model = model;
        this.brand = brand;
        this.year = year;

    }

    toJSON(): object {
        return {
            id: this.id,
            plate: this.plate,
            model: this.model,
            brand: this.brand,
            year: this.year
        };
    }
}

export default Vehicle;