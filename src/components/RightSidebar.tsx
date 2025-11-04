import { useFigmaStore } from '../store/useFigmaStore';

export default function RightSidebar() {
  const { layers, selectedLayerIds, updateLayer } = useFigmaStore();
  const selectedLayer = layers.find(layer => layer.id === selectedLayerIds[0]);

  if (!selectedLayer) {
    return (
      <div className="w-80 bg-white border-l border-figma-gray-300 p-4">
        <h2 className="font-semibold text-figma-gray-900 mb-4">Properties</h2>
        <div className="text-figma-gray-400 text-sm">Select an object to edit properties</div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-figma-gray-300 p-4">
      <h2 className="font-semibold text-figma-gray-900 mb-4">Properties</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-figma-gray-700 mb-1">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                value={selectedLayer.x}
                onChange={(e) => updateLayer(selectedLayer.id, { x: Number(e.target.value) })}
                className="w-full p-1 border border-figma-gray-300 rounded text-sm"
                placeholder="X"
              />
            </div>
            <div>
              <input
                type="number"
                value={selectedLayer.y}
                onChange={(e) => updateLayer(selectedLayer.id, { y: Number(e.target.value) })}
                className="w-full p-1 border border-figma-gray-300 rounded text-sm"
                placeholder="Y"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-figma-gray-700 mb-1">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                value={selectedLayer.width}
                onChange={(e) => updateLayer(selectedLayer.id, { width: Number(e.target.value) })}
                className="w-full p-1 border border-figma-gray-300 rounded text-sm"
                placeholder="Width"
              />
            </div>
            <div>
              <input
                type="number"
                value={selectedLayer.height}
                onChange={(e) => updateLayer(selectedLayer.id, { height: Number(e.target.value) })}
                className="w-full p-1 border border-figma-gray-300 rounded text-sm"
                placeholder="Height"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-figma-gray-700 mb-1">Fill</label>
          <input
            type="color"
            value={selectedLayer.fill}
            onChange={(e) => updateLayer(selectedLayer.id, { fill: e.target.value })}
            className="w-full h-8 border border-figma-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
}