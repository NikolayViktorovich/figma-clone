import { create } from 'zustand';
import type { Layer, HistoryState, Tool, VectorPoint, Interaction, CanvasState, ClipboardState, UserProfile } from '../types';

interface FigmaState {
  canvas: CanvasState;
  layers: Layer[];
  selectedLayerIds: string[];
  currentTool: Tool;
  history: HistoryState[];
  historyIndex: number;
  showGrid: boolean;
  showRulers: boolean;
  clipboard: ClipboardState | null;
  fileName: string;
  interactions: Interaction[];
  userProfile: UserProfile;
  darkMode: boolean;
  autoSave: boolean;

  setZoom: (zoom: number) => void;
  setOffset: (offset: { x: number; y: number }) => void;
  setCurrentTool: (tool: Tool) => void;

  addLayer: (layer: Layer) => void;
  deleteLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  selectLayer: (id: string) => void;
  selectLayers: (ids: string[]) => void;
  clearSelection: () => void;

  duplicateLayer: (id: string) => void;
  groupLayers: (layerIds: string[]) => void;
  ungroupLayer: (groupId: string) => void;

  addVectorPoint: (layerId: string, point: VectorPoint) => void;
  updateVectorPoint: (layerId: string, pointIndex: number, updates: Partial<VectorPoint>) => void;

  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  bringToFront: (layerId: string) => void;
  bringForward: (layerId: string) => void;
  sendBackward: (layerId: string) => void;
  sendToBack: (layerId: string) => void;

  alignLayers: (alignment: string) => void;
  distributeLayers: (distribution: string) => void;

  setFontFamily: (layerId: string, fontFamily: string) => void;
  setFontSize: (layerId: string, fontSize: number) => void;
  setTextAlign: (layerId: string, align: 'left' | 'center' | 'right') => void;

  toggleGrid: () => void;
  toggleRulers: () => void;
  resetZoom: () => void;
  setShowGrid: (enabled: boolean) => void;
  setShowRulers: (enabled: boolean) => void;

  newFile: () => void;
  openFile: (file: File) => void;
  saveFile: () => void;
  saveFileAs: () => void;
  print: () => void;

  cut: () => void;
  copy: () => void;
  paste: () => void;

  setFileName: (name: string) => void;
  showSettings: () => void;
  showHelp: () => void;
  exitApp: () => void;

  addInteraction: (interaction: Interaction) => void;
  deleteInteraction: (id: string) => void;
  updateInteraction: (id: string, updates: Partial<Interaction>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;

  setAutoSave: (enabled: boolean) => void;
}

const getLayersBounds = (layers: Layer[]) => {
  if (layers.length === 0) return null;
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  layers.forEach(layer => {
    minX = Math.min(minX, layer.x);
    minY = Math.min(minY, layer.y);
    maxX = Math.max(maxX, layer.x + layer.width);
    maxY = Math.max(maxY, layer.y + layer.height);
  });
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

export const useFigmaStore = create<FigmaState>((set, get) => ({
  canvas: {
    zoom: 1,
    offset: { x: 0, y: 0 },
  },
  layers: [],
  selectedLayerIds: [],
  currentTool: 'select',
  history: [],
  historyIndex: -1,
  showGrid: true,
  showRulers: false,
  clipboard: null,
  fileName: 'Untitled',
  interactions: [],
  userProfile: {
    name: 'Nikolay Viktorovich',
    email: 'n.golubtsov05@bk.ru',
    role: 'Product Designer',
    location: 'Russia, Ekaterinburg',
    joinDate: 'January 2024',
    bio: 'Passionate about creating beautiful and functional user interfaces. Love working with design systems and prototyping.',
  },
  darkMode: false,
  autoSave: true,

  setZoom: (zoom) => {
    set((state) => ({ canvas: { ...state.canvas, zoom } }));
  },
  
  setOffset: (offset) => {
    set((state) => ({ canvas: { ...state.canvas, offset } }));
  },
  
  setCurrentTool: (tool) => {
    set({ currentTool: tool });
  },

  addLayer: (layer) => {
    set((state) => ({ 
      layers: [...state.layers, layer],
      selectedLayerIds: [layer.id]
    }));
    get().saveHistory();
  },
  
  deleteLayer: (id) => {
    const state = get();
    const layerToDelete = state.layers.find(layer => layer.id === id);
    
    if (layerToDelete?.type === 'group' && layerToDelete.children) {
      set({
        layers: state.layers.filter(layer => 
          layer.id !== id && !layerToDelete.children!.includes(layer.id)
        ),
        selectedLayerIds: state.selectedLayerIds.filter(layerId => layerId !== id)
      });
    } else {
      set({
        layers: state.layers.filter(layer => layer.id !== id),
        selectedLayerIds: state.selectedLayerIds.filter(layerId => layerId !== id)
      });
    }
    get().saveHistory();
  },
  
  updateLayer: (id, updates) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    }));
    get().saveHistory();
  },
  
