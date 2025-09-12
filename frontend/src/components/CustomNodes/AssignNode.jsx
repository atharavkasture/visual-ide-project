import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

const AssignNode = ({ id, data }) => {
  const handleChange = (e) => {
    data.updateNodeData(id, { [e.target.name]: e.target.value });
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="custom-node-header">Assign Variable</div>
      <div className="custom-node-content">
        <label className="custom-node-label">Variable Name</label>
        <input
          name="varName"
          type="text"
          defaultValue={data.varName}
          onChange={handleChange}
          className="custom-node-input"
        />
        <label className="custom-node-label">Value</label>
        <input
          name="value"
          type="text"
          defaultValue={data.value}
          onChange={handleChange}
          className="custom-node-input"
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default AssignNode;