import { create } from 'zustand';
import type { Layer } from '../types'; 

interface FigmaState {
  canvas: {
    zoom: number;
    offset: { x: number; y: number };
  };
  layers: Layer[];
  selectedLayerIds: string[];
  setZoom: (zoom: number) => void;
  setOffset: (offset: { x: number; y: number }) => void;
  addLayer: (layer: Layer) => void;
  selectLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
}

export const useFigmaStore = create<FigmaState>((set) => ({
  canvas: {
    zoom: 1,
    offset: { x: 0, y: 0 },
  },
  layers: [],
  selectedLayerIds: [],

  setZoom: (zoom) => set((state) => ({ canvas: { ...state.canvas, zoom } })),
  setOffset: (offset) => set((state) => ({ canvas: { ...state.canvas, offset } })),
  addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
  selectLayer: (id) => set({ selectedLayerIds: [id] }),
  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    })),
}));