  selectLayer: (id) => {
    if (id === '') {
      set({ selectedLayerIds: [] });
    } else {
      set({ selectedLayerIds: [id] });
    }
  },
  
  selectLayers: (ids) => {
    set({ selectedLayerIds: ids });
  },
  
  clearSelection: () => set({ selectedLayerIds: [] }),
  duplicateLayer: (id) => {
    const { layers } = get();
    const original = layers.find(layer => layer.id === id);
    if (!original) return;
    
    const duplicate: Layer = {
      ...JSON.parse(JSON.stringify(original)),
      id: `${original.type}-${Date.now()}`,
      x: original.x + 20,
      y: original.y + 20,
    };
    
    set((state) => ({
      layers: [...state.layers, duplicate],
      selectedLayerIds: [duplicate.id]
    }));
    
    get().saveHistory();
  },
  
  groupLayers: (layerIds) => {
    const { layers } = get();
    if (layerIds.length < 2) return;
    
    const selectedLayers = layers.filter(layer => layerIds.includes(layer.id));
    if (selectedLayers.length < 2) return;

    const minX = Math.min(...selectedLayers.map(layer => layer.x));
    const minY = Math.min(...selectedLayers.map(layer => layer.y));
    const maxX = Math.max(...selectedLayers.map(layer => layer.x + layer.width));
    const maxY = Math.max(...selectedLayers.map(layer => layer.y + layer.height));
    
    const group: Layer = {
      id: `group-${Date.now()}`,
      type: 'group',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      fill: 'transparent',
      children: layerIds,
      isExpanded: true,
      name: 'Group',
      visible: true,
      locked: false
    };
    
    set((state) => ({
      layers: [
        ...state.layers.filter(layer => !layerIds.includes(layer.id)),
        group
      ],
      selectedLayerIds: [group.id]
    }));
    
    get().saveHistory();
  },
  
  ungroupLayer: (groupId) => {
    const { layers } = get();
    const group = layers.find(layer => layer.id === groupId);
    
    if (!group || group.type !== 'group' || !group.children) return;
    
    const childLayers = layers.filter(layer => group.children!.includes(layer.id));
    const updatedChildren = childLayers.map(layer => ({
      ...layer,
      x: group.x + (layer.x || 0),
      y: group.y + (layer.y || 0)
    }));
    
    set((state) => ({
      layers: [
        ...state.layers.filter(layer => 
          layer.id !== groupId && !group.children!.includes(layer.id)
        ),
        ...updatedChildren
      ],
      selectedLayerIds: group.children
    }));
    
    get().saveHistory();
  },

  addVectorPoint: (layerId, point) => {
    const { layers } = get();
    const layer = layers.find(l => l.id === layerId);
    if (!layer || layer.type !== 'vector') return;
    
    const updatedPoints = [...(layer.points || []), point];
    get().updateLayer(layerId, { points: updatedPoints });
  },
  
  updateVectorPoint: (layerId, pointIndex, updates) => {
    const { layers } = get();
    const layer = layers.find(l => l.id === layerId);
    if (!layer || layer.type !== 'vector' || !layer.points) return;
    
    const updatedPoints = layer.points.map((point, index) =>
      index === pointIndex ? { ...point, ...updates } : point
    );
    
    get().updateLayer(layerId, { points: updatedPoints });
  },

  saveHistory: () => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    const currentState: HistoryState = {
      layers: JSON.parse(JSON.stringify(state.layers)),
      selectedLayerIds: [...state.selectedLayerIds],
      canvas: { ...state.canvas }
    };
    
