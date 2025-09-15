// const visited = new Set();

// export const graphToIR = (nodes, edges) => {
//     visited.clear();
//     const nodeMap = new Map(nodes.map(node => [node.id, node]));
//     const edgeMap = new Map();
//     edges.forEach(edge => {
//         if (!edgeMap.has(edge.source)) {
//             edgeMap.set(edge.source, []);
//         }
//         edgeMap.get(edge.source).push(edge);
//     });

//     const startNode = nodes.find(n => n.type === 'input');
//     if (!startNode) {
//         throw new Error('A "Start" node is required.');
//     }

//     const startEdges = edgeMap.get(startNode.id) || [];
//     const firstNodeId = startEdges.length > 0 ? startEdges[0].target : null;

//     return {
//         type: 'program',
//         body: buildSequence(firstNodeId, nodeMap, edgeMap),
//     };
// };

// function buildSequence(startNodeId, nodeMap, edgeMap) {
//     if (!startNodeId || visited.has(startNodeId)) {
//         return [];
//     }
//     const sequence = [];
//     let currentNodeId = startNodeId;
//     while (currentNodeId) {
//         if (visited.has(currentNodeId)) break;
//         visited.add(currentNodeId);
//         const node = nodeMap.get(currentNodeId);
//         if (!node) break;
//         const irNode = convertNodeToIR(node);
//         sequence.push(irNode);
//         const outgoingEdges = edgeMap.get(node.id) || [];
//         if (node.type === 'if') {
//             const trueEdge = outgoingEdges.find(e => e.sourceHandle === 'true');
//             const falseEdge = outgoingEdges.find(e => e.sourceHandle === 'false');
//             irNode.body = trueEdge ? buildSequence(trueEdge.target, nodeMap, edgeMap) : [];
//             irNode.elseBody = falseEdge ? buildSequence(falseEdge.target, nodeMap, edgeMap) : [];
//             currentNodeId = null;
//         } else if (node.type === 'for' || node.type === 'while') {
//             const loopBodyEdge = outgoingEdges.find(e => e.sourceHandle === 'loopBody');
//             const nextNodeEdge = outgoingEdges.find(e => e.sourceHandle === 'next');
//             irNode.body = loopBodyEdge ? buildSequence(loopBodyEdge.target, nodeMap, edgeMap) : [];
//             currentNodeId = nextNodeEdge ? nextNodeEdge.target : null;
//         } else {
//             const nextEdge = outgoingEdges[0];
//             currentNodeId = nextEdge ? nextEdge.target : null;
//         }
//     }
//     return sequence;
// }

// function convertNodeToIR(node) {
//     switch (node.type) {
//         case 'assign':
//             return { type: 'assign', var: node.data.varName, value: node.data.value };
//         case 'array':
//              const values = node.data.values.split(',').map(s => s.trim()).filter(Boolean);
//             return { type: 'array_assign', var: node.data.varName, values: values };
//         case 'print':
//             return { type: 'print', value: node.data.value };
//         case 'if':
//             return { type: 'if', condition: node.data.condition, body: [], elseBody: [] };
//         case 'for':
//             return { type: 'for', var: node.data.varName, range: node.data.range, body: [] };
//         case 'while':
//             return { type: 'while', condition: node.data.condition, body: [] };
//         default:
//             throw new Error(`Unknown node type: ${node.type}`);
//     }
// }

const visited = new Set();

export const graphToIR = (nodes, edges) => {
    visited.clear();
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const edgeMap = new Map();
    edges.forEach(edge => {
        if (!edgeMap.has(edge.source)) {
            edgeMap.set(edge.source, []);
        }
        edgeMap.get(edge.source).push(edge);
    });

    const functionNodes = nodes.filter(n => n.type === 'functionDefine');
    const functions = functionNodes.map(funcNode => {
        visited.add(funcNode.id);
        const irFunc = convertNodeToIR(funcNode); // This will now correctly return an object
        const bodyEdge = (edgeMap.get(funcNode.id) || []).find(e => e.sourceHandle === 'body');
        if (bodyEdge) {
            irFunc.body = buildSequence(bodyEdge.target, nodeMap, edgeMap);
        }
        return irFunc;
    });

    const startNode = nodes.find(n => n.type === 'input');
    if (!startNode) {
        throw new Error('A "Start" node is required.');
    }

    const startEdges = edgeMap.get(startNode.id) || [];
    const firstNodeId = startEdges.length > 0 ? startEdges[0].target : null;

    const mainBody = buildSequence(firstNodeId, nodeMap, edgeMap);

    return {
        type: 'program',
        functions: functions,
        body: mainBody,
    };
};

