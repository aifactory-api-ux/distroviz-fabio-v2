import { Module, Global } from '@nestjs/common';
import { DbService } from './db.service';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [DbService, CacheService],
  exports: [DbService, CacheService],
})
export class SharedModule {}