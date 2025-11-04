import React, { useRef } from 'react';
import { Stage, Layer, Rect, Transformer, Text, Ellipse } from 'react-konva';
import { useFigmaStore } from '../../store/useFigmaStore';

const CanvasStage: React.FC = () => {
  const { layers, selectedLayerIds, updateLayer, selectLayer, canvas } = useFigmaStore();
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const handleShapeClick = (e: any, id: string) => {
    e.cancelBubble = true;
    selectLayer(id);
  };

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      selectLayer('');
    }
  };

  return (
    <Stage
      width={window.innerWidth - 400} // Ширина минус боковые панели
      height={window.innerHeight - 50} // Высота минус тулбар
      onMouseDown={handleStageClick}
      onTouchStart={handleStageClick}
      scaleX={canvas.zoom}
      scaleY={canvas.zoom}
      x={canvas.offset.x}
      y={canvas.offset.y}
      ref={stageRef}
      draggable
      onDragEnd={(e) => {
        useFigmaStore.getState().setOffset({
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onWheel={(e) => {
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
          x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
          y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        useFigmaStore.getState().setZoom(newScale);
        useFigmaStore.getState().setOffset({
          x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
          y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
        });
      }}
    >
      <Layer>
        {/* Рендерим все слои */}
        {layers.map((layer) => {
          const isSelected = selectedLayerIds.includes(layer.id);
          let shape = null;

          if (layer.type === 'rectangle') {
            shape = (
              <Rect
                key={layer.id}
                id={layer.id}
                x={layer.x}
                y={layer.y}
                width={layer.width}
                height={layer.height}
                fill={layer.fill}
                stroke={isSelected ? '#0d99ff' : layer.stroke}
                strokeWidth={isSelected ? 2 : layer.strokeWidth}
                rotation={layer.rotation}
                onClick={(e) => handleShapeClick(e, layer.id)}
                onTap={(e) => handleShapeClick(e, layer.id)}
                draggable
                onDragEnd={(e) => {
                  updateLayer(layer.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
                onTransformEnd={() => {
                  // Обновляем размер и поворот после трансформации
                  const node = stageRef.current?.findOne(`#${layer.id}`);
                  if (node) {
                    updateLayer(layer.id, {
                      x: node.x(),
                      y: node.y(),
                      width: node.width() * node.scaleX(),
                      height: node.height() * node.scaleY(),
                      rotation: node.rotation(),
                    });
                    node.scaleX(1);
                    node.scaleY(1);
                  }
                }}
              />
            );
          } else if (layer.type === 'ellipse') {
            shape = (
              <Ellipse
                key={layer.id}
                id={layer.id}
                x={layer.x}
                y={layer.y}
                radiusX={layer.width / 2}
                radiusY={layer.height / 2}
                fill={layer.fill}
                stroke={isSelected ? '#0d99ff' : layer.stroke}
                strokeWidth={isSelected ? 2 : layer.strokeWidth}
                rotation={layer.rotation}
                onClick={(e) => handleShapeClick(e, layer.id)}
                onTap={(e) => handleShapeClick(e, layer.id)}
                draggable
                onDragEnd={(e) => {
                  updateLayer(layer.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
              />
            );
          } else if (layer.type === 'text') {
            shape = (
              <Text
                key={layer.id}
                id={layer.id}
                x={layer.x}
                y={layer.y}
                text={layer.text}
                fontSize={layer.fontSize}
                fontFamily={layer.fontFamily}
                fill={layer.fill}
                onClick={(e) => handleShapeClick(e, layer.id)}
                onTap={(e) => handleShapeClick(e, layer.id)}
                draggable
                onDragEnd={(e) => {
                  updateLayer(layer.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
              />
            );
          }

          return shape;
        })}

        {/* Transformer для выделения и трансформации */}
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Ограничиваем масштабирование
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};

export default CanvasStage;