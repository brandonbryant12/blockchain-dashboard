/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { RpcClient } from '@/lib/rpcClient';
import { NodeInfo } from '@/lib/types';

/**
 * Helper function to fetch blockchain info from a node.
 * @param client - The RPC client instance.
 * @param nodeDetails - Details about the node.
 * @returns A promise that resolves to a NodeInfo object.
 */
async function fetchNodeInfo(
  client: RpcClient,
  nodeDetails: { id: number; name: string; ticker: string; icon: string }
): Promise<NodeInfo> {
  try {
    const info = await client.call('getblockchaininfo');
    console.log({ [nodeDetails.name]: info });
    return {
      id: nodeDetails.id,
      name: nodeDetails.name,
      ticker: nodeDetails.ticker,
      currentBlock: info.blocks,
      healthy: true,
      icon: nodeDetails.icon,
    };
  } catch (error: any) {
    console.error(`Error fetching ${nodeDetails.name} status:`, error.message);
    return {
      id: nodeDetails.id,
      name: nodeDetails.name,
      ticker: nodeDetails.ticker,
      currentBlock: 0,
      healthy: false,
      icon: nodeDetails.icon,
      error: error.message,
    };
  }
}

export async function getNodeStatus(): Promise<NodeInfo[]> {
  // Initialize RPC Clients for each node
  const btcClient = new RpcClient({
    connectionUrl: process.env.BTC_RPC_URL!,
  });

  const fractalClient = new RpcClient({
    connectionUrl: process.env.FRACTAL_RPC_URL!,
  });

  const bellsClient = new RpcClient({
    connectionUrl: process.env.BELLS_RPC_URL!,
  });

  // Define node details
  const nodesDetails = [
    {
      client: btcClient,
      details: { id: 1, name: 'Bitcoin Node', ticker: 'BTC', icon: '/btc.png' },
    },
    {
      client: fractalClient,
      details: { id: 2, name: 'Fractal Bitcoin Node', ticker: 'FBTC', icon: '/fractal.jpeg' },
    },
    {
      client: bellsClient,
      details: { id: 3, name: 'Bellscoin Node', ticker: 'BELLS', icon: '/bells.png' },
    },
  ];

  // Create an array of promises for fetching node info
  const fetchPromises = nodesDetails.map(({ client, details }) =>
    fetchNodeInfo(client, details)
  );

  // Execute all fetch operations in parallel
  const nodes = await Promise.all(fetchPromises);

  return nodes;
}
