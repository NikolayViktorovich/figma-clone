export interface Point {
  x: number;
  y: number;
}

export interface VectorPoint extends Point {
  type: 'corner' | 'mirrored' | 'asymmetric' | 'disconnected';
  cornerRadius?: number;
  handleIn?: Point;
  handleOut?: Point;
}

export interface Layer {
  id: string;
  type: 'rectangle' | 'ellipse' | 'text' | 'group' | 'frame' | 'line' | 'arrow' | 'vector' | 'path';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  points?: VectorPoint[];
  isClosed?: boolean;
  startArrow?: boolean;
  endArrow?: boolean;
  children?: string[];
  isExpanded?: boolean;
  name?: string;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  blur?: number;
  shadow?: {
    x: number;
    y: number;
    blur: number;
    color: string;
  };
}

export interface HistoryState {
  layers: Layer[];
  selectedLayerIds: string[];
  canvas: {
    zoom: number;
    offset: { x: number; y: number };
  };
}

export interface Interaction {
  id: string;
  trigger: string;
  action: string;
  target: string;
  animation: string;
  sourceLayerId?: string;
  duration?: number;
  easing?: string;
}

export interface CanvasState {
  zoom: number;
  offset: { x: number; y: number };
}

export type Tool = 'select' | 'frame' | 'rectangle' | 'ellipse' | 'text' | 'line' | 'arrow' | 'pen' | 'pencil' | 'hand' | 'zoom' | 'vector';

export interface ClipboardState {
  layers: Layer[];
  offset: { x: number; y: number };
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  location: string;
  joinDate: string;
  bio: string;
  avatar?: string;
}