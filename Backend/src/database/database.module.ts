import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Route } from '../routes/entities/route.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { User } from '../auth/entities/user.entity';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [Route, Driver, Vehicle, User],
                synchronize: configService.get('NODE_ENV') === 'development',
                logging: configService.get('NODE_ENV') === 'development',
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Route, Driver, Vehicle, User]),
    ],
    providers: [DatabaseService],
    controllers: [DatabaseController],
})
export class DatabaseModule { }