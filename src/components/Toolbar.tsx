import { Search, Play, Share2, Comment, Eye, Settings } from 'lucide-react';

export default function Toolbar() {
  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-sm"></div>
          <span className="font-semibold text-base">Figma Clone</span>
        </div>
        <div className="flex items-center space-x-1">
          {['File', 'Edit', 'Object', 'Text', 'Arrange', 'View', 'Plugins', 'Help'].map((item) => (
            <button
              key={item}
              className="px-2 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <button className="figma-toolbar-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.5 14.5V10H13V14.5C13 14.7761 12.7761 15 12.5 15H3.5C3.22386 15 3 14.7761 3 14.5V10H4.5V14.5H11.5Z"/>
              <path d="M7.5 1.5C7.5 1.22386 7.72386 1 8 1C8.27614 1 8.5 1.22386 8.5 1.5V9.5H7.5V1.5Z"/>
              <path d="M4.5 6.5L8 3L11.5 6.5H9.5V10H6.5V6.5H4.5Z"/>
            </svg>
          </button>
          <div className="text-sm font-medium">Untitled</div>
          <button className="figma-toolbar-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.5 6L8 9.5L11.5 6H4.5Z"/>
            </svg>
          </button>
        </div>

        <div className="w-px h-4 bg-gray-200"></div>
        <div className="flex items-center space-x-1">
          <button className="figma-toolbar-button" title="Presentation">
            <Play size={16} />
          </button>
          <button className="figma-toolbar-button" title="Show comments">
            <Comment size={16} />
          </button>
          <button className="figma-toolbar-button" title="Share">
            <Share2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-32 pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
        
        <button className="figma-toolbar-button" title="Settings">
          <Settings size={16} />
        </button>
        
        <button className="figma-toolbar-button" title="View">
          <Eye size={16} />
        </button>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
          U
        </div>
      </div>
    </div>
  );
}