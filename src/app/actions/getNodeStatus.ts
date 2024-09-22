'use server';

import { RpcClient } from '@/lib/rpcClient';
import { NodeInfo } from '@/lib/types';

export async function getNodeStatus(): Promise<NodeInfo[]> {
  const nodes: NodeInfo[] = [];

  // Configure RPC clients
  const btcClient = new RpcClient({
    protocol: 'http',
    user: process.env.BTC_RPC_USER!,
    pass: process.env.BTC_RPC_PASSWORD!,
    host: 'localhost',
    port: 8332, // Adjust as per your setup
  });

  const fractalClient = new RpcClient({
    protocol: 'http',
    user: process.env.FRACTAL_RPC_USER!,
    pass: process.env.FRACTAL_RPC_PASSWORD!,
    host: 'localhost',
    port: 8334, // Adjust as per your setup
  });

  // Fetch BTC node status
  try {
    const btcInfo = await btcClient.call('getblockchaininfo');
    nodes.push({
      id: 1,
      name: 'Bitcoin Node',
      ticker: 'BTC',
      currentBlock: btcInfo.blocks,
      healthy: true,
    });
  } catch (error: any) {
    console.error('Error fetching BTC node status:', error.message);
    nodes.push({
      id: 1,
      name: 'Bitcoin Node',
      ticker: 'BTC',
      currentBlock: 0,
      healthy: false,
    });
  }

  // Fetch Fractal node status
  try {
    const fractalInfo = await fractalClient.call('getblockchaininfo');
    nodes.push({
      id: 2,
      name: 'Fractal Bitcoin Node',
      ticker: 'FBTC',
      currentBlock: fractalInfo.blocks,
      healthy: true,
    });
  } catch (error: any) {
    console.error('Error fetching Fractal node status:', error.message);
    nodes.push({
      id: 2,
      name: 'Fractal Bitcoin Node',
      ticker: 'FBTC',
      currentBlock: 0,
      healthy: false,
    });
  }

  return nodes;
}
