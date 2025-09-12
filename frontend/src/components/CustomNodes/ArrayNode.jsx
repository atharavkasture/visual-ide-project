import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

const ArrayNode = ({ id, data }) => {
  const handleChange = (e) => {
    data.updateNodeData(id, { [e.target.name]: e.target.value });
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="custom-node-header">Declare Array</div>
      <div className="custom-node-content">
        <label className="custom-node-label">Array Name</label>
        <input
          name="varName"
          type="text"
          defaultValue={data.varName}
          onChange={handleChange}
          className="custom-node-input"
        />
        <label className="custom-node-label">Values (comma-separated)</label>
        <input
          name="values"
          type="text"
          defaultValue={data.values}
          onChange={handleChange}
          className="custom-node-input"
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ArrayNode;