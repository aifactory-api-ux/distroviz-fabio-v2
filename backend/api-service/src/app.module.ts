import { Module } from '@nestjs/common';
import { OrdenesModule } from './ordenes/ordenes.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [OrdenesModule, DashboardModule],
  controllers: [],
  providers: [],
})
export class AppModule {}