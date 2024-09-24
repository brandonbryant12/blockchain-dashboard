// src/app/page.tsx

// Force dynamic rendering to ensure data fetching happens at runtime
export const dynamic = 'force-dynamic';

import { getNodeStatus } from './actions/getNodeStatus';
import { NodeCard } from './components/NodeCard';
import { NodeInfo } from '../lib/types';

export default async function Dashboard() {
  const nodes: NodeInfo[] = await getNodeStatus();

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
