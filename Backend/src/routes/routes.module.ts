// routes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Route } from './entities/route.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Driver } from '../driver/entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Vehicle, Driver])],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule { }
