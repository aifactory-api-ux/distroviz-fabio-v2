import { Module } from '@nestjs/common';
import { OrdenesModule } from './ordenes/ordenes.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { HealthController } from './health.controller';

@Module({
  imports: [SharedModule, OrdenesModule, DashboardModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}