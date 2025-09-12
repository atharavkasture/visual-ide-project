import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

const IfNode = ({ id, data }) => {
  const handleChange = (e) => {
    data.updateNodeData(id, { condition: e.target.value });
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="custom-node-header">If</div>
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
      <Handle type="source" position={Position.Right} id="true" style={{ top: '35%', background: '#34D399' }} />
      <div className='text-xs text-green-400' style={{position: 'absolute', right: -30, top: '30%'}}>True</div>
      <Handle type="source" position={Position.Right} id="false" style={{ top: '65%', background: '#F87171' }} />
      <div className='text-xs text-red-400' style={{position: 'absolute', right: -35, top: '60%'}}>False</div>
    </div>
  );
};

export default IfNode;