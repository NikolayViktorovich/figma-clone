import { useState } from 'react';
import { X, Download, Image, FileText } from 'lucide-react';
import { useFigmaStore } from '../store/useFigmaStore';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, scale: number, quality: number) => void;
}

export default function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const [format, setFormat] = useState<'png' | 'jpg' | 'svg' | 'pdf'>('png');
  const [scale, setScale] = useState(1);
  const [quality, setQuality] = useState(1);
  const [includeBackground, setIncludeBackground] = useState(true);
  const { darkMode } = useFigmaStore();

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(format, scale, quality);
  };

  const formatOptions = [
    { value: 'png', label: 'PNG', icon: Image, description: 'Best for web, transparent background' },
    { value: 'jpg', label: 'JPG', icon: Image, description: 'Best for photos, smaller file size' },
    { value: 'svg', label: 'SVG', icon: FileText, description: 'Vector format, scalable' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Document format, multi-page' },
  ];

  const scaleOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 3, label: '3x' },
  ];

  const qualityOptions = [
    { value: 1, label: 'High' },
    { value: 0.8, label: 'Medium' },
    { value: 0.6, label: 'Low' },
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className={`rounded-lg w-96 max-h-[90vh] overflow-hidden flex flex-col shadow-xl border ${
        darkMode 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold">Export</h3>
          <button 
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
              darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Format</label>
            <div className="grid grid-cols-2 gap-2">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value as any)}
                  className={`p-3 border rounded-lg text-left transition-all ${
                    format === option.value
                      ? darkMode
                        ? 'border-blue-500 bg-blue-900 shadow-sm'
                        : 'border-blue-500 bg-blue-50 shadow-sm'
                      : darkMode
                        ? 'border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                        : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <option.icon size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Scale</label>
            <div className="flex space-x-2">
              {scaleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setScale(option.value)}
                  className={`flex-1 px-3 py-2 text-sm border rounded transition-all ${
                    scale === option.value
                      ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                      : darkMode
                        ? 'border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                        : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {(format === 'png' || format === 'jpg') && (
            <div>
              <label className="block text-sm font-medium mb-2">Quality</label>
              <div className="flex space-x-2">
                {qualityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setQuality(option.value)}
                    className={`flex-1 px-3 py-2 text-sm border rounded transition-all ${
                      quality === option.value
                        ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                        : darkMode
                          ? 'border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                          : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeBackground}
                onChange={(e) => setIncludeBackground(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm">Include background</span>
            </label>
            
            {(format === 'png' || format === 'svg') && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm">Transparent background</span>
              </label>
            )}
          </div>

          <div className={`rounded-lg p-4 border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Export size</span>
              <span className="font-medium">
                {Math.round(800 * scale)} × {Math.round(600 * scale)}px
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Format</span>
              <span className="font-medium">{format.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className={`flex space-x-3 p-6 border-t ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 text-sm border rounded transition-all ${
              darkMode
                ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                : 'border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all hover:shadow-sm flex items-center justify-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}