import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

const FunctionCallNode = ({ id, data }) => {
  const handleChange = (e) => {
    data.updateNodeData(id, { [e.target.name]: e.target.value });
  };

  return (
    <div className="custom-node border-green-500">
      <Handle type="target" position={Position.Top} />
      <div className="custom-node-header text-green-400">Call Function</div>
      <div className="custom-node-content">
        <label className="custom-node-label">Function Name</label>
        <input
          name="name"
          type="text"
          defaultValue={data.name}
          onChange={handleChange}
          className="custom-node-input"
        />
        <label className="custom-node-label">Arguments (comma-separated)</label>
        <input
          name="args"
          type="text"
          defaultValue={data.args}
          onChange={handleChange}
          className="custom-node-input"
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default FunctionCallNode;