import { Module } from '@nestjs/common'
import { GoogleIntegrationService } from './google-integration.service'
import { GoogleIntegrationController } from './google-integration.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  controllers: [GoogleIntegrationController],
  providers: [GoogleIntegrationService],
  exports: [GoogleIntegrationService], // Exportando o serviço para ser usado em outros módulos
})
export class GoogleIntegrationModule {}
