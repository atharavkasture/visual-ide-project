import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

const ForNode = ({ id, data }) => {
  const handleChange = (e) => {
    data.updateNodeData(id, { [e.target.name]: e.target.value });
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="custom-node-header">For Loop</div>
      <div className="custom-node-content">
        <label className="custom-node-label">Iterator (e.g., 'i')</label>
        <input
          name="varName"
          type="text"
          defaultValue={data.varName}
          onChange={handleChange}
          className="custom-node-input"
        />
        <label className="custom-node-label">Range (e.g., '10')</label>
        <input
          name="range"
          type="text"
          defaultValue={data.range}
          onChange={handleChange}
          className="custom-node-input"
        />
      </div>
      <Handle type="source" position={Position.Right} id="loopBody" style={{ top: '50%', background: '#60A5FA' }} />
      <div className='text-xs text-blue-400' style={{position: 'absolute', right: -55, top: '45%'}}>Loop Body</div>

      <Handle type="source" position={Position.Bottom} id="next" style={{ left: '50%'}} />
    </div>
  );
};

export default ForNode;