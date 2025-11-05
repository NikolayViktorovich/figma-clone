import React, { useState } from 'react';
import { X, Monitor, Moon, Sun, Keyboard, Bell, Download } from 'lucide-react';
import { useFigmaStore } from '../store/useFigmaStore';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const { darkMode, setDarkMode, autoSave, setAutoSave, showGrid, setShowGrid, showRulers, setShowRulers } = useFigmaStore();

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className={`rounded-lg w-full max-w-4xl h-3/4 flex backdrop-blur-lg ${
        darkMode ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-900'
      }`}>
        {/* Sidebar */}
        <div className={`w-64 border-r p-4 backdrop-blur-md ${
          darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-gray-50/90 border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? darkMode
                        ? 'bg-blue-900/80 text-blue-200'
                        : 'bg-blue-100/80 text-blue-700'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700/80'
                        : 'text-gray-700 hover:bg-gray-100/80'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex-1 p-6 overflow-y-auto backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {tabs.find(tab => tab.id === activeTab)?.label} Settings
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800/80' : 'hover:bg-gray-100/80'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">File Handling</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>Auto-save changes</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>Show grid by default</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={showRulers}
                      onChange={(e) => setShowRulers(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>Show rulers by default</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Canvas Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Default Canvas Size</label>
                    <select className={`w-full border rounded-lg px-3 py-2 backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-gray-800/80 border-gray-700 text-white' 
                        : 'bg-white/80 border-gray-300'
                    }`}>
                      <option>Desktop (1440x900)</option>
                      <option>Mobile (375x812)</option>
                      <option>Tablet (768x1024)</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Default Zoom</label>
                    <select className={`w-full border rounded-lg px-3 py-2 backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-gray-800/80 border-gray-700 text-white' 
                        : 'bg-white/80 border-gray-300'
                    }`}>
                      <option>100%</option>
                      <option>75%</option>
                      <option>50%</option>
                      <option>Fit to screen</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Theme</h4>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setDarkMode(false)}
                    className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors backdrop-blur-sm ${
                      !darkMode 
                        ? darkMode
                          ? 'border-blue-500 bg-blue-900/80'
                          : 'border-blue-500 bg-blue-50/80'
                        : darkMode
                          ? 'border-gray-600 hover:bg-gray-800/80'
                          : 'border-gray-300 hover:bg-gray-50/80'
                    }`}
                  >
                    <Sun size={20} />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setDarkMode(true)}
                    className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors backdrop-blur-sm ${
                      darkMode 
                        ? darkMode
                          ? 'border-blue-500 bg-blue-900/80'
                          : 'border-blue-500 bg-blue-50/80'
                        : darkMode
                          ? 'border-gray-600 hover:bg-gray-800/80'
                          : 'border-gray-300 hover:bg-gray-50/80'
                    }`}
                  >
                    <Moon size={20} />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">UI Scale</h4>
                <div className="flex space-x-2">
                  {[75, 100, 125, 150].map((scale) => (
                    <button
                      key={scale}
                      className={`px-4 py-2 border rounded-lg transition-colors backdrop-blur-sm ${
                        scale === 100 
                          ? darkMode
                            ? 'border-blue-500 bg-blue-900/80'
                            : 'border-blue-500 bg-blue-50/80'
                          : darkMode
                            ? 'border-gray-600 hover:bg-gray-800/80'
                            : 'border-gray-300 hover:bg-gray-100/80'
                      }`}
                    >
                      {scale}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className={`flex justify-between py-2 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <span>Select Tool</span>
                    <kbd className={`px-2 py-1 rounded text-sm backdrop-blur-sm ${
                      darkMode ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100/80 text-gray-600'
                    }`}>V</kbd>
                  </div>
                  <div className={`flex justify-between py-2 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <span>Frame Tool</span>
                    <kbd className={`px-2 py-1 rounded text-sm backdrop-blur-sm ${
                      darkMode ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100/80 text-gray-600'
                    }`}>F</kbd>
                  </div>
                  <div className={`flex justify-between py-2 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <span>Rectangle Tool</span>
                    <kbd className={`px-2 py-1 rounded text-sm backdrop-blur-sm ${
                      darkMode ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100/80 text-gray-600'
                    }`}>R</kbd>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`flex justify-between py-2 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <span>Undo</span>
                    <kbd className={`px-2 py-1 rounded text-sm backdrop-blur-sm ${
                      darkMode ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100/80 text-gray-600'
                    }`}>⌘Z</kbd>
                  </div>
                  <div className={`flex justify-between py-2 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <span>Redo</span>
                    <kbd className={`px-2 py-1 rounded text-sm backdrop-blur-sm ${
                      darkMode ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100/80 text-gray-600'
                    }`}>⌘⇧Z</kbd>
                  </div>
                  <div className={`flex justify-between py-2 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <span>Group</span>
                    <kbd className={`px-2 py-1 rounded text-sm backdrop-blur-sm ${
                      darkMode ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100/80 text-gray-600'
                    }`}>⌘G</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Default Export Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Format</label>
                    <select className={`w-full border rounded-lg px-3 py-2 backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-gray-800/80 border-gray-700 text-white' 
                        : 'bg-white/80 border-gray-300'
                    }`}>
                      <option>PNG</option>
                      <option>JPG</option>
                      <option>SVG</option>
                      <option>PDF</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Scale</label>
                    <select className={`w-full border rounded-lg px-3 py-2 backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-gray-800/80 border-gray-700 text-white' 
                        : 'bg-white/80 border-gray-300'
                    }`}>
                      <option>1x</option>
                      <option>2x</option>
                      <option>3x</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Quality</h4>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    defaultValue="90"
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">90%</span>
                </div>
              </div>
            </div>
          )}

          <div className={`flex justify-end space-x-3 mt-8 pt-6 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 border rounded-lg transition-colors backdrop-blur-sm ${
                darkMode
                  ? 'border-gray-600 hover:bg-gray-800/80 text-gray-300'
                  : 'border-gray-300 hover:bg-gray-50/80 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors backdrop-blur-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;