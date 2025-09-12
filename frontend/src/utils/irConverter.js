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

    const startNode = nodes.find(n => n.type === 'input');
    if (!startNode) {
        throw new Error('A "Start" node is required.');
    }

    const startEdges = edgeMap.get(startNode.id) || [];
    const firstNodeId = startEdges.length > 0 ? startEdges[0].target : null;

    return {
        type: 'program',
        body: buildSequence(firstNodeId, nodeMap, edgeMap),
    };
};

function buildSequence(startNodeId, nodeMap, edgeMap) {
    if (!startNodeId || visited.has(startNodeId)) {
        return [];
    }
    const sequence = [];
    let currentNodeId = startNodeId;
    while (currentNodeId) {
        if (visited.has(currentNodeId)) break;
        visited.add(currentNodeId);
        const node = nodeMap.get(currentNodeId);
        if (!node) break;
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

function convertNodeToIR(node) {
    switch (node.type) {
        case 'assign':
            return { type: 'assign', var: node.data.varName, value: node.data.value };
        case 'array':
             const values = node.data.values.split(',').map(s => s.trim()).filter(Boolean);
            return { type: 'array_assign', var: node.data.varName, values: values };
        case 'print':
            return { type: 'print', value: node.data.value };
        case 'if':
            return { type: 'if', condition: node.data.condition, body: [], elseBody: [] };
        case 'for':
            return { type: 'for', var: node.data.varName, range: node.data.range, body: [] };
        case 'while':
            return { type: 'while', condition: node.data.condition, body: [] };
        default:
            throw new Error(`Unknown node type: ${node.type}`);
    }
}