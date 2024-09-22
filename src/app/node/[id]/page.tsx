import { getNodeStatus } from '@/app/actions/getNodeStatus';

export default async function NodeDetail({ params }: { params: { id: string } }) {
  const nodes = await getNodeStatus();
  const node = nodes.find((n) => n.id.toString() === params.id);

  if (!node) {
    return <div>Node not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{node.name} Details</h1>
      <p>Ticker: {node.ticker}</p>
      <p>Current Block: {node.currentBlock.toLocaleString()}</p>
      <p>Status: {node.healthy ? 'Healthy' : 'Unhealthy'}</p>
      {/* Add more detailed information as needed */}
    </div>
  );
}
