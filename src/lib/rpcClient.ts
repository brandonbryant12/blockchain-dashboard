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

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      agent: undefined, // Add agent if needed
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.result;
  }
}
