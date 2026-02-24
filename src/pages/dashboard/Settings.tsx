import React, { useState } from "react";

const Settings: React.FC = () => {

  const [activeTab, setActiveTab] = useState("organization");

  const [settings, setSettings] = useState({
    // Organization
    companyName: "EstimaApp Ltd",
    address: "",
    taxId: "",
    currency: "USD",
    language: "English",

    // Financial
    vatPercent: 15,
    overheadPercent: 10,
    defaultProfit: 12,
    roundingPrecision: 2,

    // Project
    measurementUnit: "Metric",
    autoGenerateBoqCode: true,
    enableCostBreakdown: true,

    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,

    // Notifications
    emailNotifications: true,
    weeklySummary: false
  });

  const update = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">Settings</h2>

      {/* Tabs */}
      <div className="flex gap-6 border-b text-sm">
        {["organization", "financial", "project", "security", "notifications"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 max-w-3xl space-y-6">

        {/* ORGANIZATION */}
        {activeTab === "organization" && (
          <>
            <div>
              <label className="text-sm text-slate-500">Company Name</label>
              <input
                className="border p-2 w-full rounded mt-1"
                value={settings.companyName}
                onChange={e => update("companyName", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-500">Address</label>
              <input
                className="border p-2 w-full rounded mt-1"
                value={settings.address}
                onChange={e => update("address", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-500">Tax ID</label>
              <input
                className="border p-2 w-full rounded mt-1"
                value={settings.taxId}
                onChange={e => update("taxId", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                className="border p-2 rounded"
                value={settings.currency}
                onChange={e => update("currency", e.target.value)}
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>

              <select
                className="border p-2 rounded"
                value={settings.language}
                onChange={e => update("language", e.target.value)}
              >
                <option>English</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </>
        )}

        {/* FINANCIAL */}
        {activeTab === "financial" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Default VAT %</label>
                <input type="number"
                  className="border p-2 w-full rounded mt-1"
                  value={settings.vatPercent}
                  onChange={e => update("vatPercent", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-sm text-slate-500">Overhead %</label>
                <input type="number"
                  className="border p-2 w-full rounded mt-1"
                  value={settings.overheadPercent}
                  onChange={e => update("overheadPercent", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-sm text-slate-500">Default Profit %</label>
                <input type="number"
                  className="border p-2 w-full rounded mt-1"
                  value={settings.defaultProfit}
                  onChange={e => update("defaultProfit", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-sm text-slate-500">Rounding Precision</label>
                <input type="number"
                  className="border p-2 w-full rounded mt-1"
                  value={settings.roundingPrecision}
                  onChange={e => update("roundingPrecision", Number(e.target.value))}
                />
              </div>
            </div>
          </>
        )}

        {/* PROJECT */}
        {activeTab === "project" && (
          <>
            <select
              className="border p-2 rounded w-full"
              value={settings.measurementUnit}
              onChange={e => update("measurementUnit", e.target.value)}
            >
              <option>Metric</option>
              <option>Imperial</option>
            </select>

            <label className="flex items-center gap-2">
              <input type="checkbox"
                checked={settings.autoGenerateBoqCode}
                onChange={e => update("autoGenerateBoqCode", e.target.checked)}
              />
              Auto-generate BOQ Codes
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox"
                checked={settings.enableCostBreakdown}
                onChange={e => update("enableCostBreakdown", e.target.checked)}
              />
              Enable Cost Breakdown
            </label>
          </>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <>
            <label className="flex items-center gap-2">
              <input type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={e => update("twoFactorAuth", e.target.checked)}
              />
              Enable Two-Factor Authentication
            </label>

            <div>
              <label className="text-sm text-slate-500">Session Timeout (minutes)</label>
              <input type="number"
                className="border p-2 w-full rounded mt-1"
                value={settings.sessionTimeout}
                onChange={e => update("sessionTimeout", Number(e.target.value))}
              />
            </div>
          </>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <>
            <label className="flex items-center gap-2">
              <input type="checkbox"
                checked={settings.emailNotifications}
                onChange={e => update("emailNotifications", e.target.checked)}
              />
              Email Notifications
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox"
                checked={settings.weeklySummary}
                onChange={e => update("weeklySummary", e.target.checked)}
              />
              Weekly Summary Reports
            </label>
          </>
        )}

        <div className="flex justify-end pt-4 border-t">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;