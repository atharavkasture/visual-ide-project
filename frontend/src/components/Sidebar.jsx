// import React from 'react';

// const NodeButton = ({ type, label }) => {
//   const onDragStart = (event, nodeType) => {
//     event.dataTransfer.setData('application/reactflow', nodeType);
//     event.dataTransfer.effectAllowed = 'move';
//   };

//   return (
//     <div
//       className="p-3 mb-2 border-2 border-cyan-500 rounded-md cursor-grab bg-gray-700 hover:bg-cyan-700 transition-colors"
//       onDragStart={(event) => onDragStart(event, type)}
//       draggable
//     >
//       {label}
//     </div>
//   );
// };

// const Sidebar = () => {
//   return (
//     <aside className="w-64 p-4 bg-gray-800 rounded-lg shadow-lg">
//       <h3 className="text-xl font-semibold mb-4 text-gray-300">Blocks</h3>
//       <NodeButton type="assign" label="Variable Assign" />
//       <NodeButton type="array" label="Array Declaration" />
//       <NodeButton type="print" label="Print" />
//       <NodeButton type="if" label="If/Else" />
//       <NodeButton type="for" label="For Loop" />
//       <NodeButton type="while" label="While Loop" />
//     </aside>
//   );
// };

// export default Sidebar;

import React from 'react';

const NodeButton = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="p-3 mb-2 border-2 border-cyan-500 rounded-md cursor-grab bg-gray-700 hover:bg-cyan-700 transition-colors"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      {label}
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-64 p-4 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-300">Blocks</h3>
      <NodeButton type="assign" label="Variable Assign" />
      <NodeButton type="array" label="Array Declaration" />
      <NodeButton type="print" label="Print" />
      <NodeButton type="if" label="If/Else" />
      <NodeButton type="for" label="For Loop" />
      <NodeButton type="while" label="While Loop" />
      <NodeButton type="functionDefine" label="Define Function" />
      <NodeButton type="functionCall" label="Call Function" />
    </aside>
  );
};

export default Sidebar;