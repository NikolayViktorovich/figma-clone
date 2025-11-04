import { useFigmaStore } from '../store/useFigmaStore';
import { Layers, Component, Layout, Search } from 'lucide-react';
import { useState } from 'react';

export default function LeftSidebar() {
  const { layers, selectedLayerIds, selectLayer } = useFigmaStore();
  const [activeTab, setActiveTab] = useState<'layers' | 'assets' | 'pages'>('layers');

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-sm font-medium flex items-center justify-center space-x-1 ${
            activeTab === 'layers'
              ? 'text-gray-900 border-b-2 border-gray-900'
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
              ? 'text-gray-900 border-b-2 border-gray-900'
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
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pages')}
        >
          <Layout size={16} />
          <span>Pages</span>
        </button>
      </div>
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search layers..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {activeTab === 'layers' && (
          <div className="p-2">
            <div className="figma-sidebar-section">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-gray-500 uppercase">Pages</div>
                <button className="text-gray-400 hover:text-gray-600">+</button>
              </div>
              <div className="space-y-1">
                <div className="figma-layer-item figma-layer-item-selected">
                  <div className="flex items-center space-x-2">
                    <Layout size={14} />
                    <span>Page 1</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="figma-sidebar-section border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-gray-500 uppercase">Layers</div>
                <div className="flex space-x-1">
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M7 1V13M1 7H13" stroke="currentColor" fill="none"/>
                    </svg>
                  </button>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M3 7H11" stroke="currentColor" fill="none"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="space-y-0.5">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`figma-layer-item ${
                      selectedLayerIds.includes(layer.id) ? 'figma-layer-item-selected' : ''
                    }`}
                    onClick={() => selectLayer(layer.id)}
                  >
                    <div className="flex items-center space-x-2">
                      {layer.type === 'rectangle' && (
                        <div className="w-4 h-4 border border-gray-400 rounded-sm"></div>
                      )}
                      {layer.type === 'ellipse' && (
                        <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                      )}
                      {layer.type === 'text' && (
                        <div className="w-4 h-4 text-center text-xs leading-4">T</div>
                      )}
                      <span className="text-sm capitalize">{layer.type}</span>
                    </div>
                    <div className="w-4 h-4"></div>
                  </div>
                ))}
                {layers.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Layers size={20} className="text-gray-400" />
                    </div>
                    No layers yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="p-4 text-center text-gray-400 text-sm">
            <Component size={32} className="mx-auto mb-2" />
            <div>Assets library</div>
            <div className="text-xs mt-1">Components and styles will appear here</div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="p-4 text-center text-gray-400 text-sm">
            <Layout size={32} className="mx-auto mb-2" />
            <div>Pages</div>
            <div className="text-xs mt-1">Manage your pages here</div>
          </div>
        )}
      </div>
    </div>
  );
}