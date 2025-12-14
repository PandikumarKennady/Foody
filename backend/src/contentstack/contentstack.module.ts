import { Module } from '@nestjs/common';
import { ContentstackService } from './contentstack.service';
import { ContentstackController, PersonalizeController } from './contentstack.controller';

@Module({
  controllers: [ContentstackController, PersonalizeController],
  providers: [ContentstackService],
  exports: [ContentstackService],
})
export class ContentstackModule {}

