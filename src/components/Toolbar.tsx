import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Share2, 
  MessageCircle, 
  Eye, 
  Settings as SettingsIcon, 
  Undo, 
  Redo,
  Save,
  User,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useFigmaStore } from '../store/useFigmaStore';
import ExportModal from './ExportModal';
import Settings from './Settings';
import Profile from './Profile';
import AddInteraction from './AddInteraction';

export default function Toolbar() {
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    layers, 
    selectedLayerIds, 
    groupLayers, 
    ungroupLayer, 
    deleteLayer,
    duplicateLayer,
    bringToFront,
    bringForward,
    sendBackward,
    sendToBack,
    alignLayers,
    distributeLayers,
    setFontFamily,
    setFontSize,
    setTextAlign,
    toggleGrid,
    toggleRulers,
    setZoom,
    resetZoom,
    showGrid,
    showRulers,
    canvas,
    newFile,
    openFile,
    saveFile,
    saveFileAs,
    print,
    cut,
    copy,
    paste,
    fileName,
    showHelp,
    exitApp,
    addInteraction,
    darkMode,
    toggleDarkMode
  } = useFigmaStore();

  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isObjectMenuOpen, setIsObjectMenuOpen] = useState(false);
  const [isTextMenuOpen, setIsTextMenuOpen] = useState(false);
  const [isArrangeMenuOpen, setIsArrangeMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const editMenuRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const objectMenuRef = useRef<HTMLDivElement>(null);
  const textMenuRef = useRef<HTMLDivElement>(null);
  const arrangeMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [
        fileMenuRef, editMenuRef, viewMenuRef, 
        objectMenuRef, textMenuRef, arrangeMenuRef, accountMenuRef
      ];
      
      refs.forEach(ref => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          if (ref === fileMenuRef) setIsFileMenuOpen(false);
          if (ref === editMenuRef) setIsEditMenuOpen(false);
          if (ref === viewMenuRef) setIsViewMenuOpen(false);
          if (ref === objectMenuRef) setIsObjectMenuOpen(false);
          if (ref === textMenuRef) setIsTextMenuOpen(false);
          if (ref === arrangeMenuRef) setIsArrangeMenuOpen(false);
          if (ref === accountMenuRef) setIsAccountMenuOpen(false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGroup = () => {
    if (selectedLayerIds.length >= 2) {
      groupLayers(selectedLayerIds);
    }
    setIsEditMenuOpen(false);
  };

  const handleUngroup = () => {
    if (selectedLayerIds.length === 1) {
      const layer = layers.find(l => l.id === selectedLayerIds[0]);
      if (layer?.type === 'group') {
        ungroupLayer(layer.id);
      }
    }
    setIsEditMenuOpen(false);
  };

  const handleDelete = () => {
    if (selectedLayerIds.length > 0) {
      selectedLayerIds.forEach(id => deleteLayer(id));
    }
    setIsEditMenuOpen(false);
  };

  const handleDuplicate = () => {
    if (selectedLayerIds.length === 1) {
      duplicateLayer(selectedLayerIds[0]);
    }
    setIsEditMenuOpen(false);
  };

  const handleBringToFront = () => {
    if (selectedLayerIds.length === 1) {
      bringToFront(selectedLayerIds[0]);
    }
    setIsObjectMenuOpen(false);
  };

  const handleBringForward = () => {
    if (selectedLayerIds.length === 1) {
      bringForward(selectedLayerIds[0]);
    }
    setIsObjectMenuOpen(false);
  };

  const handleSendBackward = () => {
    if (selectedLayerIds.length === 1) {
      sendBackward(selectedLayerIds[0]);
    }
    setIsObjectMenuOpen(false);
  };

  const handleSendToBack = () => {
    if (selectedLayerIds.length === 1) {
      sendToBack(selectedLayerIds[0]);
    }
    setIsObjectMenuOpen(false);
  };

  const handleAlign = (alignment: string) => {
    alignLayers(alignment);
    setIsArrangeMenuOpen(false);
  };

  const handleDistribute = (distribution: string) => {
    distributeLayers(distribution);
    setIsArrangeMenuOpen(false);
  };

  const handleFontFamily = (fontFamily: string) => {
    selectedLayerIds.forEach(id => {
      const layer = layers.find(l => l.id === id);
      if (layer?.type === 'text') {
        setFontFamily(id, fontFamily);
      }
    });
    setIsTextMenuOpen(false);
  };

  const handleFontSize = (fontSize: number) => {
    selectedLayerIds.forEach(id => {
      const layer = layers.find(l => l.id === id);
      if (layer?.type === 'text') {
        setFontSize(id, fontSize);
      }
    });
    setIsTextMenuOpen(false);
  };

  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    selectedLayerIds.forEach(id => {
      const layer = layers.find(l => l.id === id);
      if (layer?.type === 'text') {
        setTextAlign(id, align);
      }
    });
    setIsTextMenuOpen(false);
  };

  const handleZoomIn = () => {
    setZoom(canvas.zoom * 1.2);
  };

  const handleZoomOut = () => {
    setZoom(canvas.zoom / 1.2);
  };

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  const handleNewFile = () => {
    if (layers.length > 0) {
      if (confirm('Are you sure you want to create a new file? Any unsaved changes will be lost.')) {
        newFile();
      }
    } else {
      newFile();
    }
    setIsFileMenuOpen(false);
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
    setIsFileMenuOpen(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      openFile(file);
    }
  };

  const handleSave = () => {
    saveFile();
    setIsFileMenuOpen(false);
  };

  const handleSaveAs = () => {
    saveFileAs();
    setIsFileMenuOpen(false);
  };

  const handlePrint = () => {
    print();
    setIsFileMenuOpen(false);
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
    setIsFileMenuOpen(false);
  };

  const handleExit = () => {
    exitApp();
    setIsFileMenuOpen(false);
  };

  const handleShowHelp = () => {
    showHelp();
  };

  const handleAddInteraction = (interaction: any) => {
    addInteraction(interaction);
    console.log('Adding interaction:', interaction);
  };

  const handleExport = (format: string, scale: number, quality: number) => {
    console.log(`Exporting as ${format} with scale ${scale} and quality ${quality}`);
    setIsExportModalOpen(false);
    setIsFileMenuOpen(false);
  };

  const isTextLayerSelected = selectedLayerIds.length > 0 && 
    selectedLayerIds.every(id => {
      const layer = layers.find(l => l.id === id);
      return layer?.type === 'text';
    });

  const menuItems = [
    {
      name: 'File',
      menu: [
        { label: 'New', shortcut: '⌘N', action: handleNewFile },
        { label: 'Open...', shortcut: '⌘O', action: handleOpenFile },
        { label: 'Save', shortcut: '⌘S', action: handleSave },
        { label: 'Save As...', shortcut: '⌘⇧S', action: handleSaveAs },
        { type: 'separator' },
        { label: 'Export', shortcut: '⌘E', action: handleExportClick },
        { label: 'Print...', shortcut: '⌘P', action: handlePrint },
        { type: 'separator' },
        { label: 'Settings', action: handleSettings },
        { label: 'Exit', action: handleExit },
      ]
    },
    {
      name: 'Edit',
      menu: [
        { label: 'Undo', shortcut: '⌘Z', action: undo, disabled: !canUndo() },
        { label: 'Redo', shortcut: '⌘⇧Z', action: redo, disabled: !canRedo() },
        { type: 'separator' },
        { label: 'Cut', shortcut: '⌘X', action: cut, disabled: selectedLayerIds.length === 0 },
        { label: 'Copy', shortcut: '⌘C', action: copy, disabled: selectedLayerIds.length === 0 },
        { label: 'Paste', shortcut: '⌘V', action: paste },
        { label: 'Duplicate', shortcut: '⌘D', action: handleDuplicate, disabled: selectedLayerIds.length === 0 },
        { type: 'separator' },
        { label: 'Group', shortcut: '⌘G', action: handleGroup, disabled: selectedLayerIds.length < 2 },
        { label: 'Ungroup', shortcut: '⌘⇧G', action: handleUngroup, disabled: selectedLayerIds.length !== 1 || layers.find(l => l.id === selectedLayerIds[0])?.type !== 'group' },
        { label: 'Delete', shortcut: '⌫', action: handleDelete, disabled: selectedLayerIds.length === 0 },
      ]
    },
    {
      name: 'View',
      menu: [
        { label: 'Zoom In', shortcut: '⌘+', action: handleZoomIn },
        { label: 'Zoom Out', shortcut: '⌘-', action: handleZoomOut },
        { label: 'Reset Zoom', shortcut: '⌘0', action: resetZoom },
        { type: 'separator' },
        { label: 'Show Grid', shortcut: '⌘\'', action: toggleGrid, checked: showGrid },
        { label: 'Show Rulers', shortcut: '⌘R', action: toggleRulers, checked: showRulers },
        { type: 'separator' },
        { label: 'Dark Mode', action: toggleDarkMode, icon: darkMode ? Sun : Moon, checked: darkMode },
      ]
    },
    {
      name: 'Object',
      menu: [
        { label: 'Bring to Front', shortcut: '⌘⇧]', action: handleBringToFront, disabled: selectedLayerIds.length !== 1 },
        { label: 'Bring Forward', shortcut: '⌘]', action: handleBringForward, disabled: selectedLayerIds.length !== 1 },
        { label: 'Send Backward', shortcut: '⌘[', action: handleSendBackward, disabled: selectedLayerIds.length !== 1 },
        { label: 'Send to Back', shortcut: '⌘⇧[', action: handleSendToBack, disabled: selectedLayerIds.length !== 1 },
      ]
    },
    {
      name: 'Text',
      menu: [
        { 
          label: 'Font Family', 
          submenu: [
            { label: 'Inter', action: () => handleFontFamily('Inter') },
            { label: 'Arial', action: () => handleFontFamily('Arial') },
            { label: 'Helvetica', action: () => handleFontFamily('Helvetica') },
            { label: 'Georgia', action: () => handleFontFamily('Georgia') },
            { label: 'Times New Roman', action: () => handleFontFamily('Times New Roman') },
          ],
          disabled: !isTextLayerSelected
        },
        { 
          label: 'Font Size', 
          submenu: [
            { label: '12', action: () => handleFontSize(12) },
            { label: '14', action: () => handleFontSize(14) },
            { label: '16', action: () => handleFontSize(16) },
            { label: '18', action: () => handleFontSize(18) },
            { label: '24', action: () => handleFontSize(24) },
            { label: '32', action: () => handleFontSize(32) },
          ],
          disabled: !isTextLayerSelected
        },
        { 
          label: 'Align Left', 
          shortcut: '⌘⇧L', 
          action: () => handleTextAlign('left'),
          disabled: !isTextLayerSelected
        },
        { 
          label: 'Align Center', 
          shortcut: '⌘⇧C', 
          action: () => handleTextAlign('center'),
          disabled: !isTextLayerSelected
        },
        { 
          label: 'Align Right', 
          shortcut: '⌘⇧R', 
          action: () => handleTextAlign('right'),
          disabled: !isTextLayerSelected
        },
      ]
    },
    {
      name: 'Arrange',
      menu: [
        { label: 'Align Left', action: () => handleAlign('left'), disabled: selectedLayerIds.length < 2 },
        { label: 'Align Center', action: () => handleAlign('center'), disabled: selectedLayerIds.length < 2 },
        { label: 'Align Right', action: () => handleAlign('right'), disabled: selectedLayerIds.length < 2 },
        { label: 'Align Top', action: () => handleAlign('top'), disabled: selectedLayerIds.length < 2 },
        { label: 'Align Middle', action: () => handleAlign('middle'), disabled: selectedLayerIds.length < 2 },
        { label: 'Align Bottom', action: () => handleAlign('bottom'), disabled: selectedLayerIds.length < 2 },
        { type: 'separator' },
        { label: 'Distribute Horizontally', action: () => handleDistribute('horizontal'), disabled: selectedLayerIds.length < 3 },
        { label: 'Distribute Vertically', action: () => handleDistribute('vertical'), disabled: selectedLayerIds.length < 3 },
      ]
    },
    {
      name: 'Prototype',
      menu: [
        { 
          label: 'Add Interaction', 
          action: () => setIsAddInteractionOpen(true),
          disabled: selectedLayerIds.length === 0
        },
        { label: 'Play Prototype', action: () => console.log('Play prototype') },
        { type: 'separator' },
        { label: 'Device Preview', action: () => console.log('Device preview') },
        { label: 'Share Prototype', action: () => console.log('Share prototype') },
      ]
    },
    {
      name: 'Help',
      menu: [
        { label: 'Documentation', action: () => handleShowHelp() },
        { label: 'Keyboard Shortcuts', action: () => console.log('Shortcuts') },
        { label: 'Community', action: () => console.log('Community') },
        { label: 'About', action: () => console.log('About') },
      ]
    }
  ];

  const toggleMenu = (menuName: string) => {
    setIsFileMenuOpen(menuName === 'File' ? !isFileMenuOpen : false);
    setIsEditMenuOpen(menuName === 'Edit' ? !isEditMenuOpen : false);
    setIsViewMenuOpen(menuName === 'View' ? !isViewMenuOpen : false);
    setIsObjectMenuOpen(menuName === 'Object' ? !isObjectMenuOpen : false);
    setIsTextMenuOpen(menuName === 'Text' ? !isTextMenuOpen : false);
    setIsArrangeMenuOpen(menuName === 'Arrange' ? !isArrangeMenuOpen : false);
  };

  const renderMenu = (menuConfig: any, isOpen: boolean, menuRef: React.RefObject<HTMLDivElement | null>) => {
    if (!isOpen) return null;

    return (
      <div
        ref={menuRef}
        className={`absolute top-full left-0 mt-1 w-56 border rounded-lg shadow-lg z-50 py-1 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
      >
        {menuConfig.menu.map((item: any, index: number) => {
          if (item.type === 'separator') {
            return <div key={index} className={`h-px my-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />;
          }

          if (item.submenu) {
            return (
              <div key={index} className="relative group">
                <button
                  disabled={item.disabled}
                  className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between transition-colors ${
                    item.disabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : darkMode 
                        ? 'hover:bg-gray-700 text-gray-200' 
                        : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>{item.label}</span>
                  <span>▶</span>
                </button>
                <div className={`absolute left-full top-0 ml-1 w-48 border rounded-lg shadow-lg z-50 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  {item.submenu.map((subItem: any, subIndex: number) => (
                    <button
                      key={subIndex}
                      onClick={subItem.action}
                      className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-200' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <button
              key={index}
              onClick={item.action}
              disabled={item.disabled}
              className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between transition-colors ${
                item.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : darkMode 
                    ? 'hover:bg-gray-700 text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-700'
              } ${
                item.checked 
                  ? darkMode 
                    ? 'bg-blue-900 text-blue-200' 
                    : 'bg-blue-50 text-blue-600'
                  : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                {item.icon && <item.icon size={14} />}
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".figma,.json"
        style={{ display: 'none' }}
      />
      
      <div className={`h-12 border-b flex items-center justify-between px-4 ${
        darkMode 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-sm"></div>
            <span className="font-semibold text-base">Figma Clone</span>
          </div>
          <div className="flex items-center space-x-1 relative">
            {menuItems.map((item) => (
              <div key={item.name} className="relative">
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`px-2 py-1.5 rounded text-sm font-medium transition-colors ${
                    darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </button>
                
                {item.name === 'File' && renderMenu(item, isFileMenuOpen, fileMenuRef)}
                {item.name === 'Edit' && renderMenu(item, isEditMenuOpen, editMenuRef)}
                {item.name === 'View' && renderMenu(item, isViewMenuOpen, viewMenuRef)}
                {item.name === 'Object' && renderMenu(item, isObjectMenuOpen, objectMenuRef)}
                {item.name === 'Text' && renderMenu(item, isTextMenuOpen, textMenuRef)}
                {item.name === 'Arrange' && renderMenu(item, isArrangeMenuOpen, arrangeMenuRef)}
                {item.name === 'Prototype' && renderMenu(item, false, useRef(null))}
                {item.name === 'Help' && renderMenu(item, false, useRef(null))}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-1 ml-4">
            <button 
              className={`w-8 h-8 flex items-center justify-center rounded ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              } ${
                !canUndo() ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              onClick={undo}
              disabled={!canUndo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo size={16} />
            </button>
            <button 
              className={`w-8 h-8 flex items-center justify-center rounded ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              } ${
                !canRedo() ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              onClick={redo}
              disabled={!canRedo()}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button 
              className={`w-8 h-8 flex items-center justify-center rounded ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`} 
              title="Save"
              onClick={handleSave}
            >
              <Save size={16} />
            </button>
            <div className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>{fileName}</div>
            <button 
              className={`w-8 h-8 flex items-center justify-center rounded ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`} 
              title="File actions"
              onClick={() => toggleMenu('File')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.5 6L8 9.5L11.5 6H4.5Z"/>
              </svg>
            </button>
          </div>

          <div className={`w-px h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className="flex items-center space-x-1">
            <button 
              className={`w-8 h-8 flex items-center justify-center rounded ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              } ${
                selectedLayerIds.length === 0 ? 'opacity-30 cursor-not-allowed' : ''
              }`} 
              title="Add Interaction"
              onClick={() => setIsAddInteractionOpen(true)}
              disabled={selectedLayerIds.length === 0}
            >
              <Play size={16} />
            </button>
            <button className={`w-8 h-8 flex items-center justify-center rounded ${
              darkMode 
                ? 'hover:bg-gray-800 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`} title="Show comments">
              <MessageCircle size={16} />
            </button>
            <button className={`w-8 h-8 flex items-center justify-center rounded ${
              darkMode 
                ? 'hover:bg-gray-800 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`} title="Share">
              <Share2 size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search size={16} className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search"
              className={`w-32 pl-8 pr-3 py-1.5 text-sm border rounded focus:outline-none focus:border-blue-500 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:bg-white'
              }`}
            />
          </div>
          
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded ${
              darkMode 
                ? 'hover:bg-gray-800 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`} 
            title="Settings"
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon size={16} />
          </button>
          
          <button className={`w-8 h-8 flex items-center justify-center rounded ${
            darkMode 
              ? 'hover:bg-gray-800 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`} title="View options">
            <Eye size={16} />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Account"
            >
              <User size={16} />
            </button>
            
            {isAccountMenuOpen && (
              <div
                ref={accountMenuRef}
                className={`absolute top-full right-0 mt-1 w-48 border rounded-lg shadow-lg z-50 py-1 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className={`px-4 py-2 text-sm border-b ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    User Name
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    user@example.com
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    setIsProfileOpen(true);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left flex items-center space-x-2 transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <User size={14} />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={toggleDarkMode}
                  className={`w-full px-4 py-2 text-sm text-left flex items-center space-x-2 transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                  <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <div className={`h-px my-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <button className={`w-full px-4 py-2 text-sm text-left flex items-center space-x-2 transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-red-400' 
                    : 'hover:bg-gray-100 text-red-600'
                }`}>
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <Profile 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AddInteraction 
        isOpen={isAddInteractionOpen}
        onClose={() => setIsAddInteractionOpen(false)}
        onAddInteraction={handleAddInteraction}
        layers={layers}
      />
    </>
  );
}