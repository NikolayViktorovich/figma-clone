import React, { useState } from 'react';
import { X, Play, Square, MousePointer, Zap, CornerDownRight } from 'lucide-react';
import { useFigmaStore } from '../store/useFigmaStore';

interface Interaction {
  id: string;
  trigger: string;
  action: string;
  target: string;
  animation: string;
}

interface AddInteractionProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInteraction: (interaction: Interaction) => void;
  layers: any[];
}

const AddInteraction: React.FC<AddInteractionProps> = ({ 
  isOpen, 
  onClose, 
  onAddInteraction,
  layers 
}) => {
  const [interaction, setInteraction] = useState<Partial<Interaction>>({
    trigger: 'click',
    action: 'navigate-to',
    target: '',
    animation: 'none'
  });

  const { darkMode } = useFigmaStore();

  const triggers = [
    { value: 'click', label: 'On Click', icon: MousePointer },
    { value: 'hover', label: 'On Hover', icon: Play },
    { value: 'press', label: 'On Press', icon: Square },
    { value: 'key', label: 'On Key Press', icon: Zap },
  ];

  const actions = [
    { value: 'navigate-to', label: 'Navigate To' },
    { value: 'open-overlay', label: 'Open Overlay' },
    { value: 'close-overlay', label: 'Close Overlay' },
    { value: 'back', label: 'Back' },
    { value: 'open-link', label: 'Open Link' },
    { value: 'swap-visibility', label: 'Swap Visibility' },
  ];

  const animations = [
    { value: 'none', label: 'Instant' },
    { value: 'slide-left', label: 'Slide Left' },
    { value: 'slide-right', label: 'Slide Right' },
    { value: 'slide-up', label: 'Slide Up' },
    { value: 'slide-down', label: 'Slide Down' },
    { value: 'fade', label: 'Fade' },
    { value: 'push', label: 'Push' },
  ];

  const handleAdd = () => {
    if (interaction.target && interaction.trigger && interaction.action) {
      onAddInteraction({
        id: `interaction-${Date.now()}`,
        trigger: interaction.trigger,
        action: interaction.action,
        target: interaction.target,
        animation: interaction.animation || 'none'
      } as Interaction);
      onClose();
      setInteraction({
        trigger: 'click',
        action: 'navigate-to',
        target: '',
        animation: 'none'
      });
    }
  };

  if (!isOpen) return null;

  const triggerLabel = triggers.find(t => t.value === interaction.trigger)?.label.toLowerCase() || '';
  const actionLabel = interaction.action === 'navigate-to' ? 'navigate to' : interaction.action?.replace('-', ' ') || '';
  const targetName = layers.find(l => l.id === interaction.target)?.name || 'target';
  const animationLabel = interaction.animation !== 'none' ? interaction.animation : '';

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className={`rounded-lg w-full max-w-2xl backdrop-blur-lg ${
        darkMode ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-900'
      }`}>
        <div className={`flex justify-between items-center p-6 border-b backdrop-blur-sm ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold">Add Interaction</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-800/80' : 'hover:bg-gray-100/80'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 backdrop-blur-sm">
          <div>
            <h4 className="font-medium mb-3">When</h4>
            <div className="grid grid-cols-2 gap-3">
              {triggers.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <button
                    key={trigger.value}
                    onClick={() => setInteraction({ ...interaction, trigger: trigger.value })}
                    className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors backdrop-blur-sm ${
                      interaction.trigger === trigger.value
                        ? darkMode
                          ? 'border-blue-500 bg-blue-900/80'
                          : 'border-blue-500 bg-blue-50/80'
                        : darkMode
                          ? 'border-gray-700 hover:bg-gray-800/80'
                          : 'border-gray-300 hover:bg-gray-50/80'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{trigger.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h4 className="font-medium mb-2">Do</h4>
              <select
                value={interaction.action}
                onChange={(e) => setInteraction({ ...interaction, action: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-gray-800/80 border-gray-700 text-white' 
                    : 'border-gray-300 text-gray-900'
                }`}
              >
                {actions.map((action) => (
                  <option key={action.value} value={action.value}>
                    {action.label}
                  </option>
                ))}
              </select>
            </div>

            <CornerDownRight size={20} className={`mt-6 backdrop-blur-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />

            <div className="flex-1">
              <h4 className="font-medium mb-2">Target</h4>
              <select
                value={interaction.target}
                onChange={(e) => setInteraction({ ...interaction, target: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-gray-800/80 border-gray-700 text-white' 
                    : 'border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select target...</option>
                {layers
                  .filter(layer => layer.type === 'frame')
                  .map((layer) => (
                    <option key={layer.id} value={layer.id}>
                      {layer.name || `Frame ${layer.id}`}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Animation</h4>
            <select
              value={interaction.animation}
              onChange={(e) => setInteraction({ ...interaction, animation: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
            >
              {animations.map((animation) => (
                <option key={animation.value} value={animation.value}>
                  {animation.label}
                </option>
              ))}
            </select>
          </div>
          <div className={`rounded-lg p-4 backdrop-blur-sm ${
            darkMode ? 'bg-gray-800/80' : 'bg-gray-50/80'
          }`}>
            <h4 className="font-medium mb-2">Preview</h4>
            <div className={`text-sm backdrop-blur-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              When <span className="font-medium text-blue-600">{triggerLabel}</span>, {actionLabel} {' '}
              <span className="font-medium text-green-600">{targetName}</span>
              {animationLabel && (
                <> with <span className="font-medium text-purple-600">{animationLabel}</span> animation</>
              )}
            </div>
          </div>
        </div>

        <div className={`flex justify-end space-x-3 p-6 border-t backdrop-blur-sm ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 border rounded-lg transition-colors backdrop-blur-sm ${
              darkMode
                ? 'border-gray-600 hover:bg-gray-800/80 text-gray-300'
                : 'border-gray-300 hover:bg-gray-50/80 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!interaction.target}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors backdrop-blur-sm"
          >
            Add Interaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInteraction;