import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Text, Ellipse, Line, Arrow, Group } from 'react-konva';
import { useFigmaStore } from '../../store/useFigmaStore';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Tool, VectorPoint } from '../../types';

const FRAME_PRESETS = [
  { label: 'Desktop (1440x900)', width: 1440, height: 900 },
  { label: 'Mobile (375x812)', width: 375, height: 812 },
  { label: 'Tablet (768x1024)', width: 768, height: 1024 },
  { label: 'Custom', width: 400, height: 300 },
];

const CanvasStage: React.FC = () => {
  const { 
    layers, 
    selectedLayerIds, 
    updateLayer, 
    selectLayers,
    canvas, 
    addLayer,
    deleteLayer,
    groupLayers,
    ungroupLayer,
    clearSelection,
    currentTool,
    setCurrentTool,
    duplicateLayer,
    setZoom,
    setOffset,
    showGrid,
    showRulers,
    darkMode
  } = useFigmaStore();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [tempLayer, setTempLayer] = useState<any>(null);
  const [penPoints, setPenPoints] = useState<VectorPoint[]>([]);
  const [isPenDrawing, setIsPenDrawing] = useState(false);
  const [showFramePresets, setShowFramePresets] = useState(false);
  const [framePresetPos, setFramePresetPos] = useState({ x: 0, y: 0 });

  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const framePresetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const transformer = transformerRef.current;
      if (selectedLayerIds.length > 0) {
        const nodes = selectedLayerIds
          .map(id => stageRef.current.findOne(`#${id}`))
          .filter(Boolean);
        transformer.nodes(nodes);
        transformer.getLayer()?.batchDraw();
      } else {
        transformer.nodes([]);
      }
    }
  }, [selectedLayerIds]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerIds.length > 0) {
        e.preventDefault();
        selectedLayerIds.forEach(id => deleteLayer(id));
        clearSelection();
      }

      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (selectedLayerIds.length === 1) {
          duplicateLayer(selectedLayerIds[0]);
        }
      }

      if (e.key === 'g' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          if (selectedLayerIds.length === 1) {
            const layer = layers.find(l => l.id === selectedLayerIds[0]);
            if (layer?.type === 'group') {
              ungroupLayer(layer.id);
            }
          }
        } else {
          if (selectedLayerIds.length >= 2) {
            groupLayers(selectedLayerIds);
          }
        }
      }

      const toolShortcuts: { [key: string]: Tool } = {
        'v': 'select',
        'f': 'frame',
        'r': 'rectangle',
        'o': 'ellipse',
        't': 'text',
        'l': 'line',
        'a': 'arrow',
        'p': 'pen',
        'z': 'zoom',
        'h': 'hand'
      };

      if (toolShortcuts[e.key] && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setCurrentTool(toolShortcuts[e.key]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (framePresetTimeout.current) clearTimeout(framePresetTimeout.current);
    };
  }, [selectedLayerIds, layers, deleteLayer, groupLayers, ungroupLayer, duplicateLayer, setCurrentTool]);

  const handleShapeClick = (e: KonvaEventObject<MouseEvent>, id: string) => {
    e.cancelBubble = true;
    const isMultiSelect = e.evt.shiftKey;

    if (isMultiSelect) {
      if (selectedLayerIds.includes(id)) {
        selectLayers(selectedLayerIds.filter(i => i !== id));
      } else {
        selectLayers([...selectedLayerIds, id]);
      }
    } else {
      selectLayers([id]);
    }
    setCurrentTool('select');
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos || !stage) return;

    if (e.target === stage && !e.evt.shiftKey) {
      clearSelection();
    }

    if (currentTool === 'hand') {
      stage.startDrag();
      return;
    }

    if (currentTool === 'select') return;
    if (currentTool === 'text') {
      const layer = {
        id: `text-${Date.now()}`,
        type: 'text' as const,
        x: pos.x,
        y: pos.y,
        width: 120,
        height: 30,
        text: 'Text',
        fontSize: 16,
        fontFamily: 'Inter',
        fill: darkMode ? '#ffffff' : '#000000',
        rotation: 0,
        name: `Text ${layers.length + 1}`,
        visible: true,
        locked: false,
      };
      addLayer(layer);
      selectLayers([layer.id]);
      return;
    }

    if (currentTool === 'frame') {
      setFramePresetPos(pos);
      setShowFramePresets(true);
      if (framePresetTimeout.current) clearTimeout(framePresetTimeout.current);
      framePresetTimeout.current = setTimeout(() => setShowFramePresets(false), 3000);
      return;
    }

    if (['rectangle', 'ellipse', 'line', 'arrow'].includes(currentTool)) {
      setIsDrawing(true);
      setStartPos(pos);
      const tempId = `temp-${Date.now()}`;
      const config: any = {
        id: tempId,
        type: currentTool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        rotation: 0,
        fill: getToolFill(currentTool),
        stroke: getToolStroke(currentTool),
        strokeWidth: getToolStrokeWidth(currentTool),
        visible: true,
        locked: false,
      };
      if (currentTool === 'line' || currentTool === 'arrow') {
        config.points = [0, 0, 0, 0];
      }
      if (currentTool === 'arrow') {
        config.endArrow = true;
      }
      setTempLayer(config);
      return;
    }

    if (currentTool === 'pen') {
      if (!isPenDrawing) {
        setIsPenDrawing(true);
        setPenPoints([{ x: pos.x, y: pos.y, type: 'corner' }]);
      } else {
        setPenPoints(prev => [...prev, { x: pos.x, y: pos.y, type: 'corner' }]);
      }
      return;
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (currentTool === 'pen' && isPenDrawing) return;
    if (!isDrawing || !tempLayer) return;

    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    const dx = pos.x - startPos.x;
    const dy = pos.y - startPos.y;

    if (['line', 'arrow'].includes(currentTool)) {
      setTempLayer({
        ...tempLayer,
        points: [0, 0, dx, dy],
      });
    } else {
      setTempLayer({
        ...tempLayer,
        x: dx >= 0 ? startPos.x : pos.x,
        y: dy >= 0 ? startPos.y : pos.y,
        width: Math.abs(dx),
        height: Math.abs(dy),
      });
    }
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (currentTool === 'pen' && isPenDrawing) {
      if (e.evt.detail === 2 && penPoints.length > 1) {
        const minX = Math.min(...penPoints.map(p => p.x));
        const minY = Math.min(...penPoints.map(p => p.y));
        const vectorLayer = {
          id: `vector-${Date.now()}`,
          type: 'vector' as const,
          x: minX,
          y: minY,
          width: Math.max(...penPoints.map(p => p.x)) - minX,
          height: Math.max(...penPoints.map(p => p.y)) - minY,
          rotation: 0,
          fill: '#3b82f6',
          stroke: '#1d4ed8',
          strokeWidth: 2,
          points: penPoints.map(p => ({ ...p, x: p.x - minX, y: p.y - minY })),
          isClosed: true,
          name: `Vector ${layers.length + 1}`,
          visible: true,
          locked: false,
        };
        addLayer(vectorLayer);
        selectLayers([vectorLayer.id]);
        setIsPenDrawing(false);
        setPenPoints([]);
      }
      return;
    }

    if (!isDrawing || !tempLayer) {
      setIsDrawing(false);
      setTempLayer(null);
      return;
    }

    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    const dx = pos.x - startPos.x;
    const dy = pos.y - startPos.y;
    const isLargeEnough = Math.abs(dx) > 5 || Math.abs(dy) > 5;

    if (isLargeEnough || ['line', 'arrow'].includes(currentTool)) {
      const finalLayer = {
        ...tempLayer,
        id: `${currentTool}-${Date.now()}`,
        name: `${getToolName(currentTool)} ${layers.length + 1}`,
        visible: true,
        locked: false,
      };

      delete finalLayer.temp;

      if (['rectangle', 'ellipse', 'frame'].includes(currentTool)) {
        finalLayer.x = dx >= 0 ? startPos.x : pos.x;
        finalLayer.y = dy >= 0 ? startPos.y : pos.y;
        finalLayer.width = Math.abs(dx);
        finalLayer.height = Math.abs(dy);
      }

      if (['line', 'arrow'].includes(currentTool)) {
        finalLayer.x = startPos.x;
        finalLayer.y = startPos.y;
        finalLayer.width = Math.abs(dx);
        finalLayer.height = Math.abs(dy);
        finalLayer.points = [0, 0, dx, dy];
      }

      addLayer(finalLayer);
      selectLayers([finalLayer.id]);
    }

    setIsDrawing(false);
    setTempLayer(null);
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldZoom = canvas.zoom;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const worldPoint = {
      x: (pointer.x - canvas.offset.x) / oldZoom,
      y: (pointer.y - canvas.offset.y) / oldZoom,
    };

    const delta = e.evt.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, oldZoom * delta));
    const newOffset = {
      x: pointer.x - worldPoint.x * newZoom,
      y: pointer.y - worldPoint.y * newZoom,
    };

    setZoom(newZoom);
    setOffset(newOffset);
  };

  const getToolFill = (tool: Tool): string => {
    const fills: { [key in Tool]?: string } = {
      'frame': darkMode ? '#1f2937' : '#ffffff',
      'rectangle': '#3b82f6',
      'ellipse': '#3b82f6',
      'text': darkMode ? '#ffffff' : '#000000',
      'vector': '#3b82f6',
    };
    return fills[tool] || 'transparent';
  };

  const getToolStroke = (tool: Tool): string => {
    const strokes: { [key in Tool]?: string } = {
      'frame': darkMode ? '#4b5563' : '#64748b',
      'rectangle': '#1d4ed8',
      'ellipse': '#1d4ed8',
      'line': darkMode ? '#ffffff' : '#000000',
      'arrow': darkMode ? '#ffffff' : '#000000',
      'vector': '#1d4ed8',
    };
    return strokes[tool] || '#000000';
  };

  const getToolStrokeWidth = (tool: Tool): number => {
    const widths: { [key in Tool]?: number } = {
      'frame': 1,
      'line': 2,
      'arrow': 2,
    };
    return widths[tool] || 2;
  };

  const getToolName = (tool: Tool): string => {
    const names: { [key in Tool]: string } = {
      'select': 'Select',
      'frame': 'Frame',
      'rectangle': 'Rectangle',
      'ellipse': 'Ellipse',
      'text': 'Text',
      'line': 'Line',
      'arrow': 'Arrow',
      'pen': 'Pen',
      'pencil': 'Pencil',
      'hand': 'Hand',
      'zoom': 'Zoom',
      'vector': 'Vector',
    };
    return names[tool];
  };

  const renderLayer = (layer: any) => {
    if (layer.visible === false) return null;
    const isSelected = selectedLayerIds.includes(layer.id);

    const commonProps = {
      key: layer.id,
      id: layer.id,
      x: layer.x,
      y: layer.y,
      rotation: layer.rotation,
      onClick: (e: KonvaEventObject<MouseEvent>) => handleShapeClick(e, layer.id),
      onTap: (e: KonvaEventObject<MouseEvent>) => handleShapeClick(e, layer.id),
      draggable: !layer.locked && currentTool === 'select',
      onDragEnd: (e: any) => {
        if (!layer.locked) {
          updateLayer(layer.id, { x: e.target.x(), y: e.target.y() });
        }
      },
    };

    if (layer.type === 'rectangle' || layer.type === 'frame') {
      return (
        <Rect
          {...commonProps}
          width={layer.width}
          height={layer.height}
          fill={layer.fill}
          stroke={isSelected ? '#0d99ff' : layer.stroke}
          strokeWidth={isSelected ? 2 : (layer.strokeWidth || 0)}
          shadowColor={layer.shadowColor || undefined}
          shadowBlur={layer.shadowBlur || 0}
          shadowOpacity={layer.shadowOpacity || 0}
          shadowOffsetX={layer.shadowOffsetX || 0}
          shadowOffsetY={layer.shadowOffsetY || 0}
          onTransformEnd={(e) => {
            const node = e.target;
            updateLayer(layer.id, {
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * node.scaleX()),
              height: Math.max(5, node.height() * node.scaleY()),
              rotation: node.rotation(),
            });
            node.scaleX(1);
            node.scaleY(1);
          }}
        />
      );
    }

    if (layer.type === 'ellipse') {
      return (
        <Ellipse
          {...commonProps}
          radiusX={layer.width / 2}
          radiusY={layer.height / 2}
          fill={layer.fill}
          stroke={isSelected ? '#0d99ff' : layer.stroke}
          strokeWidth={isSelected ? 2 : (layer.strokeWidth || 0)}
          shadowColor={layer.shadowColor}
          shadowBlur={layer.shadowBlur}
          onTransformEnd={(e) => {
            const node = e.target;
            updateLayer(layer.id, {
              x: node.x(),
              y: node.y(),
              width: Math.max(10, node.width() * node.scaleX()),
              height: Math.max(10, node.height() * node.scaleY()),
              rotation: node.rotation(),
            });
            node.scaleX(1);
            node.scaleY(1);
          }}
        />
      );
    }

    if (layer.type === 'text') {
      return (
        <Text
          {...commonProps}
          text={layer.text || 'Text'}
          fontSize={layer.fontSize || 16}
          fontFamily={layer.fontFamily || 'Inter'}
          fill={layer.fill}
          width={layer.width}
          height={layer.height}
        />
      );
    }

    if (layer.type === 'line') {
      return (
        <Line
          {...commonProps}
          points={layer.points || [0, 0, layer.width, layer.height]}
          stroke={isSelected ? '#0d99ff' : layer.stroke}
          strokeWidth={isSelected ? 2 : (layer.strokeWidth || 2)}
          onTransformEnd={(e) => {
            const node = e.target;
            updateLayer(layer.id, {
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * node.scaleX()),
              height: Math.max(5, node.height() * node.scaleY()),
              rotation: node.rotation(),
            });
            node.scaleX(1);
            node.scaleY(1);
          }}
        />
      );
    }

    if (layer.type === 'arrow') {
      return (
        <Arrow
          {...commonProps}
          points={layer.points || [0, 0, layer.width, layer.height]}
          stroke={isSelected ? '#0d99ff' : layer.stroke}
          strokeWidth={isSelected ? 2 : (layer.strokeWidth || 2)}
          fill={layer.stroke}
          onTransformEnd={(e) => {
            const node = e.target;
            updateLayer(layer.id, {
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * node.scaleX()),
              height: Math.max(5, node.height() * node.scaleY()),
              rotation: node.rotation(),
            });
            node.scaleX(1);
            node.scaleY(1);
          }}
        />
      );
    }

    if (layer.type === 'vector' && layer.points) {
      const points = layer.points.flatMap((p: any) => [p.x, p.y]);
      return (
        <Line
          {...commonProps}
          points={points}
          stroke={isSelected ? '#0d99ff' : layer.stroke}
          strokeWidth={isSelected ? 2 : (layer.strokeWidth || 2)}
          fill={layer.fill}
          closed={layer.isClosed}
          onTransformEnd={(e) => {
            const node = e.target;
            updateLayer(layer.id, {
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * node.scaleX()),
              height: Math.max(5, node.height() * node.scaleY()),
              rotation: node.rotation(),
            });
            node.scaleX(1);
            node.scaleY(1);
          }}
        />
      );
    }

    if (layer.type === 'group' && layer.children) {
      return (
        <Group {...commonProps}>
          {layer.children.map((childId: string) => {
            const child = layers.find(l => l.id === childId);
            return child ? renderLayer(child) : null;
          })}
        </Group>
      );
    }

    return null;
  };

  const createFrameFromPreset = (preset: typeof FRAME_PRESETS[0]) => {
    const layer = {
      id: `frame-${Date.now()}`,
      type: 'frame' as const,
      x: framePresetPos.x,
      y: framePresetPos.y,
      width: preset.width,
      height: preset.height,
      fill: darkMode ? '#1f2937' : '#ffffff',
      stroke: darkMode ? '#4b5563' : '#64748b',
      strokeWidth: 1,
      rotation: 0,
      name: `Frame ${layers.length + 1}`,
      visible: true,
      locked: false,
    };
    addLayer(layer);
    selectLayers([layer.id]);
    setShowFramePresets(false);
    if (framePresetTimeout.current) clearTimeout(framePresetTimeout.current);
  };

  return (
    <div className="flex h-full">
      <div className={`w-12 border-r flex flex-col items-center py-2 space-y-1 z-10 pointer-events-auto ${
        darkMode 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        {(['select', 'frame', 'rectangle', 'ellipse', 'text', 'line', 'arrow', 'pen'] as Tool[]).map((tool) => (
          <button
            key={tool}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              currentTool === tool
                ? darkMode
                  ? 'bg-blue-900 text-blue-200'
                  : 'bg-blue-100 text-blue-600'
                : darkMode
                  ? 'hover:bg-gray-800 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={() => setCurrentTool(tool)}
            title={`${getToolName(tool)} (${getToolName(tool)[0].toLowerCase()})`}
          >
            {tool === 'select' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.5 2L5 10.5L2.5 8L1 9.5L5 13.5L15 3.5L13.5 2Z"/>
              </svg>
            )}
            {tool === 'frame' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <rect x="2.5" y="2.5" width="11" height="11" strokeWidth="1.5"/>
              </svg>
            )}
            {tool === 'rectangle' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <rect x="2" y="2" width="12" height="12" strokeWidth="1.5"/>
              </svg>
            )}
            {tool === 'ellipse' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <ellipse cx="8" cy="8" rx="6" ry="4" strokeWidth="1.5"/>
              </svg>
            )}
            {tool === 'text' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 3H13V4H9V13H8V4H3V3Z"/>
              </svg>
            )}
            {tool === 'line' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <line x1="3" y1="3" x2="13" y2="13" strokeWidth="1.5"/>
              </svg>
            )}
            {tool === 'arrow' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <line x1="2" y1="14" x2="12" y2="4" strokeWidth="1.5"/>
                <polygon points="12,2 14,4 12,6" fill="currentColor"/>
              </svg>
            )}
            {tool === 'pen' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M11.5 4.5L4.5 11.5M2 14L4.5 11.5M11.5 4.5L14 2" strokeWidth="1.5"/>
              </svg>
            )}
          </button>
        ))}

        <div className={`w-6 h-px my-1 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>

        {(['hand', 'zoom'] as Tool[]).map((tool) => (
          <button
            key={tool}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              currentTool === tool
                ? darkMode
                  ? 'bg-blue-900 text-blue-200'
                  : 'bg-blue-100 text-blue-600'
                : darkMode
                  ? 'hover:bg-gray-800 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={() => setCurrentTool(tool)}
            title={`${getToolName(tool)} (${getToolName(tool)[0].toLowerCase()})`}
          >
            {tool === 'hand' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.5 2V8M8.5 8H6.5M8.5 8H10.5M3 7.5V11.5C3 12.6046 3.89543 13.5 5 13.5H11C12.1046 13.5 13 12.6046 13 11.5V7.5C13 6.39543 12.1046 5.5 11 5.5H10.5V4.5C10.5 3.39543 9.60457 2.5 8.5 2.5C7.39543 2.5 6.5 3.39543 6.5 4.5V5.5H5C3.89543 5.5 3 6.39543 3 7.5Z"/>
              </svg>
            )}
            {tool === 'zoom' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.5 10.5L14 13M12.5 7.5C12.5 10.2614 10.2614 12.5 7.5 12.5C4.73858 12.5 2.5 10.2614 2.5 7.5C2.5 4.73858 4.73858 2.5 7.5 2.5C10.2614 2.5 12.5 4.73858 12.5 7.5Z"/>
              </svg>
            )}
          </button>
        ))}
      </div>
      <div className={`flex-1 relative overflow-hidden ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        {showRulers && (
          <>
            <div 
              className={`absolute top-0 left-12 h-4 border-b flex z-20 ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
              style={{ width: `calc(100% - 48px)` }}
            >
              {Array.from({ length: Math.ceil((window.innerWidth - 400) / 20) }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 border-r text-xs relative ${
                    darkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  style={{ width: '20px', transform: `scale(${canvas.zoom})` }}
                >
                  {i % 5 === 0 && (
                    <span 
                      className={`absolute text-xs -top-3 -left-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                      style={{ fontSize: '10px' }}
                    >
                      {i * 20}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div 
              className={`absolute left-12 top-4 w-4 border-r flex flex-col z-20 ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
              style={{ height: `calc(100% - 52px)` }}
            >
              {Array.from({ length: Math.ceil((window.innerHeight - 50) / 20) }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 border-b text-xs relative ${
                    darkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  style={{ height: '20px', transform: `scale(${canvas.zoom})` }}
                >
                  {i % 5 === 0 && (
                    <span 
                      className={`absolute text-xs -left-6 top-0 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                      style={{ fontSize: '10px' }}
                    >
                      {i * 20}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: showGrid ? `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            ` : 'none',
            backgroundSize: '20px 20px',
            transform: `scale(${canvas.zoom}) translate(${canvas.offset.x}px, ${canvas.offset.y}px)`,
            transformOrigin: '0 0',
          }}
        />

        <Stage
          width={window.innerWidth - 400}
          height={window.innerHeight - 50}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          scaleX={canvas.zoom}
          scaleY={canvas.zoom}
          x={canvas.offset.x}
          y={canvas.offset.y}
          ref={stageRef}
          draggable={currentTool === 'hand'}
          onDragEnd={(e) => {
            setOffset({ x: e.target.x(), y: e.target.y() });
          }}
          onWheel={handleWheel}
          style={{ 
            touchAction: 'none',
            marginLeft: showRulers ? '48px' : '0',
            marginTop: showRulers ? '16px' : '0'
          }}
        >
          <Layer>
            {layers
              .filter(layer => !layer.children || !layers.some(l => l.children?.includes(layer.id)))
              .map(renderLayer)}
            
            {tempLayer && renderLayer(tempLayer)}

            {isPenDrawing && penPoints.length > 0 && (
              <Group>
                {penPoints.length > 1 && (
                  <Line
                    points={penPoints.flatMap(p => [p.x, p.y])}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    lineCap="round"
                    lineJoin="round"
                  />
                )}
                {penPoints.map((point, i) => (
                  <Rect
                    key={i}
                    x={point.x - 3}
                    y={point.y - 3}
                    width={6}
                    height={6}
                    fill="#3b82f6"
                    stroke="#1d4ed8"
                  />
                ))}
              </Group>
            )}

            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              enabledAnchors={[
                'top-left', 'top-center', 'top-right',
                'middle-left', 'middle-right',
                'bottom-left', 'bottom-center', 'bottom-right'
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
            />
          </Layer>
        </Stage>

        {showFramePresets && (
          <div
            className={`absolute border rounded shadow-lg p-2 z-20 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            style={{ left: framePresetPos.x + 10, top: framePresetPos.y + 10 }}
          >
            {FRAME_PRESETS.map((preset) => (
              <div
                key={preset.label}
                className={`px-3 py-1.5 cursor-pointer text-sm transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => createFrameFromPreset(preset)}
              >
                {preset.label}
              </div>
            ))}
          </div>
        )}
        
        <div className={`absolute top-4 left-4 rounded-lg border px-3 py-1 text-sm font-medium ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          {getToolName(currentTool)} Tool
        </div>

        <div className={`absolute bottom-4 right-4 rounded-lg border flex items-center ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded-l transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => setZoom(canvas.zoom / 1.2)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 8H13" stroke="currentColor" fill="none" strokeWidth="2"/>
            </svg>
          </button>
          <div className={`px-2 py-1 text-sm min-w-[48px] text-center ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {Math.round(canvas.zoom * 100)}%
          </div>
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded-r transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => setZoom(canvas.zoom * 1.2)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 3V13M3 8H13" stroke="currentColor" fill="none" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasStage;