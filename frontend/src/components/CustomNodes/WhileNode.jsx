import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

const WhileNode = ({ id, data }) => {
  const handleChange = (e) => {
    data.updateNodeData(id, { condition: e.target.value });
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="custom-node-header">While Loop</div>
      <div className="custom-node-content">
        <label className="custom-node-label">Condition</label>
        <input
          name="condition"
          type="text"
          defaultValue={data.condition}
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

export default WhileNode;