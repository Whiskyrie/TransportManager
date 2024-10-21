import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RoutesModule } from './routes/routes.module';
import { DriverModule } from './driver/driver.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { DriverModule } from './driver/driver.module';

@Module({
  imports: [DatabaseModule, RoutesModule, DriverModule, VehicleModule],
})
export class AppModule { }