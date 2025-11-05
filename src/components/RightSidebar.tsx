import { useFigmaStore } from '../store/useFigmaStore';
import { ChevronDown, Link2, Eye, EyeOff, Lock, Unlock, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useState } from 'react';

export default function RightSidebar() {
  const { layers, selectedLayerIds, updateLayer, darkMode } = useFigmaStore();
  const [activeTab, setActiveTab] = useState<'design' | 'prototype'>('design');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    size: true,
    fill: true,
    stroke: true,
    effects: false,
    text: false
  });

  const selectedLayer = layers.find(layer => layer.id === selectedLayerIds[0]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!selectedLayer) {
    return (
      <div className={`w-80 border-l flex flex-col h-full ${
        darkMode 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className={`flex border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'design'
                ? darkMode
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-900 border-b-2 border-gray-900'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('design')}
          >
            Design
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'prototype'
                ? darkMode
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-900 border-b-2 border-gray-900'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('prototype')}
          >
            Prototype
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className={`text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className={darkMode ? 'text-gray-400' : 'text-gray-400'}>
                <path d="M10 2.5C10 2.22386 9.77614 2 9.5 2C9.22386 2 9 2.22386 9 2.5V9H2.5C2.22386 9 2 9.22386 2 9.5C2 9.77614 2.22386 10 2.5 10H9V16.5C9 16.7761 9.22386 17 9.5 17C9.77614 17 10 16.7761 10 16.5V10H16.5C16.7761 10 17 9.77614 17 9.5C17 9.22386 16.7761 9 16.5 9H10V2.5Z"/>
              </svg>
            </div>
            <div className="text-sm font-medium">Nothing selected</div>
            <div className="text-xs mt-1">Select an object to see properties</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 border-l flex flex-col h-full ${
      darkMode 
        ? 'bg-gray-900 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className={`flex border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'design'
              ? darkMode
                ? 'text-white border-b-2 border-white'
                : 'text-gray-900 border-b-2 border-gray-900'
              : darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('design')}
        >
          Design
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'prototype'
              ? darkMode
                ? 'text-white border-b-2 border-white'
                : 'text-gray-900 border-b-2 border-gray-900'
              : darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('prototype')}
        >
          Prototype
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'design' && (
          <div className="p-3 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={selectedLayer.name || `${selectedLayer.type} ${selectedLayer.id.slice(-4)}`}
                onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
                className={`flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <div className="flex space-x-1">
                <button
                  onClick={() => updateLayer(selectedLayer.id, { visible: !selectedLayer.visible })}
                  className={`w-6 h-6 flex items-center justify-center rounded ${
                    darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  {selectedLayer.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => updateLayer(selectedLayer.id, { locked: !selectedLayer.locked })}
                  className={`w-6 h-6 flex items-center justify-center rounded ${
                    darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  {selectedLayer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('size')}
                className={`flex items-center justify-between w-full text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                <span>Size</span>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform ${expandedSections.size ? 'rotate-180' : ''}`}
                />
              </button>
              
              {expandedSections.size && (
                <div className="space-y-2 pl-2">
                  <div className={`flex items-center space-x-2 text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  } mb-1`}>
                    <Link2 size={12} />
                    <span>Constrain proportions</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`block text-xs mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>W</label>
                      <input
                        type="number"
                        value={Math.round(selectedLayer.width)}
                        onChange={(e) => updateLayer(selectedLayer.id, { width: Number(e.target.value) })}
                        className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>H</label>
                      <input
                        type="number"
                        value={Math.round(selectedLayer.height)}
                        onChange={(e) => updateLayer(selectedLayer.id, { height: Number(e.target.value) })}
                        className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`block text-xs mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>X</label>
                      <input
                        type="number"
                        value={Math.round(selectedLayer.x)}
                        onChange={(e) => updateLayer(selectedLayer.id, { x: Number(e.target.value) })}
                        className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Y</label>
                      <input
                        type="number"
                        value={Math.round(selectedLayer.y)}
                        onChange={(e) => updateLayer(selectedLayer.id, { y: Number(e.target.value) })}
                        className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Rotation</label>
                    <input
                      type="number"
                      value={Math.round(selectedLayer.rotation)}
                      onChange={(e) => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })}
                      className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('fill')}
                className={`flex items-center justify-between w-full text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                <span>Fill</span>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform ${expandedSections.fill ? 'rotate-180' : ''}`}
                />
              </button>
              
              {expandedSections.fill && (
                <div className="space-y-2 pl-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={selectedLayer.fill}
                      onChange={(e) => updateLayer(selectedLayer.id, { fill: e.target.value })}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedLayer.fill.toUpperCase()}
                      onChange={(e) => updateLayer(selectedLayer.id, { fill: e.target.value })}
                      className={`flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div className="flex space-x-1">
                    <button className={`flex-1 px-2 py-1 text-xs border rounded transition-colors ${
                      darkMode
                        ? 'border-gray-600 hover:bg-gray-800'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      Solid
                    </button>
                    <button className={`flex-1 px-2 py-1 text-xs border rounded transition-colors ${
                      darkMode
                        ? 'border-gray-600 hover:bg-gray-800'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      Linear
                    </button>
                    <button className={`flex-1 px-2 py-1 text-xs border rounded transition-colors ${
                      darkMode
                        ? 'border-gray-600 hover:bg-gray-800'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      Radial
                    </button>
                  </div>
                </div>
              )}
            </div>
            {(selectedLayer.type === 'rectangle' || selectedLayer.type === 'ellipse' || selectedLayer.type === 'line' || selectedLayer.type === 'arrow' || selectedLayer.type === 'vector') && (
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection('stroke')}
                  className={`flex items-center justify-between w-full text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <span>Stroke</span>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform ${expandedSections.stroke ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {expandedSections.stroke && (
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 border rounded flex items-center justify-center ${
                        darkMode ? 'border-gray-600' : 'border-gray-300'
                      }`}>
                        <div className={`w-4 h-4 border rounded-sm ${
                          darkMode ? 'border-gray-400' : 'border-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-1">
                        <input
                          type="text"
                          value={selectedLayer.strokeWidth || 2}
                          onChange={(e) => updateLayer(selectedLayer.id, { strokeWidth: Number(e.target.value) })}
                          className={`px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-700 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <select 
                          className={`px-1 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-700 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option>Solid</option>
                          <option>Dashed</option>
                          <option>Dotted</option>
                        </select>
                        <input
                          type="color"
                          value={selectedLayer.stroke || '#000000'}
                          onChange={(e) => updateLayer(selectedLayer.id, { stroke: e.target.value })}
                          className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className={`flex-1 px-2 py-1 text-xs border rounded transition-colors ${
                        darkMode
                          ? 'border-gray-600 hover:bg-gray-800'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                        Inside
                      </button>
                      <button className={`flex-1 px-2 py-1 text-xs border rounded transition-colors ${
                        darkMode
                          ? 'bg-blue-900 border-blue-700'
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        Center
                      </button>
                      <button className={`flex-1 px-2 py-1 text-xs border rounded transition-colors ${
                        darkMode
                          ? 'border-gray-600 hover:bg-gray-800'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                        Outside
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('effects')}
                className={`flex items-center justify-between w-full text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                <span>Effects</span>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform ${expandedSections.effects ? 'rotate-180' : ''}`}
                />
              </button>
              
              {expandedSections.effects && (
                <div className="space-y-2 pl-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Drop Shadow</span>
                      <button className="text-blue-500 text-xs">+</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="number"
                        placeholder="X"
                        className={`px-2 py-1 border rounded ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'border-gray-300'
                        }`}
                      />
                      <input
                        type="number"
                        placeholder="Y"
                        className={`px-2 py-1 border rounded ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'border-gray-300'
                        }`}
                      />
                      <input
                        type="number"
                        placeholder="Blur"
                        className={`px-2 py-1 border rounded ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'border-gray-300'
                        }`}
                      />
                      <input
                        type="color"
                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Blur</span>
                      <button className="text-blue-500 text-xs">+</button>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedLayer.blur || 0}
                      onChange={(e) => updateLayer(selectedLayer.id, { blur: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {selectedLayer.type === 'text' && (
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection('text')}
                  className={`flex items-center justify-between w-full text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <span>Text</span>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform ${expandedSections.text ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {expandedSections.text && (
                  <div className="space-y-2 pl-2">
                    <textarea
                      value={selectedLayer.text || ''}
                      onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                      className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter text..."
                      rows={3}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={selectedLayer.fontFamily || 'Inter'}
                        onChange={(e) => updateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                        className={`px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option>Inter</option>
                        <option>Arial</option>
                        <option>Helvetica</option>
                        <option>Georgia</option>
                        <option>Times New Roman</option>
                      </select>
                      <input
                        type="number"
                        value={selectedLayer.fontSize || 16}
                        onChange={(e) => updateLayer(selectedLayer.id, { fontSize: Number(e.target.value) })}
                        className={`px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => updateLayer(selectedLayer.id, { fontWeight: selectedLayer.fontWeight === 700 ? 400 : 700 })}
                        className={`flex-1 px-2 py-1 text-xs border rounded flex items-center justify-center space-x-1 transition-colors ${
                          selectedLayer.fontWeight === 700 
                            ? darkMode
                              ? 'bg-gray-700'
                              : 'bg-gray-100'
                            : darkMode
                              ? 'border-gray-600 hover:bg-gray-800'
                              : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Bold size={12} />
                        <span>Bold</span>
                      </button>
                      <button className={`flex-1 px-2 py-1 text-xs border rounded flex items-center justify-center space-x-1 transition-colors ${
                        darkMode
                          ? 'border-gray-600 hover:bg-gray-800'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                        <Italic size={12} />
                        <span>Italic</span>
                      </button>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button className={`flex-1 px-2 py-1 text-xs border rounded flex items-center justify-center space-x-1 transition-colors ${
                        darkMode
                          ? 'border-gray-600 hover:bg-gray-800'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                        <AlignLeft size={12} />
                      </button>
                      <button className={`flex-1 px-2 py-1 text-xs border rounded flex items-center justify-center space-x-1 transition-colors ${
                        darkMode
                          ? 'border-gray-600 hover:bg-gray-800'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                        <AlignCenter size={12} />
                      </button>
                      <button className={`flex-1 px-2 py-1 text-xs border rounded flex items-center justify-center space-x-1 transition-colors ${
                        darkMode
                          ? 'border-gray-600 hover:bg-gray-800'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                        <AlignRight size={12} />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={selectedLayer.fill}
                        onChange={(e) => updateLayer(selectedLayer.id, { fill: e.target.value })}
                        className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                      />
                      <span className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Text color</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedLayer.type === 'arrow' && (
              <div className="space-y-2">
                <div className={`text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Arrow</div>
                <div className="flex space-x-2 pl-2">
                  <label className="flex items-center space-x-1 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedLayer.startArrow || false}
                      onChange={(e) => updateLayer(selectedLayer.id, { startArrow: e.target.checked })}
                      className="rounded"
                    />
                    <span>Start</span>
                  </label>
                  <label className="flex items-center space-x-1 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedLayer.endArrow !== false}
                      onChange={(e) => updateLayer(selectedLayer.id, { endArrow: e.target.checked })}
                      className="rounded"
                    />
                    <span>End</span>
                  </label>
                </div>
              </div>
            )}

            {selectedLayer.type === 'vector' && (
              <div className="space-y-2">
                <div className={`text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Vector</div>
                <div className="flex space-x-2 pl-2 text-xs">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {selectedLayer.points?.length || 0} points
                  </span>
                  <button 
                    onClick={() => updateLayer(selectedLayer.id, { isClosed: !selectedLayer.isClosed })}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {selectedLayer.isClosed ? 'Open Path' : 'Close Path'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'prototype' && (
          <div className={`p-4 text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className={darkMode ? 'text-gray-400' : 'text-gray-400'}>
                <path d="M10.5 2.5C10.5 2.22386 10.2761 2 10 2C9.72386 2 9.5 2.22386 9.5 2.5V9H2.5C2.22386 9 2 9.22386 2 9.5C2 9.77614 2.22386 10 2.5 10H9.5V16.5C9.5 16.7761 9.72386 17 10 17C10.2761 17 10.5 16.7761 10.5 16.5V10H16.5C16.7761 10 17 9.77614 17 9.5C17 9.22386 16.7761 9 16.5 9H10.5V2.5Z"/>
              </svg>
            </div>
            <div className="font-medium">Prototype</div>
            <div className="text-xs mt-1">Add interactions and animations</div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
              Add Interaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
}