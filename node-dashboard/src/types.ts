export interface NodeInfo {
  id: number;
  name: string;
  ticker: string;
  currentBlock: number;
  healthy: boolean;
  icon: string;
  error?: string;
}
