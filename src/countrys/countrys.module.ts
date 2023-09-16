import { Module } from '@nestjs/common';
import { CountrysService } from './countrys.service';
import { CountrysController } from './countrys.controller';

@Module({
  controllers: [CountrysController],
  providers: [CountrysService],
})
export class CountrysModule {}
