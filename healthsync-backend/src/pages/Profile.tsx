import React, { useState, useRef } from 'react';
import { UserIcon, BellIcon, WatchIcon, SaveIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
export function Profile() {
  const [formData, setFormData] = useState({
    name: 'Sophie Carter',
    age: '28',
    gender: 'Female',
    height: '165',
    weight: '71.5',
    activityLevel: 'moderate'
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showLinkDevice, setShowLinkDevice] = useState(false);
  const [newDevice, setNewDevice] = useState('');
  const [devices, setDevices] = useState([
  {
    name: 'Apple Watch Series 8',
    status: 'Active',
    lastSync: '2 mins ago'
  }]
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };
  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a fake object URL for the preview
      setProfilePic(URL.createObjectURL(file));
      toast.success('Profile picture updated!');
    }
  };
  const handleLinkDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice) return;
    setDevices([
    ...devices,
    {
      name: newDevice,
      status: 'Active',
      lastSync: 'Just now'
    }]
    );
    setNewDevice('');
    setShowLinkDevice(false);
    toast.success(`${newDevice} linked successfully!`);
  };
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and settings
        </p>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          {profilePic ?
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100" /> :


          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              SC
            </div>
          }
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sophie Carter</h2>
            <p className="text-gray-600">sophie.carter@email.com</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePicUpload}
              className="hidden"
              accept="image/*" />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-sm text-emerald-600 font-medium hover:text-emerald-700">
              
              Change Profile Picture
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very-active">Very Active</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
            
            <SaveIcon className="w-5 h-5" />
            Save Changes
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BellIcon className="w-5 h-5" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-gray-900 font-medium">
              Medication Reminders
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500" />
            
          </label>
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-gray-900 font-medium">
              Daily Activity Goals
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500" />
            
          </label>
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-gray-900 font-medium">Health Insights</span>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500" />
            
          </label>
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-gray-900 font-medium">
              Weekly Progress Reports
            </span>
            <input
              type="checkbox"
              className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500" />
            
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <WatchIcon className="w-5 h-5" />
          Connected Devices
        </h3>
        <div className="space-y-3">
          {devices.map((device, index) =>
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <WatchIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{device.name}</p>
                  <p className="text-sm text-gray-600">
                    Connected • Last sync: {device.lastSync}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                {device.status}
              </span>
            </div>
          )}

          {showLinkDevice ?
          <form
            onSubmit={handleLinkDevice}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm text-gray-900">
                  Link New Device
                </h4>
                <button
                type="button"
                onClick={() => setShowLinkDevice(false)}
                className="text-gray-500 hover:text-gray-700">
                
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3">
                <input
                type="text"
                placeholder="Device Name (e.g. Fitbit Charge 5)"
                value={newDevice}
                onChange={(e) => setNewDevice(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus />
              
                <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600">
                
                  Connect
                </button>
              </div>
            </form> :

          <button
            onClick={() => setShowLinkDevice(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors">
            
              + Link New Device
            </button>
          }
        </div>
      </div>
    </div>);

}