import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [DatabaseModule, RoutesModule],
})
export class AppModule { }