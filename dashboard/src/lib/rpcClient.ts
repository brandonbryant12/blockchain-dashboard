/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';

interface RpcConfig {
  protocol: string;
  user: string;
  pass: string;
  host: string;
  port: number;
}

export class RpcClient {
  private config: RpcConfig;
  private axiosInstance: AxiosInstance;

  constructor(config: RpcConfig) {
    this.config = config;
    const { protocol, host, port, user, pass } = this.config;
    
    this.axiosInstance = axios.create({
      baseURL: `${protocol}://${host}:${port}`,
      auth: {
        username: user,
        password: pass
      },
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 1000 // 5 seconds timeout
    });
  }

  async call(method: string, params: any[] = []) {
    try {
      const response = await this.axiosInstance.post('/', {
        jsonrpc: '1.0',
        id: 'rpc-client',
        method,
        params,
      });

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('RPC call failed:', error.message);
        console.error('Error details:', error.response?.data);
      } else {
        console.error('RPC call failed:', error);
      }
      throw error;
    }
  }
}