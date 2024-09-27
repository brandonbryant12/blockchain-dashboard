import fetch from 'node-fetch';

interface RpcConfig {
  connectionUrl: string;
}

export class RpcClient {
  private config: RpcConfig;

  constructor(config: RpcConfig) {
    this.config = config;
  }

  async call(method: string, params: any[] = []) {
    const body = JSON.stringify({
      jsonrpc: '1.0',
      id: 'rpc-client',
      method,
      params,
    });

    try {
      const url = new URL(this.config.connectionUrl);
      const username = url.username;
      const password = url.password;
      url.username = '';
      url.password = '';

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        },
        body,
        agent: undefined, // Add agent if needed
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}, ${errorBody}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.result;
    } catch (error) {
      console.error('RPC call failed:', error);
      throw error;
    }
  }
}