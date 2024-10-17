import BaseModel, { IBaseModel } from "./BaseModel";

export interface IDriver extends IBaseModel {

    name: string;
    licenseNumber: string;
    licenseExpiration: Date;
    isAvailable: boolean;

}

class Driver extends BaseModel implements IDriver {
    name: string;
    licenseNumber: string;
    licenseExpiration: Date;
    isAvailable: boolean;

    constructor(id: string, name: string, licenseNumber: string, licenseExpiration: Date, createdAt: Date, updatedAt: Date, isActive: boolean) {
        super(id, createdAt, updatedAt, isActive);
        this.name = name;
        this.licenseNumber = licenseNumber;
        this.licenseExpiration = licenseExpiration;
        this.isAvailable = true;
    }

    setIsAvailable(isAvailable: boolean): void {
        this.isAvailable = isAvailable;
        this.updateTimestamp();
    }

    isLicenceValid(): boolean {
        return this.licenseExpiration > new Date();
    }

    toJSON(): object {
        return {
            name: this.name,
            licenseNumber: this.licenseNumber,
            licenseExpiration: this.licenseExpiration,
            isAvailable: this.isAvailable,
        }
    }
}

export default Driver;