import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

interface RpcConfig {
  connectionUrl: string;
}

@Injectable()
export class BlockchainService {
  private rpcConfigs: { [key: string]: RpcConfig };

  constructor(private configService: ConfigService) {
    this.rpcConfigs = {
      BTC: {
        connectionUrl: this.configService.get<string>('BTC_RPC_URL'),
      },
      FB: {
        connectionUrl: this.configService.get<string>('FRACTAL_RPC_URL'),
      },
      BELLS: {
        connectionUrl: this.configService.get<string>('BELLS_RPC_URL'),
      },
    };
  }

  private async rpcCall(
    ticker: string,
    method: string,
    params: any[] = [],
  ): Promise<any> {
    const body = JSON.stringify({
      jsonrpc: '1.0',
      id: 'rpc-client',
      method,
      params,
    });

    try {
      const config = this.rpcConfigs[ticker];
      const url = new URL(config.connectionUrl);
      const username = url.username;
      const password = url.password;
      url.username = '';
      url.password = '';

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(`${username}:${password}`).toString('base64'),
        },
        body,
        agent: undefined, // Add agent if needed
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} ${response.statusText}, ${errorBody}`,
        );
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

  public async getBlockchainInfo(ticker: string): Promise<any> {
    return this.rpcCall(ticker, 'getblockchaininfo');
  }
}
