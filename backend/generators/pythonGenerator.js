// function generate(ir) {
//     if (!ir || ir.type !== 'program') {
//         throw new Error('Invalid IR format: Must start with a "program" node.');
//     }
//     return ir.body.map(node => generateNode(node)).join('\n');
// }

// function formatPythonValue(val) {
//     // Check if it's a number, if not, treat as a string literal and wrap in quotes.
//     return !isNaN(val) && !isNaN(parseFloat(val)) ? val : `'${val}'`;
// }

// function generateNode(node, indent = 0) {
//     const prefix = '    '.repeat(indent);
//     switch (node.type) {
//         case 'assign':
//             return `${prefix}${node.var} = ${formatPythonValue(node.value)}`;
        
//         case 'array_assign':
//             const pyValues = node.values.map(formatPythonValue).join(', ');
//             return `${prefix}${node.var} = [${pyValues}]`;

//         case 'print':
//             return `${prefix}print(${node.value})`;
        
//         case 'if':
//             const ifBody = node.body.map(child => generateNode(child, indent + 1)).join('\n');
//             let result = `${prefix}if ${node.condition}:\n${ifBody || prefix + '    pass'}`;
//             if (node.elseBody && node.elseBody.length > 0) {
//                 const elseBody = node.elseBody.map(child => generateNode(child, indent + 1)).join('\n');
//                 result += `\n${prefix}else:\n${elseBody}`;
//             }
//             return result;
        
//         case 'for':
//             const forBody = node.body.map(child => generateNode(child, indent + 1)).join('\n');
//             return `${prefix}for ${node.var} in range(${node.range}):\n${forBody || prefix + '    pass'}`;

//         case 'while':
//             const whileBody = node.body.map(child => generateNode(child, indent + 1)).join('\n');
//             return `${prefix}while ${node.condition}:\n${whileBody || prefix + '    pass'}`;

//         default:
//             throw new Error(`Unsupported node type for Python: ${node.type}`);
//     }
// }

// module.exports = { generate };

function generate(ir) {
    if (!ir || ir.type !== 'program') {
        throw new Error('Invalid IR format.');
    }

    const functions = (ir.functions || []).map(func => generateNode(func, 0)).join('\n\n');
    const mainBody = (ir.body || []).map(node => generateNode(node, 0)).join('\n');

    const separator = functions && mainBody ? '\n\n' : '';

    return `${functions}${separator}${mainBody}`;
}

function formatPythonValue(val) {
    if (String(val).startsWith('"') && String(val).endsWith('"')) return val;
    if (String(val).startsWith("'") && String(val).endsWith("'")) return val;
    return !isNaN(val) && !isNaN(parseFloat(val)) ? val : `'${val}'`;
}

function generateNode(node, indent = 0) {
    const prefix = '    '.repeat(indent);
    switch (node.type) {
        case 'assign':
            return `${prefix}${node.var} = ${formatPythonValue(node.value)}`;
        
        case 'array_assign_values': // Updated type
            const pyValues = node.values.map(formatPythonValue).join(', ');
            return `${prefix}${node.var} = [${pyValues}]`;
        
        case 'array_assign_size': // New type, but Python doesn't pre-allocate this way
            return `${prefix}${node.var} = [None] * ${node.size}`;

        case 'print':
            return `${prefix}print(${node.value})`;
        
        case 'if':
            const ifBody = node.body.map(child => generateNode(child, indent + 1)).join('\n');
            let result = `${prefix}if ${node.condition}:\n${ifBody || prefix + '    pass'}`;
            if (node.elseBody && node.elseBody.length > 0) {
                const elseBody = node.elseBody.map(child => generateNode(child, indent + 1)).join('\n');
                result += `\n${prefix}else:\n${elseBody}`;
            }
            return result;
        
        case 'for':
            const forBody = node.body.map(child => generateNode(child, indent + 1)).join('\n');
            return `${prefix}for ${node.var} in range(${node.range}):\n${forBody || prefix + '    pass'}`;

        case 'while':
            const whileBody = node.body.map(child => generateNode(child, indent + 1)).join('\n');
            return `${prefix}while ${node.condition}:\n${whileBody || prefix + '    pass'}`;

        case 'function_define':
            const funcBody = node.body.map(child => generateNode(child, indent + 1)).join('\n');
            const params = node.params.map(p => p.name).join(', '); // Ignore types for Python
            return `${prefix}def ${node.name}(${params}):\n${funcBody || prefix + '    pass'}`;
        
        case 'function_call':
             const args = node.args.join(', ');
            return `${prefix}${node.name}(${args})`;

        default:
            throw new Error(`Unsupported node type for Python: ${node.type}`);
    }
}

module.exports = { generate };