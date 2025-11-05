import { useFigmaStore } from '../store/useFigmaStore';
import { Layers, Component, Layout, Search, ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { useState } from 'react';

export default function LeftSidebar() {
  const { layers, selectedLayerIds, selectLayer, updateLayer, darkMode } = useFigmaStore();
  const [activeTab, setActiveTab] = useState<'layers' | 'assets' | 'pages'>('layers');

  const toggleLayerVisibility = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      updateLayer(layerId, { visible: !layer.visible });
    }
  };

  const toggleLayerLock = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      updateLayer(layerId, { locked: !layer.locked });
    }
  };

  const toggleGroupExpansion = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer && layer.type === 'group') {
      updateLayer(layerId, { isExpanded: !layer.isExpanded });
    }
  };

  const renderLayerItem = (layer: any, depth = 0) => {
    const isSelected = selectedLayerIds.includes(layer.id);
    const isGroup = layer.type === 'group';
    const hasChildren = isGroup && layer.children && layer.children.length > 0;
    const isVisible = layer.visible !== false;
    const isLocked = layer.locked === true;

    return (
      <div key={layer.id}>
        <div
          className={`figma-layer-item ${isSelected ? 'figma-layer-item-selected' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => !isLocked && selectLayer(layer.id)}
        >
          <div className="flex items-center space-x-1 flex-1">
            {isGroup && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroupExpansion(layer.id);
                }}
                className={`w-4 h-4 flex items-center justify-center rounded ${
                  darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
              >
                {layer.isExpanded ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
              </button>
            )}
            {!isGroup && (
              <div className="w-4 h-4 flex items-center justify-center">
                {layer.type === 'rectangle' && (
                  <div className={`w-3 h-3 border rounded-sm ${
                    darkMode ? 'border-gray-400' : 'border-gray-400'
                  }`}></div>
                )}
                {layer.type === 'ellipse' && (
                  <div className={`w-3 h-3 border rounded-full ${
                    darkMode ? 'border-gray-400' : 'border-gray-400'
                  }`}></div>
                )}
                {layer.type === 'text' && (
                  <div className={`w-3 h-3 text-center text-[10px] leading-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>T</div>
                )}
              </div>
            )}
            <span className={`text-sm truncate flex-1 ${
              darkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              {layer.name || `${layer.type} ${layer.id.slice(-4)}`}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerVisibility(layer.id);
              }}
              className={`w-4 h-4 flex items-center justify-center rounded ${
                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
              }`}
            >
              {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerLock(layer.id);
              }}
              className={`w-4 h-4 flex items-center justify-center rounded ${
                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
              }`}
            >
              {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>
          </div>
        </div>

        {isGroup && layer.isExpanded && hasChildren && (
          <div>
            {layer.children!.map((childId: string) => {
              const childLayer = layers.find(l => l.id === childId);
              return childLayer ? renderLayerItem(childLayer, depth + 1) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-72 border-r flex flex-col h-full ${
      darkMode 
        ? 'bg-gray-900 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className={`flex border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          className={`flex-1 py-2 text-sm font-medium flex items-center justify-center space-x-1 ${
            activeTab === 'layers'
              ? darkMode
                ? 'text-white border-b-2 border-white'
                : 'text-gray-900 border-b-2 border-gray-900'
              : darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('layers')}
        >
          <Layers size={16} />
          <span>Layers</span>
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium flex items-center justify-center space-x-1 ${
            activeTab === 'assets'
              ? darkMode
                ? 'text-white border-b-2 border-white'
                : 'text-gray-900 border-b-2 border-gray-900'
              : darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('assets')}
        >
          <Component size={16} />
          <span>Assets</span>
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium flex items-center justify-center space-x-1 ${
            activeTab === 'pages'
              ? darkMode
                ? 'text-white border-b-2 border-white'
                : 'text-gray-900 border-b-2 border-gray-900'
              : darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pages')}
        >
          <Layout size={16} />
          <span>Pages</span>
        </button>
      </div>

      <div className={`p-2 border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="relative">
          <Search size={14} className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search layers..."
            className={`w-full pl-8 pr-3 py-1.5 text-sm border rounded focus:outline-none focus:border-blue-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700' 
                : 'bg-gray-50 border-gray-300 text-gray-900 focus:bg-white'
            }`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'layers' && (
          <div className="p-2">
            <div className="figma-sidebar-section border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs font-medium uppercase ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Layers</div>
                <div className="flex space-x-1">
                  <button 
                    className={`w-6 h-6 flex items-center justify-center rounded ${
                      darkMode 
                        ? 'hover:bg-gray-800 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-500'
                    }`}
                    title="Create Frame"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="2" y="2" width="10" height="10" stroke="currentColor" fill="none"/>
                    </svg>
                  </button>
                  <button 
                    className={`w-6 h-6 flex items-center justify-center rounded ${
                      darkMode 
                        ? 'hover:bg-gray-800 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-500'
                    }`}
                    title="Group Selection (⌘G)"
                    onClick={() => {
                      const { selectedLayerIds, groupLayers } = useFigmaStore.getState();
                      if (selectedLayerIds.length >= 2) {
                        groupLayers(selectedLayerIds);
                      }
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="2" y="2" width="10" height="10" rx="1" stroke="currentColor" fill="none"/>
                    </svg>
                  </button>
                  <button 
                    className={`w-6 h-6 flex items-center justify-center rounded ${
                      darkMode 
                        ? 'hover:bg-gray-800 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-500'
                    }`}
                    title="Ungroup Selection (⌘⇧G)"
                    onClick={() => {
                      const { selectedLayerIds, ungroupLayer } = useFigmaStore.getState();
                      if (selectedLayerIds.length === 1) {
                        const layer = useFigmaStore.getState().layers.find(l => l.id === selectedLayerIds[0]);
                        if (layer?.type === 'group') {
                          ungroupLayer(layer.id);
                        }
                      }
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" fill="none"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="space-y-0.5">
                {layers
                  .filter(layer => !layer.children || !layers.some(l => l.children?.includes(layer.id)))
                  .map(layer => renderLayerItem(layer))}
                
                {layers.length === 0 && (
                  <div className={`text-center py-8 ${
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <Layers size={20} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                    </div>
                    No layers yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className={`p-4 text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`}>
            <Component size={32} className="mx-auto mb-2" />
            <div>Assets library</div>
            <div className="text-xs mt-1">Components and styles will appear here</div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className={`p-4 text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`}>
            <Layout size={32} className="mx-auto mb-2" />
            <div>Pages</div>
            <div className="text-xs mt-1">Manage your pages here</div>
          </div>
        )}
      </div>
    </div>
  );
}