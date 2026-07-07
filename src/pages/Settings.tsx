import { useState } from "react";
import { Bell, Shield, Palette, Database, HelpCircle, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    emailUpdates: false,
    autoSave: true,
    soundEnabled: true,
    theme: "dark",
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400">Customize your task manager experience</p>
      </div>

      {/* Notification Settings */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="bg-slate-700 px-6 py-4 border-b border-slate-600 flex items-center gap-3">
          <Bell className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white">Notifications</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Enable Notifications</p>
              <p className="text-slate-400 text-sm">Receive notifications about task updates</p>
            </div>
            <button
              onClick={() => handleToggle("notifications")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.notifications ? "bg-blue-600" : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.notifications ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Sound Effects</p>
              <p className="text-slate-400 text-sm">Play sound on task updates</p>
            </div>
            <button
              onClick={() => handleToggle("soundEnabled")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.soundEnabled ? "bg-blue-600" : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.soundEnabled ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Updates</p>
              <p className="text-slate-400 text-sm">Get weekly task summaries</p>
            </div>
            <button
              onClick={() => handleToggle("emailUpdates")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.emailUpdates ? "bg-blue-600" : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.emailUpdates ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="bg-slate-700 px-6 py-4 border-b border-slate-600 flex items-center gap-3">
          <Palette className="text-purple-400" size={24} />
          <h3 className="text-xl font-bold text-white">Display</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Dark Mode</p>
              <p className="text-slate-400 text-sm">Use dark theme for better experience</p>
            </div>
            <button
              onClick={() => handleToggle("darkMode")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.darkMode ? "bg-blue-600" : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.darkMode ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          <div>
            <p className="text-white font-medium mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-3">
              {["dark", "light", "auto"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => {
                    setSettings({ ...settings, theme });
                    setSaved(false);
                  }}
                  className={`p-3 rounded-lg text-center transition-all duration-200 ${
                    settings.theme === theme
                      ? "bg-blue-600 text-white border-blue-400 border-2"
                      : "bg-slate-700 text-slate-300 border-slate-600 border"
                  }`}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Settings */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="bg-slate-700 px-6 py-4 border-b border-slate-600 flex items-center gap-3">
          <Database className="text-green-400" size={24} />
          <h3 className="text-xl font-bold text-white">Data & Storage</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Auto-Save</p>
              <p className="text-slate-400 text-sm">Automatically save changes</p>
            </div>
            <button
              onClick={() => handleToggle("autoSave")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.autoSave ? "bg-blue-600" : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.autoSave ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <p className="text-white font-medium mb-3">Storage Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Tasks Stored</p>
                <p className="text-2xl font-bold text-blue-400">42</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-green-400">2.3 KB</p>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg transition-colors duration-200">
            Clear All Data
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="bg-slate-700 px-6 py-4 border-b border-slate-600 flex items-center gap-3">
          <Shield className="text-orange-400" size={24} />
          <h3 className="text-xl font-bold text-white">Security</h3>
        </div>
        <div className="p-6 space-y-4">
          <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors duration-200 font-medium">
            Change Password
          </button>
          <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors duration-200 font-medium">
            Two-Factor Authentication
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="bg-slate-700 px-6 py-4 border-b border-slate-600 flex items-center gap-3">
          <HelpCircle className="text-yellow-400" size={24} />
          <h3 className="text-xl font-bold text-white">Help & Support</h3>
        </div>
        <div className="p-6 space-y-3">
          <button className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200">
            📖 Documentation
          </button>
          <button className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200">
            ❓ FAQ
          </button>
          <button className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200">
            💬 Contact Support
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-lg p-6">
        <div>
          <p className="text-white font-semibold">Save Changes</p>
          <p className="text-blue-300 text-sm">Apply your settings to enhance your experience</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            saved
              ? "bg-green-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Save size={20} />
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
