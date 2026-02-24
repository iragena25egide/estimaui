import React, { useState } from "react";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: "EstimaApp Ltd",
    currency: "USD",
    taxPercent: 15,
    defaultProfit: 10,
    darkMode: false,
    emailNotifications: true
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4 max-w-xl">

        <input className="border p-2 w-full rounded"
          value={settings.companyName}
          onChange={e => setSettings({ ...settings, companyName: e.target.value })}
          placeholder="Company Name"
        />

        <select className="border p-2 w-full rounded"
          value={settings.currency}
          onChange={e => setSettings({ ...settings, currency: e.target.value })}
        >
          <option>USD</option>
          <option>EUR</option>
          <option>GBP</option>
        </select>

        <input type="number" className="border p-2 w-full rounded"
          value={settings.taxPercent}
          onChange={e => setSettings({ ...settings, taxPercent: Number(e.target.value) })}
          placeholder="Default Tax %"
        />

        <input type="number" className="border p-2 w-full rounded"
          value={settings.defaultProfit}
          onChange={e => setSettings({ ...settings, defaultProfit: Number(e.target.value) })}
          placeholder="Default Profit %"
        />

        <label className="flex items-center gap-2">
          <input type="checkbox"
            checked={settings.darkMode}
            onChange={e => setSettings({ ...settings, darkMode: e.target.checked })}
          />
          Dark Mode
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox"
            checked={settings.emailNotifications}
            onChange={e => setSettings({ ...settings, emailNotifications: e.target.checked })}
          />
          Email Notifications
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          Save Settings
        </button>

      </div>
    </div>
  );
};

export default Settings;