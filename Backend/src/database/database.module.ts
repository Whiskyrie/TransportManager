import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../routes/entities/route.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '811920',
            database: 'postgres',
            entities: [Route, Driver, Vehicle], // Inclua todas as entidades aqui
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Route, Driver, Vehicle]), // Inclua todas as entidades aqui
    ],
    providers: [DatabaseService],
    controllers: [DatabaseController],
})
export class DatabaseModule { }
