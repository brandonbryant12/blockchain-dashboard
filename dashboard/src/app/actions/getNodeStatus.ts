/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { RpcClient } from '@/lib/rpcClient';
import { NodeInfo } from '@/lib/types';

export async function getNodeStatus(): Promise<NodeInfo[]> {
  const nodes: NodeInfo[] = [];
  const btcClient = new RpcClient({
    protocol: 'http',
    user: process.env.BTC_RPC_USER!,
    pass: process.env.BTC_RPC_PASSWORD!,
    host: "btc-node",
    port: parseInt(process.env.BTC_RPC_PORT!),
  });
  const fractalClient = new RpcClient({
    protocol: 'http',
    user: process.env.FRACTAL_RPC_USER!,
    pass: process.env.FRACTAL_RPC_PASSWORD!,
    host: "fractal-node",
    port: parseInt(process.env.FRACTAL_RPC_PORT!),
  });

  try {
    const btcInfo = await btcClient.call('getblockchaininfo');
    nodes.push({
      id: 1,
      name: 'Bitcoin Node',
      ticker: 'BTC',
      currentBlock: btcInfo.blocks,
      healthy: true,
      icon: '/btc.png'  // Reference to the icon in the public directory
    });
    console.log({ btcInfo });
  } catch (error: any) {
    console.error('Error fetching BTC node status:', error.message);
    const errorMessage = process.env.BTC_RPC_USER as string + process.env.BTC_RPC_HOST + process.env.BTC_RPC_PORT + ' ' + error.message;
    nodes.push({
      id: 1,
      name: 'Bitcoin Node',
      ticker: 'BTC',
      currentBlock: 0,
      healthy: false,
      icon: '/btc.png', // Even for unhealthy state, we use the same icon
      error: error.message
    });
  }

  try {
    const fractalInfo = await fractalClient.call('getblockchaininfo');
    nodes.push({
      id: 2,
      name: 'Fractal Bitcoin Node',
      ticker: 'FBTC',
      currentBlock: fractalInfo.blocks,
      healthy: true,
      icon: '/fractal.jpeg'  // Reference to the icon in the public directory
    });
  } catch (error: any) {
    console.error('Error fetching Fractal node status:', error.message);
    const errorMessage = process.env.FRACTAL_RPC_USER as string + process.env.FRACTAL_RPC_HOST + process.env.FRACTAL_RPC_PORT + ' ' + error.message;
    nodes.push({
      id: 2,
      name: 'Fractal Bitcoin Node',
      ticker: 'FBTC',
      currentBlock: 0,
      healthy: false,
      icon: '/fractal.jpeg', // Even for unhealthy state, we use the same icon
      error: errorMessage,
    });
  }

  return nodes;
}