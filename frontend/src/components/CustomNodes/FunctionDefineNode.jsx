import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

const FunctionDefineNode = ({ id, data }) => {
  const handleChange = (e) => {
    data.updateNodeData(id, { [e.target.name]: e.target.value });
  };

  return (
    <div className="custom-node border-purple-500">
      <div className="custom-node-header text-purple-400">Define Function</div>
      <div className="custom-node-content">
        <label className="custom-node-label">Function Name</label>
        <input
          name="name"
          type="text"
          defaultValue={data.name}
          onChange={handleChange}
          className="custom-node-input"
        />
        <label className="custom-node-label">
          Parameters
          <span className="node-tooltip">e.g., int count, String msg</span>
        </label>
        <textarea
          name="params"
          defaultValue={data.params}
          onChange={handleChange}
          className="custom-node-input"
          rows={2}
        />
      </div>
      <Handle type="source" position={Position.Right} id="body" style={{ top: '60%', background: '#60A5FA' }} />
      <div className='text-xs text-blue-400' style={{position: 'absolute', right: -35, top: '57%'}}>Body</div>
    </div>
  );
};

export default FunctionDefineNode;