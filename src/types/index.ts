export interface Point {
  x: number;
  y: number;
}

export interface Layer {
  id: string;
  type: 'rectangle' | 'ellipse' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  // Для текста
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}