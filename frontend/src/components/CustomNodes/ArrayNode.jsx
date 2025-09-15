// import React from 'react';
// import { Handle, Position } from 'reactflow';
// import './NodeStyles.css';

// const ArrayNode = ({ id, data }) => {
//   const handleChange = (e) => {
//     data.updateNodeData(id, { [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="custom-node">
//       <Handle type="target" position={Position.Top} />
//       <div className="custom-node-header">Declare Array</div>
//       <div className="custom-node-content">
//         <label className="custom-node-label">Array Name</label>
//         <input
//           name="varName"
//           type="text"
//           defaultValue={data.varName}
//           onChange={handleChange}
//           className="custom-node-input"
//         />
//         <label className="custom-node-label">Values (comma-separated)</label>
//         <input
//           name="values"
//           type="text"
//           defaultValue={data.values}
//           onChange={handleChange}
//           className="custom-node-input"
//         />
//       </div>
//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// };

// export default ArrayNode;

import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

const ArrayNode = ({ id, data }) => {
  const handleChange = (e) => {
    data.updateNodeData(id, { [e.target.name]: e.target.value });
  };

  const declarationType = data.declarationType || 'values';

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
        
        <label className="custom-node-label">
            Datatype
            <span className="node-tooltip">*For statically-typed languages</span>
        </label>
        <select name="dataType" defaultValue={data.dataType} onChange={handleChange} className="custom-node-input">
            <option value="int">int</option>
            <option value="double">double</option>
            <option value="String">String</option>
            <option value="boolean">boolean</option>
        </select>

        <label className="custom-node-label">Declaration Method</label>
        <select name="declarationType" value={declarationType} onChange={handleChange} className="custom-node-input">
            <option value="values">Initialize with Values</option>
            <option value="size">Initialize with Size</option>
        </select>

        {declarationType === 'values' ? (
          <div>
            <label className="custom-node-label">Values (comma-separated)</label>
            <input
              name="values"
              type="text"
              defaultValue={data.values}
              onChange={handleChange}
              className="custom-node-input"
            />
          </div>
        ) : (
          <div>
            <label className="custom-node-label">
                Size
                <span className="node-tooltip">*For statically-typed languages</span>
            </label>
            <input
              name="size"
              type="number"
              defaultValue={data.size}
              onChange={handleChange}
              className="custom-node-input"
            />
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ArrayNode;