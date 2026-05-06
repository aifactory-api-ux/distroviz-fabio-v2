import { Module } from '@nestjs/common';
import { OrdenesModule } from './ordenes/ordenes.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthController } from './health.controller';

@Module({
  imports: [OrdenesModule, DashboardModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}