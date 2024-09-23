import Link from 'next/link';
import { NodeInfo } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import Image from 'next/image'
import { Badge } from './ui/badge';

export function NodeCard({ node }: { node: NodeInfo }) {
  return (
    <Link href={`/node/${node.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{node.name}</CardTitle>
          <CardDescription>{node.ticker}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Image src={node.icon} alt={node.name} width={32} height={32} />
            <span>
              Current Block: {node.currentBlock > 0 ? node.currentBlock.toLocaleString() : 'N/A'}
            </span>
            <Badge variant={node.healthy ? 'success' : 'destructive'}>
              {node.healthy ? 'Healthy' : 'Unhealthy'}
            </Badge>
            {node.error && <Badge variant="destructive">{node.error}</Badge>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
