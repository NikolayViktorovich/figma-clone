import React, { useState } from 'react';
import { X, Camera, Mail, Calendar, MapPin, Edit2 } from 'lucide-react';
import { useFigmaStore } from '../store/useFigmaStore';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { userProfile, updateUserProfile, darkMode } = useFigmaStore();

  if (!isOpen) return null;

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className={`rounded-lg w-full max-w-2xl backdrop-blur-lg ${
        darkMode ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-900'
      }`}>
        <div className={`flex justify-between items-center p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold">Profile</h2>
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
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                NV
              </div>
              <button className={`absolute bottom-0 right-0 p-1.5 rounded-full shadow-sm transition-colors backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-600 hover:bg-gray-700/80' 
                  : 'bg-white/80 border-gray-300 hover:bg-gray-50/80'
              } border`}>
                <Camera size={14} />
              </button>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => updateUserProfile({ name: e.target.value })}
                  className={`text-2xl font-semibold border-b focus:outline-none w-full backdrop-blur-sm ${
                    darkMode 
                      ? 'bg-transparent border-gray-600 focus:border-blue-500 text-white' 
                      : 'border-gray-300 focus:border-blue-500 text-gray-900'
                  }`}
                />
              ) : (
                <h3 className="text-2xl font-semibold">{userProfile.name}</h3>
              )}
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{userProfile.role}</p>
            </div>

            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors backdrop-blur-sm ${
                darkMode
                  ? 'border-gray-600 hover:bg-gray-800/80 text-gray-300'
                  : 'border-gray-300 hover:bg-gray-50/80 text-gray-700'
              }`}
            >
              <Edit2 size={16} />
              <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
            </button>
          </div>
          <div>
            <h4 className="font-medium mb-2">About</h4>
            {isEditing ? (
              <textarea
                value={userProfile.bio}
                onChange={(e) => updateUserProfile({ bio: e.target.value })}
                rows={3}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none resize-none backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-gray-800/80 border-gray-700 text-white focus:border-blue-500' 
                    : 'border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            ) : (
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{userProfile.bio}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail size={16} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => updateUserProfile({ email: e.target.value })}
                    className={`border-b focus:outline-none w-full backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-transparent border-gray-600 focus:border-blue-500 text-white' 
                        : 'border-gray-300 focus:border-blue-500 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className="font-medium">{userProfile.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin size={16} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={userProfile.location}
                    onChange={(e) => updateUserProfile({ location: e.target.value })}
                    className={`border-b focus:outline-none w-full backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-transparent border-gray-600 focus:border-blue-500 text-white' 
                        : 'border-gray-300 focus:border-blue-500 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className="font-medium">{userProfile.location}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar size={16} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Member since</p>
                <p className="font-medium">{userProfile.joinDate}</p>
              </div>
            </div>
          </div>
          <div className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className="font-medium mb-4">Workspace Stats</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className={`p-4 rounded-lg backdrop-blur-sm ${
                darkMode ? 'bg-gray-800/80' : 'bg-gray-50/80'
              }`}>
                <p className="text-2xl font-semibold text-blue-600">24</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Projects</p>
              </div>
              <div className={`p-4 rounded-lg backdrop-blur-sm ${
                darkMode ? 'bg-gray-800/80' : 'bg-gray-50/80'
              }`}>
                <p className="text-2xl font-semibold text-green-600">156</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Components</p>
              </div>
              <div className={`p-4 rounded-lg backdrop-blur-sm ${
                darkMode ? 'bg-gray-800/80' : 'bg-gray-50/80'
              }`}>
                <p className="text-2xl font-semibold text-purple-600">89</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prototypes</p>
              </div>
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
            Close
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors backdrop-blur-sm"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;