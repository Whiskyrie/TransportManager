import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) { }

    @Get('test-connection')
    async testConnection(): Promise<string> {
        const isConnected = await this.databaseService.testConnection();
        return isConnected ? 'Conexão bem-sucedida!' : 'Falha na conexão.';
    }
}
