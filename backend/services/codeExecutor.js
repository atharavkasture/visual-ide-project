const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const execute = (language, code) => {
    if (language === 'python') {
        return executePython(code);
    } else if (language === 'java') {
        return executeJava(code);
    }
    return Promise.reject(new Error('Unsupported language for execution'));
};

const executePython = (code) => {
    return new Promise((resolve, reject) => {
        const python = spawn('python', ['-c', code]);
        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        python.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        python.on('close', (code) => {
            resolve({ stdout, stderr, exitCode: code });
        });
        
        python.on('error', (err) => {
            reject(err);
        });
    });
};

const executeJava = async (code) => {
    const tempDir = path.join(__dirname, 'temp');
    await fs.ensureDir(tempDir);
    const javaFile = path.join(tempDir, 'Main.java');
    await fs.writeFile(javaFile, code);

    return new Promise((resolve, reject) => {
        // Compile
        const javac = spawn('javac', [javaFile]);
        let compileError = '';
        javac.stderr.on('data', data => compileError += data.toString());
        
        javac.on('close', (code) => {
            if (code !== 0) {
                fs.remove(tempDir); // Cleanup
                return resolve({ stdout: '', stderr: compileError, exitCode: code });
            }

            // Execute
            const java = spawn('java', ['-cp', tempDir, 'Main']);
            let stdout = '';
            let stderr = '';
            
            java.stdout.on('data', data => stdout += data.toString());
            java.stderr.on('data', data => stderr += data.toString());
            
            java.on('close', (exitCode) => {
                fs.remove(tempDir); // Cleanup
                resolve({ stdout, stderr, exitCode });
            });
            
            java.on('error', (err) => {
                fs.remove(tempDir);
                reject(err);
            });
        });

        javac.on('error', (err) => {
            fs.remove(tempDir);
            reject(err);
        });
    });
};

module.exports = { execute };