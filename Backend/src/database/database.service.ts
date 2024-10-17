import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from '../routes/entities/route.entity';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectRepository(Route)
        private readonly routeRepository: Repository<Route>,
    ) { }

    async testConnection(): Promise<boolean> {
        try {
            await this.routeRepository.findOne({ where: {} }); // Consulta simples
            return true;
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error);
            return false;
        }
    }
}
