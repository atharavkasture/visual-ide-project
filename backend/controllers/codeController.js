const pythonGenerator = require('../generators/pythonGenerator');
const javaGenerator = require('../generators/javaGenerator');
const codeExecutor = require('../services/codeExecutor');

const generateCode = (req, res) => {
    const { language, ir } = req.body;
    try {
        let code;
        if (language === 'python') {
            code = pythonGenerator.generate(ir);
        } else if (language === 'java') {
            code = javaGenerator.generate(ir);
        } else {
            return res.status(400).json({ error: 'Unsupported language' });
        }
        res.status(200).json({ code });
    } catch (error) {
        console.error('Code generation error:', error);
        res.status(500).json({ error: 'Failed to generate code', details: error.message });
    }
};

const executeCode = async (req, res) => {
    const { language, code } = req.body;
    try {
        const output = await codeExecutor.execute(language, code);
        res.status(200).json(output);
    } catch (error) {
        console.error('Code execution error:', error);
        res.status(500).json({ error: 'Failed to execute code', details: error.message });
    }
};

module.exports = {
    generateCode,
    executeCode,
};