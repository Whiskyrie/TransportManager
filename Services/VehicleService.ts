import BaseService from "./BaseServices";
import Vehicle from "../Models/Vehicle";

class VehicleService extends BaseService<Vehicle> {

    getAvailableVehicles(): Vehicle[] {
        return this.items.filter(vehicle => !vehicle.inUse && vehicle.isActive);
    }


    startUse(id: string): Vehicle | undefined {
        const vehicle = this.getById(id);
        if (vehicle && !vehicle.inUse) {
            vehicle.inUse = true;
            vehicle.startUse();
            return vehicle;
        }
        return undefined;
    }

    endUse(id: string): Vehicle | undefined {
        const vehicle = this.getById(id);
        if (vehicle && vehicle.inUse) {
            vehicle.endUse();
            return vehicle;
        }
        return undefined;
    }
}

export default new VehicleService();