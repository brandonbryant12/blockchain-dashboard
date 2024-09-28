import { Module } from '@nestjs/common';
import { NodesController } from './nodes.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule], // Import BlockchainModule here
  controllers: [NodesController],
})
export class NodesModule {}
