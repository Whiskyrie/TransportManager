import BaseService from "./BaseServices";
import Driver from "../Models/Driver";

class DriverService extends BaseService<Driver> {

    getAvaliableDrivers(): Driver[] {
        return this.items.filter(driver => !driver.isAvailable && driver.isActive && driver.isLicenceValid());
    }

    setAvaliability(id: string, isAvailable: boolean): Driver | undefined {
        const driver = this.getById(id);
        if (driver) {
            driver.setIsAvailable(isAvailable);
            return driver;
        }
        return undefined;
    }

    getDriversWithExpiringLicense(daysThreshold: number): Driver[] {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
        return this.items.filter(driver => driver.licenseExpiration <= thresholdDate);
    }

}

export default new DriverService();