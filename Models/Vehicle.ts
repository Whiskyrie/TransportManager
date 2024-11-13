import { VehicleStatus } from "Types/vehicleTypes";
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
    status: VehicleStatus; // Adicione o status

    constructor(
        id: string,
        plate: string,
        model: string,
        brand: string,
        year: number,
        status: VehicleStatus,
        createdAt: Date,
        updatedAt: Date,
        isActive: boolean
    ) {
        super(id, createdAt, updatedAt, isActive);
        this.plate = plate;
        this.model = model;
        this.brand = brand;
        this.year = year;
        this.status = status;
    }

    toJSON(): object {
        return {
            ...super.toJSON(),
            plate: this.plate,
            model: this.model,
            brand: this.brand,
            year: this.year,
            status: this.status
        };
    }
}
export default Vehicle;