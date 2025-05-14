import { Module } from '@nestjs/common'
import { PersonalLibraryController } from './personal-library.controller'
import { PersonalLibraryService } from './personal-library.service'
import { GoogleIntegrationModule } from '../google-integration/google-integration.module'

@Module({
  imports: [GoogleIntegrationModule],
  controllers: [PersonalLibraryController],
  providers: [PersonalLibraryService],
})
export class PersonalLibraryModule {}