function buildSequence(startNodeId, nodeMap, edgeMap) {
    if (!startNodeId || visited.has(startNodeId)) {
        return [];
    }
    const sequence = [];
    let currentNodeId = startNodeId;
    while (currentNodeId) {
        const node = nodeMap.get(currentNodeId);
        // This check correctly ignores function definitions in the main flow because they are pre-added to the 'visited' set.
        if (!node || visited.has(currentNodeId)) break;
        
        visited.add(currentNodeId);
        
        const irNode = convertNodeToIR(node);
        sequence.push(irNode);

        const outgoingEdges = edgeMap.get(node.id) || [];
        
        if (node.type === 'if') {
            const trueEdge = outgoingEdges.find(e => e.sourceHandle === 'true');
            const falseEdge = outgoingEdges.find(e => e.sourceHandle === 'false');
            irNode.body = trueEdge ? buildSequence(trueEdge.target, nodeMap, edgeMap) : [];
            irNode.elseBody = falseEdge ? buildSequence(falseEdge.target, nodeMap, edgeMap) : [];
            currentNodeId = null;
        } else if (node.type === 'for' || node.type === 'while') {
            const loopBodyEdge = outgoingEdges.find(e => e.sourceHandle === 'loopBody');
            const nextNodeEdge = outgoingEdges.find(e => e.sourceHandle === 'next');
            irNode.body = loopBodyEdge ? buildSequence(loopBodyEdge.target, nodeMap, edgeMap) : [];
            currentNodeId = nextNodeEdge ? nextNodeEdge.target : null;
        } else {
            const nextEdge = outgoingEdges[0];
            currentNodeId = nextEdge ? nextEdge.target : null;
        }
    }
    return sequence;
}

function parseCsv(str) {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

function parseTypedParams(str) {
    if (!str) return [];
    return str.split(',').map(s => {
        const parts = s.trim().split(/\s+/);
        // Handles cases like "int a", "a", "String b"
        const type = parts.length > 1 ? parts[0] : 'String'; // Default to String if no type
        const name = parts.length > 1 ? parts[1] : parts[0];
        return { type, name };
    }).filter(p => p.name);
}

function convertNodeToIR(node) {
    switch (node.type) {
        case 'assign':
            return { type: 'assign', var: node.data.varName, value: node.data.value, dataType: node.data.dataType };
        
        case 'array':
            if (node.data.declarationType === 'size') {
                return { type: 'array_assign_size', var: node.data.varName, dataType: node.data.dataType, size: node.data.size };
            }
            return { type: 'array_assign_values', var: node.data.varName, dataType: node.data.dataType, values: parseCsv(node.data.values) };
        
        case 'print':
            return { type: 'print', value: node.data.value };
        case 'if':
            return { type: 'if', condition: node.data.condition, body: [], elseBody: [] };
        case 'for':
            return { type: 'for', var: node.data.varName, range: node.data.range, body: [] };
        case 'while':
            return { type: 'while', condition: node.data.condition, body: [] };
        case 'functionDefine':
            // --- THIS IS THE FIX --- 
            // This now correctly returns an object instead of null.
            return { type: 'function_define', name: node.data.name, params: parseTypedParams(node.data.params), body: [] };
        case 'functionCall':
            return { type: 'function_call', name: node.data.name, args: parseCsv(node.data.args) };
        default:
            throw new Error(`Unknown node type: ${node.type}`);
    }
}