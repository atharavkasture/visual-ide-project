import React from 'react';
import Editor from './components/Editor';

function App() {
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4 shadow-md flex-shrink-0">
        <h1 className="text-2xl font-bold text-cyan-400">Visual Coder IDE</h1>
        <p className="text-sm text-gray-400">From Graph to Code, Instantly.</p>
      </header>
      <main className="p-4 flex-grow min-h-0">
        <Editor />
      </main>
    </div>
  );
}

export default App;