    set({
      history: [...newHistory, currentState],
      historyIndex: newHistory.length
    });
  },
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      set({
        layers: previousState.layers,
        selectedLayerIds: previousState.selectedLayerIds,
        canvas: previousState.canvas,
        historyIndex: historyIndex - 1
      });
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        layers: nextState.layers,
        selectedLayerIds: nextState.selectedLayerIds,
        canvas: nextState.canvas,
        historyIndex: historyIndex + 1
      });
    }
  },
  
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  bringToFront: (layerId) => {
    const { layers } = get();
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex === -1) return;

    const newLayers = [...layers];
    const [layer] = newLayers.splice(layerIndex, 1);
    newLayers.push(layer);

    set({ layers: newLayers });
    get().saveHistory();
  },

  bringForward: (layerId) => {
    const { layers } = get();
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex === -1 || layerIndex === layers.length - 1) return;

    const newLayers = [...layers];
    [newLayers[layerIndex], newLayers[layerIndex + 1]] = [newLayers[layerIndex + 1], newLayers[layerIndex]];

    set({ layers: newLayers });
    get().saveHistory();
  },

  sendBackward: (layerId) => {
    const { layers } = get();
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex === -1 || layerIndex === 0) return;

    const newLayers = [...layers];
    [newLayers[layerIndex], newLayers[layerIndex - 1]] = [newLayers[layerIndex - 1], newLayers[layerIndex]];

    set({ layers: newLayers });
    get().saveHistory();
  },

  sendToBack: (layerId) => {
    const { layers } = get();
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex === -1) return;

    const newLayers = [...layers];
    const [layer] = newLayers.splice(layerIndex, 1);
    newLayers.unshift(layer);

    set({ layers: newLayers });
    get().saveHistory();
  },

  alignLayers: (alignment) => {
    const { layers, selectedLayerIds, updateLayer } = get();
    if (selectedLayerIds.length < 2) return;

    const selectedLayers = layers.filter(l => selectedLayerIds.includes(l.id));
    const bounds = getLayersBounds(selectedLayers);
    if (!bounds) return;

    selectedLayers.forEach(layer => {
      let updates: Partial<Layer> = {};

      switch (alignment) {
        case 'left':
          updates = { x: bounds.x };
          break;
        case 'center':
          updates = { x: bounds.x + bounds.width / 2 - layer.width / 2 };
          break;
        case 'right':
          updates = { x: bounds.x + bounds.width - layer.width };
          break;
        case 'top':
          updates = { y: bounds.y };
          break;
        case 'middle':
          updates = { y: bounds.y + bounds.height / 2 - layer.height / 2 };
          break;
        case 'bottom':
          updates = { y: bounds.y + bounds.height - layer.height };
          break;
      }

      updateLayer(layer.id, updates);
    });
  },

  distributeLayers: (distribution) => {
    const { layers, selectedLayerIds, updateLayer } = get();
    if (selectedLayerIds.length < 3) return;

    const selectedLayers = layers.filter(l => selectedLayerIds.includes(l.id));
    const sortedLayers = [...selectedLayers].sort((a, b) => {
      if (distribution === 'horizontal') {
        return a.x - b.x;
      } else {
        return a.y - b.y;
      }
    });

    if (distribution === 'horizontal') {
      const totalWidth = sortedLayers[sortedLayers.length - 1].x + sortedLayers[sortedLayers.length - 1].width - sortedLayers[0].x;
      const gap = totalWidth / (sortedLayers.length - 1);
      
      sortedLayers.forEach((layer, index) => {
        updateLayer(layer.id, {
          x: sortedLayers[0].x + (gap * index)
        });
      });
    } else if (distribution === 'vertical') {
      const totalHeight = sortedLayers[sortedLayers.length - 1].y + sortedLayers[sortedLayers.length - 1].height - sortedLayers[0].y;
      const gap = totalHeight / (sortedLayers.length - 1);
      
      sortedLayers.forEach((layer, index) => {
        updateLayer(layer.id, {
          y: sortedLayers[0].y + (gap * index)
        });
      });
    }
  },

  setFontFamily: (layerId, fontFamily) => {
    const { updateLayer } = get();
    updateLayer(layerId, { fontFamily });
  },

  setFontSize: (layerId, fontSize) => {
    const { updateLayer } = get();
    updateLayer(layerId, { fontSize });
  },

  setTextAlign: (layerId, align) => {
    const { updateLayer } = get();
    updateLayer(layerId, { textAlign: align });
  },

  toggleGrid: () => {
    set((state) => ({ showGrid: !state.showGrid }));
  },

  toggleRulers: () => {
    set((state) => ({ showRulers: !state.showRulers }));
  },

  resetZoom: () => {
    set({ canvas: { zoom: 1, offset: { x: 0, y: 0 } } });
  },

  setShowGrid: (enabled: boolean) => {
    set({ showGrid: enabled });
  },

  setShowRulers: (enabled: boolean) => {
    set({ showRulers: enabled });
  },

  newFile: () => {
    set({ 
      layers: [], 
      selectedLayerIds: [], 
      history: [], 
      historyIndex: -1,
      fileName: 'Untitled',
      interactions: []
    });
  },

  openFile: (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          set({ 
            layers: data, 
            selectedLayerIds: [], 
            history: [{
              layers: JSON.parse(JSON.stringify(data)),
              selectedLayerIds: [],
              canvas: { zoom: 1, offset: { x: 0, y: 0 } }
            }], 
            historyIndex: 0,
            fileName: file.name.replace('.figma', ''),
            interactions: []
          });
        }
      } catch (error) {
        console.error('Error opening file:', error);
        alert('Error opening file. Please make sure it is a valid Figma file.');
      }
    };
    reader.readAsText(file);
  },

  saveFile: () => {
    const state = get();
    const data = JSON.stringify({
      layers: state.layers,
      interactions: state.interactions,
      fileName: state.fileName
    });
    localStorage.setItem('figma-clone-save', data);
    console.log('File saved to localStorage');
  },

  saveFileAs: () => {
    const state = get();
    const data = JSON.stringify({
      layers: state.layers,
      interactions: state.interactions,
      fileName: state.fileName
    });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.fileName || 'design'}.figma`;
    a.click();
    URL.revokeObjectURL(url);
  },

  print: () => {
    window.print();
  },

  cut: () => {
    const { layers, selectedLayerIds, deleteLayer } = get();
    const selectedLayers = layers.filter(l => selectedLayerIds.includes(l.id));
    if (selectedLayers.length === 0) return;

    const clipboard = {
      layers: selectedLayers,
      offset: { x: 10, y: 10 }
    };

    selectedLayerIds.forEach(id => deleteLayer(id));
    set({ clipboard });
  },

  copy: () => {
    const { layers, selectedLayerIds } = get();
    const selectedLayers = layers.filter(l => selectedLayerIds.includes(l.id));
    if (selectedLayers.length === 0) return;

    const clipboard = {
      layers: selectedLayers.map(layer => ({ ...layer })),
      offset: { x: 0, y: 0 }
    };

    set({ clipboard });
  },

  paste: () => {
    const { clipboard, layers } = get();
    if (!clipboard) return;

    const newLayers = clipboard.layers.map(layer => ({
      ...layer,
      id: `${layer.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: layer.x + clipboard.offset.x,
      y: layer.y + clipboard.offset.y,
      name: layer.name ? `${layer.name} Copy` : 'Copy'
    }));

    const allLayers = [...layers, ...newLayers];
    const newSelectedIds = newLayers.map(l => l.id);

    set({ 
      layers: allLayers,
      selectedLayerIds: newSelectedIds,
      clipboard: {
        ...clipboard,
        offset: {
          x: clipboard.offset.x + 10,
          y: clipboard.offset.y + 10
        }
      }
    });
    get().saveHistory();
  },

  setFileName: (name: string) => {
    set({ fileName: name });
  },

  showSettings: () => {
    console.log('Opening settings...');
  },

  showHelp: () => {
    console.log('Opening help...');
  },

  exitApp: () => {
    if (confirm('Are you sure you want to exit? Any unsaved changes will be lost.')) {
      console.log('Exiting application...');
      window.close();
    }
  },

  addInteraction: (interaction) => {
    set((state) => ({ 
      interactions: [...state.interactions, interaction] 
    }));
  },

  deleteInteraction: (id) => {
    set((state) => ({
      interactions: state.interactions.filter(i => i.id !== id)
    }));
  },

  updateInteraction: (id, updates) => {
    set((state) => ({
      interactions: state.interactions.map(interaction =>
        interaction.id === id ? { ...interaction, ...updates } : interaction
      )
    }));
  },

  updateUserProfile: (updates) => {
    set((state) => ({
      userProfile: { ...state.userProfile, ...updates }
    }));
  },

  toggleDarkMode: () => {
    set((state) => ({ darkMode: !state.darkMode }));
  },

  setDarkMode: (enabled: boolean) => {
    set({ darkMode: enabled });
  },

  setAutoSave: (enabled: boolean) => {
    set({ autoSave: enabled });
  },
}));