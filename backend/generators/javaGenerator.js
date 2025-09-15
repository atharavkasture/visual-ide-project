// function generate(ir) {
//     if (!ir || ir.type !== 'program') {
//         throw new Error('Invalid IR format: Must start with a "program" node.');
//     }
//     const declarations = new Set();
//     const bodyCode = ir.body.map(node => generateNode(node, 2, declarations)).join('\n');

//     return `public class Main {
//     public static void main(String[] args) {
// ${bodyCode}
//     }
// }`;
// }

// function generateNode(node, indent = 0, declarations) {
//     const prefix = '    '.repeat(indent);
//     switch (node.type) {
//         case 'assign':
//             let type = isNaN(node.value) ? "String" : "int";
//             let value = type === "String" ? `"${node.value}"` : node.value;
//             if (!declarations.has(node.var)) {
//                 declarations.add(node.var);
//                 return `${prefix}${type} ${node.var} = ${value};`;
//             }
//             return `${prefix}${node.var} = ${value};`;

//         case 'array_assign':
//             // Simple type inference: check if the first element is a number
//             const isNumeric = node.values.length > 0 && !isNaN(node.values[0]);
//             const arrayType = isNumeric ? 'int[]' : 'String[]';
//             const javaValues = isNumeric 
//                 ? node.values.join(', ') 
//                 : node.values.map(v => `"${v}"`).join(', ');

//             if (!declarations.has(node.var)) {
//                 declarations.add(node.var);
//                 return `${prefix}${arrayType} ${node.var} = {${javaValues}};`;
//             }
//             return `${prefix}${node.var} = new ${arrayType}{${javaValues}};`;

//         case 'print':
//             return `${prefix}System.out.println(${node.value});`;
        
//         case 'if':
//             const ifBody = node.body.map(child => generateNode(child, indent + 1, declarations)).join('\n');
//             let result = `${prefix}if (${node.condition}) {\n${ifBody}\n${prefix}}`;
//             if (node.elseBody && node.elseBody.length > 0) {
//                 const elseBody = node.elseBody.map(child => generateNode(child, indent + 1, declarations)).join('\n');
//                 result += ` else {\n${elseBody}\n${prefix}}`;
//             }
//             return result;
        
//         case 'for':
//             const forBody = node.body.map(child => generateNode(child, indent + 1, declarations)).join('\n');
//             return `${prefix}for (int ${node.var} = 0; ${node.var} < ${node.range}; ${node.var}++) {\n${forBody}\n${prefix}}`;

//         case 'while':
//             const whileBody = node.body.map(child => generateNode(child, indent + 1, declarations)).join('\n');
//             return `${prefix}while (${node.condition}) {\n${whileBody}\n${prefix}}`;

//         default:
//             throw new Error(`Unsupported node type for Java: ${node.type}`);
//     }
// }

// module.exports = { generate };

function generate(ir) {
    if (!ir || ir.type !== 'program') {
        throw new Error('Invalid IR format.');
    }
    
    const functions = (ir.functions || []).map(func => generateNode(func, 1, new Set())).join('\n\n');
    const mainBody = (ir.body || []).map(node => generateNode(node, 2, new Set())).join('\n');

    return `public class Main {
    public static void main(String[] args) {
${mainBody}
    }
${functions ? '\n' + functions : ''}
}`;
}

function formatJavaValue(value, dataType) {
    if (dataType === 'String') {
        return `"${value}"`;
    }
    return value;
}


function generateNode(node, indent = 0, declarations) {
    const prefix = '    '.repeat(indent);
    switch (node.type) {
        case 'assign':
            const value = formatJavaValue(node.value, node.dataType);
            if (!declarations.has(node.var)) {
                declarations.add(node.var);
                return `${prefix}${node.dataType} ${node.var} = ${value};`;
            }
            return `${prefix}${node.var} = ${value};`;

        case 'array_assign_values':
            const javaValues = node.values.map(v => formatJavaValue(v, node.dataType)).join(', ');
            if (!declarations.has(node.var)) {
                declarations.add(node.var);
                return `${prefix}${node.dataType}[] ${node.var} = {${javaValues}};`;
            }
            return `${prefix}${node.var} = new ${node.dataType}[]{${javaValues}};`;
        
        case 'array_assign_size':
             if (!declarations.has(node.var)) {
                declarations.add(node.var);
                return `${prefix}${node.dataType}[] ${node.var} = new ${node.dataType}[${node.size}];`;
            }
            // Re-assignment doesn't make as much sense here, but we'll support it.
            return `${prefix}${node.var} = new ${node.dataType}[${node.size}];`;

        case 'print':
            return `${prefix}System.out.println(${node.value});`;
        
        case 'if':
            const ifBody = node.body.map(child => generateNode(child, indent + 1, declarations)).join('\n');
            let result = `${prefix}if (${node.condition}) {\n${ifBody}\n${prefix}}`;
            if (node.elseBody && node.elseBody.length > 0) {
                const elseBody = node.elseBody.map(child => generateNode(child, indent + 1, declarations)).join('\n');
                result += ` else {\n${elseBody}\n${prefix}}`;
            }
            return result;
        
        case 'for':
            const forBody = node.body.map(child => generateNode(child, indent + 1, declarations)).join('\n');
            return `${prefix}for (int ${node.var} = 0; ${node.var} < ${node.range}; ${node.var}++) {\n${forBody}\n${prefix}}`;

        case 'while':
            const whileBody = node.body.map(child => generateNode(child, indent + 1, declarations)).join('\n');
            return `${prefix}while (${node.condition}) {\n${whileBody}\n${prefix}}`;

        case 'function_define':
            const funcBody = node.body.map(child => generateNode(child, indent + 1, new Set())).join('\n');
            const params = node.params.map(p => `${p.type} ${p.name}`).join(', ');
            return `${prefix}public static void ${node.name}(${params}) {\n${funcBody}\n${prefix}}`;

        case 'function_call':
            const args = node.args.join(', ');
            return `${prefix}${node.name}(${args});`;

        default:
            throw new Error(`Unsupported node type for Java: ${node.type}`);
    }
}

module.exports = { generate };