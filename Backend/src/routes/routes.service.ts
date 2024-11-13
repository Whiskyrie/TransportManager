// routes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './entities/route.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Driver } from '../driver/entities/driver.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) { }

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const { vehicleId, driverId } = createRouteDto;

    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID "${vehicleId}" not found`);
    }

    const driver = await this.driverRepository.findOne({ where: { id: driverId } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID "${driverId}" not found`);
    }

    const route = this.routeRepository.create({
      ...createRouteDto,
      vehicle,
      driver,
    });

    return await this.routeRepository.save(route);
  }

  async findAll(): Promise<Route[]> {
    return await this.routeRepository.find();
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { id } });
    if (!route) {
      throw new NotFoundException(`Route with ID "${id}" not found`);
    }
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<Route> {
    const route = await this.findOne(id);
    Object.assign(route, updateRouteDto);
    return await this.routeRepository.save(route);
  }

  async remove(id: string): Promise<void> {
    const result = await this.routeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Route with ID "${id}" not found`);
    }
  }

  async start(id: string): Promise<Route> {
    const route = await this.findOne(id);
    route.start();
    return await this.routeRepository.save(route);
  }

  async complete(id: string): Promise<Route> {
    const route = await this.findOne(id);
    route.complete();
    return await this.routeRepository.save(route);
  }

  async cancel(id: string): Promise<Route> {
    const route = await this.findOne(id);
    route.cancel();
    return await this.routeRepository.save(route);
  }
}
