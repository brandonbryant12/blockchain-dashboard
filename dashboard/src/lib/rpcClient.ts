/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch';

interface RpcConfig {
  protocol: string;
  user: string;
  pass: string;
  host: string;
  port: number;
}

export class RpcClient {
  private config: RpcConfig;

  constructor(config: RpcConfig) {
    this.config = config;
  }

  async call(method: string, params: any[] = []) {
    const { protocol, user, pass, host, port } = this.config;
    const url = `${protocol}://${host}:${port}`;
    const body = JSON.stringify({
      jsonrpc: '1.0',
      id: 'rpc-client',
      method,
      params,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
        },
        body,
        agent: undefined, // Add agent if needed
        signal: AbortSignal.timeout(1000) 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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