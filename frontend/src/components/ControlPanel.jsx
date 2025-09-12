import React, { useState } from 'react';
import axios from 'axios';
import { graphToIR } from '../utils/irConverter';

const API_URL = 'http://localhost:3001/api';

const ControlPanel = ({ nodes, edges }) => {
  const [activeTab, setActiveTab] = useState('python');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState({ python: '', java: '' });
  const [executionResult, setExecutionResult] = useState({ stdout: '', stderr: '' });

  const handleGenerate = async () => {
    setIsLoading(true);
    setExecutionResult({ stdout: '', stderr: '' });
    try {
      const ir = graphToIR(nodes, edges);
      // console.log("Sending IR to backend:", JSON.stringify(ir, null, 2));

      const pyResponse = await axios.post(`${API_URL}/generate`, { language: 'python', ir });
      const javaResponse = await axios.post(`${API_URL}/generate`, { language: 'java', ir });
      
      setGeneratedCode({
        python: pyResponse.data.code,
        java: javaResponse.data.code,
      });

    } catch (error) {
      const errorMsg = error.response?.data?.details || error.message;
      console.error('Error generating code:', error);
      setExecutionResult({ stdout: '', stderr: `Code Generation Failed: ${errorMsg}` });
    }
    setIsLoading(false);
  };

  const handleExecute = async () => {
    setIsLoading(true);
    setExecutionResult({ stdout: '', stderr: '' });
    const code = generatedCode[activeTab];
    if (!code) {
        alert('Please generate the code first!');
        setIsLoading(false);
        return;
    }

    try {
        const response = await axios.post(`${API_URL}/execute`, { language: activeTab, code });
        setExecutionResult({
            stdout: response.data.stdout,
            stderr: response.data.stderr
        });
    } catch (error) {
        const errorMsg = error.response?.data?.details || error.message;
        console.error('Error executing code:', error);
        setExecutionResult({ stdout: '', stderr: `Execution Failed: ${errorMsg}` });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-96 p-4 bg-gray-800 rounded-lg shadow-lg flex flex-col">
      <div className="flex gap-2 mb-4">
        <button onClick={handleGenerate} disabled={isLoading} className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded">
          {isLoading ? 'Processing...' : 'Generate'}
        </button>
        <button onClick={handleExecute} disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded">
          {isLoading ? 'Processing...' : 'Execute'}
        </button>
      </div>
      
      <div className="flex-1 flex flex-col bg-gray-900 rounded-md p-2 mb-4 overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button onClick={() => setActiveTab('python')} className={`px-4 py-2 ${activeTab === 'python' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>Python</button>
          <button onClick={() => setActiveTab('java')} className={`px-4 py-2 ${activeTab === 'java' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>Java</button>
        </div>
        <pre className="flex-1 text-sm p-2 overflow-auto text-yellow-200">
            <code>{generatedCode[activeTab] || `// Click 'Generate' to see the ${activeTab} code`}</code>
        </pre>
      </div>

      <div className="h-48 flex flex-col bg-black rounded-md p-2">
        <h3 className="text-gray-400 font-semibold border-b border-gray-700 pb-1 mb-1">Console</h3>
        <div className="flex-1 text-sm p-1 overflow-auto font-mono">
            {executionResult.stderr && <pre className="text-red-500 whitespace-pre-wrap">{executionResult.stderr}</pre>}
            {executionResult.stdout && <pre className="text-gray-200 whitespace-pre-wrap">{executionResult.stdout}</pre>}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;