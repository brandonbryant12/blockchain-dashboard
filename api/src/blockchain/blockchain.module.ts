// blockchain.module.ts
import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Module({
  providers: [BlockchainService],
  exports: [BlockchainService], // Export the service here
})
export class BlockchainModule {}
