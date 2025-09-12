import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';
import ControlPanel from './ControlPanel';

// Import Custom Node Components
import AssignNode from './CustomNodes/AssignNode';
import PrintNode from './CustomNodes/PrintNode';
import IfNode from './CustomNodes/IfNode';
import ForNode from './CustomNodes/ForNode';
import WhileNode from './CustomNodes/WhileNode'; // New
import ArrayNode from './CustomNodes/ArrayNode'; // New


const initialNodes = [
    { id: 'start', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 5 }, deletable: false },
];

let id = 1;
const getId = () => `node_${id++}`;

const Editor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const nodeTypes = useMemo(() => ({
      assign: (props) => <AssignNode {...props} data={{...props.data, updateNodeData}} />,
      array: (props) => <ArrayNode {...props} data={{...props.data, updateNodeData}} />,
      print: (props) => <PrintNode {...props} data={{...props.data, updateNodeData}} />,
      if: (props) => <IfNode {...props} data={{...props.data, updateNodeData}} />,
      for: (props) => <ForNode {...props} data={{...props.data, updateNodeData}} />,
      while: (props) => <WhileNode {...props} data={{...props.data, updateNodeData}} />,
    }), [updateNodeData]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: getId(),
        type,
        position,
        data: { 
            ...(type === 'assign' && { varName: 'x', value: '10' }),
            ...(type === 'array' && { varName: 'my_array', values: '1, 2, 3' }),
            ...(type === 'print' && { value: 'x' }),
            ...(type === 'if' && { condition: 'x > 5' }),
            ...(type === 'for' && { varName: 'i', range: '10' }),
            ...(type === 'while' && { condition: 'x > 0' }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  return (
    <div className="flex h-full gap-4">
      <ReactFlowProvider>
        <Sidebar />
        <div className="flex-grow h-full rounded-lg bg-gray-800 shadow-inner" onDragOver={onDragOver} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
            className="bg-dots"
          >
            <Controls />
            <Background color="#4a5568" gap={16} />
          </ReactFlow>
        </div>
        <ControlPanel 
            nodes={nodes} 
            edges={edges} 
        />
      </ReactFlowProvider>
    </div>
  );
};

export default Editor;