function generate(ir) {
    if (!ir || ir.type !== 'program') {
        throw new Error('Invalid IR format: Must start with a "program" node.');
    }
    const declarations = new Set();
    const bodyCode = ir.body.map(node => generateNode(node, 2, declarations)).join('\n');

    return `public class Main {
    public static void main(String[] args) {
${bodyCode}
    }
}`;
}

function generateNode(node, indent = 0, declarations) {
    const prefix = '    '.repeat(indent);
    switch (node.type) {
        case 'assign':
            let type = isNaN(node.value) ? "String" : "int";
            let value = type === "String" ? `"${node.value}"` : node.value;
            if (!declarations.has(node.var)) {
                declarations.add(node.var);
                return `${prefix}${type} ${node.var} = ${value};`;
            }
            return `${prefix}${node.var} = ${value};`;

        case 'array_assign':
            // Simple type inference: check if the first element is a number
            const isNumeric = node.values.length > 0 && !isNaN(node.values[0]);
            const arrayType = isNumeric ? 'int[]' : 'String[]';
            const javaValues = isNumeric 
                ? node.values.join(', ') 
                : node.values.map(v => `"${v}"`).join(', ');

            if (!declarations.has(node.var)) {
                declarations.add(node.var);
                return `${prefix}${arrayType} ${node.var} = {${javaValues}};`;
            }
            return `${prefix}${node.var} = new ${arrayType}{${javaValues}};`;

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

        default:
            throw new Error(`Unsupported node type for Java: ${node.type}`);
    }
}

module.exports = { generate };