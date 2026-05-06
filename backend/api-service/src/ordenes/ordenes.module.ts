import { Module } from '@nestjs/common';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';
import { DbService } from '../shared/db.service';
import { CacheService } from '../shared/cache.service';

@Module({
  controllers: [OrdenesController],
  providers: [OrdenesService, DbService, CacheService],
})
export class OrdenesModule {}