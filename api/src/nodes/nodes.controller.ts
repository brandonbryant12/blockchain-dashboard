import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Public } from 'src/auth/public.decorator';

interface NodeConfig {
  id: number;
  ticker: string;
  name: string;
  icon: string;
}

interface NodeInfo extends NodeConfig {
  currentBlock: number;
  healthy: boolean;
  error?: string;
}

@Controller('nodes')
export class NodesController {
  private readonly nodeConfigs: NodeConfig[] = [
    { id: 1, ticker: 'BTC', name: 'Bitcoin Node', icon: '/btc.png' },
    {
      id: 2,
      ticker: 'FB',
      name: 'Fractal Bitcoin Node',
      icon: '/fractal.jpeg',
    },
    { id: 3, ticker: 'BELLS', name: 'Bellscoin Node', icon: '/bells.png' },
  ];

  constructor(private readonly blockchainService: BlockchainService) {}

  @Public()
  @Get()
  async getAllNodes(): Promise<NodeInfo[]> {
    return Promise.all(
      this.nodeConfigs.map((config) => this.getNodeInfoHelper(config)),
    );
  }

  @Public()
  @Get(':ticker')
  async getNodeInfo(@Param('ticker') ticker: string): Promise<NodeInfo> {
    const nodeConfig = this.nodeConfigs.find((node) => node.ticker === ticker);
    if (!nodeConfig) {
      throw new NotFoundException(`Node with ticker ${ticker} not found`);
    }
    return this.getNodeInfoHelper(nodeConfig);
  }

  private async getNodeInfoHelper(config: NodeConfig): Promise<NodeInfo> {
    try {
      const info = await this.blockchainService.getBlockchainInfo(
        config.ticker,
      );
      return {
        ...config,
        currentBlock: info.blocks,
        healthy: true,
        name: info.chain || config.name,
      };
    } catch (error) {
      return {
        ...config,
        currentBlock: 0,
        healthy: false,
        error: error.message,
      };
    }
  }
}
