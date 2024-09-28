import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { NodesController } from './nodes/nodes.controller';
import { NodesModule } from './nodes/nodes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    BlockchainModule,
    NodesModule,
  ],
  controllers: [NodesController],
  providers: [],
})
export class AppModule {}
