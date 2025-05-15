import { Module } from '@nestjs/common';
import { DataSourceModule } from './dataSource';
@Module({
  imports: [DataSourceModule],
  providers: [],
  exports: [DataSourceModule],
})
export class DatabaseModule {}
