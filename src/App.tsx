import { useState } from 'react';
import Toolbar from './components/Toolbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Stage from './components/Canvas/Stage';
import ExportModal from './components/ExportModal';
import { useFigmaStore } from './store/useFigmaStore';

function App() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { darkMode } = useFigmaStore();

  const handleExport = (format: string, scale: number, quality: number) => {
    console.log(`Exporting as ${format} with scale ${scale}x and quality ${quality}`);
    setIsExportModalOpen(false);
  };

  return (
    <div className={`h-screen w-screen flex flex-col ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-100 text-gray-900'
    }`}>
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className={`flex-1 overflow-hidden relative ${
          darkMode ? 'bg-gray-800' : 'bg-gray-200'
        }`}>
          <Stage />
        </div>
        <RightSidebar />
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}

export default App;