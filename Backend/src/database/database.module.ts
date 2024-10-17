import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../routes/entities/route.entity'; // Importe a entidade Route
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
            entities: [Route],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Route]), // Inclua isso para garantir que o Repositório Route seja importado corretamente
    ],
    providers: [DatabaseService],
    controllers: [DatabaseController],
})
export class DatabaseModule { }
