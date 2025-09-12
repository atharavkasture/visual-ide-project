import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

const PrintNode = ({ id, data }) => {
  const handleChange = (e) => {
    data.updateNodeData(id, { value: e.target.value });
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="custom-node-header">Print</div>
      <div className="custom-node-content">
        <label className="custom-node-label">Value or Variable to Print</label>
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

export default PrintNode;