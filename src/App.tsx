import React from 'react';
import Toolbar from './components/Toolbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Stage from './components/Canvas/Stage';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-figma-gray-100 text-figma-gray-900">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 bg-figma-gray-200 overflow-hidden relative">
          <Stage />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}

export default App;