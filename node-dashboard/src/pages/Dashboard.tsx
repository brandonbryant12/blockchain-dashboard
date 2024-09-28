import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { NodeCard } from '../components/NodeCard';
import { NodeInfo } from '../types';

const Dashboard: React.FC = () => {
  const [nodes, setNodes] = useState<NodeInfo[]>([]);
  
  useEffect(() => {
    apiClient.get('/nodes')
      .then(response => {
        console.log('Response data:', response.data);
        setNodes(response.data);
      })
      .catch(error => console.error('API Error:', error));
  }, []);
  

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(nodes) ? (
          nodes.map((node) => (
            <NodeCard key={node.id} node={node} />
          ))
        ) : (
          <p>No nodes available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;