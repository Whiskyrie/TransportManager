import BaseModel, { IBaseModel } from "./BaseModel";

export interface IDriver extends IBaseModel {

    name: string;
    licenseNumber: string;
    isAvailable: boolean;

}

class Driver extends BaseModel implements IDriver {
    name: string;
    licenseNumber: string;
    isAvailable: boolean;

    constructor(id: string, name: string, licenseNumber: string, createdAt: Date, updatedAt: Date, isActive: boolean) {
        super(id, createdAt, updatedAt, isActive);
        this.name = name;
        this.licenseNumber = licenseNumber;
        this.isAvailable = true;
    }

    setIsAvailable(isAvailable: boolean): void {
        this.isAvailable = isAvailable;
        this.updateTimestamp();
    }

    toJSON(): object {
        return {
            name: this.name,
            licenseNumber: this.licenseNumber,
            isAvailable: this.isAvailable,
        }
    }
}

export default Driver;