import { Module } from '@nestjs/common'
import { GoogleIntegrationModule } from '../google-integration/google-integration.module'
import { UserSearchController } from './user-search.controller'
import { UserSearchService } from './user-search.service'

@Module({
  imports: [],
  controllers: [UserSearchController],
  providers: [UserSearchService],
})
export class UserSearchModule {}
