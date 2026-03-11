import React, { useState } from "react";
import { toast } from "sonner"; // optional – remove if you don't have sonner
import { Loader2, Save } from "lucide-react";

interface SettingsData {
  // Organization
  companyName: string;
  address: string;
  taxId: string;
  currency: string;
  language: string;

  // Financial
  vatPercent: number;
  overheadPercent: number;
  defaultProfit: number;
  roundingPrecision: number;

  // Project
  measurementUnit: "Metric" | "Imperial";
  autoGenerateBoqCode: boolean;
  enableCostBreakdown: boolean;

  // Security
  twoFactorAuth: boolean;
  sessionTimeout: number;

  // Notifications
  emailNotifications: boolean;
  weeklySummary: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    companyName: "EstimaApp Ltd",
    address: "",
    taxId: "",
    currency: "USD",
    language: "English",
    vatPercent: 15,
    overheadPercent: 10,
    defaultProfit: 12,
    roundingPrecision: 2,
    measurementUnit: "Metric",
    autoGenerateBoqCode: true,
    enableCostBreakdown: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    emailNotifications: true,
    weeklySummary: false,
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("organization");

  const update = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Settings saved:", settings);
    toast.success("Settings saved successfully"); // remove if you don't have sonner
    setSaving(false);
  };

  const tabs = [
    { id: "organization", label: "Organization" },
    { id: "financial", label: "Financial" },
    { id: "project", label: "Project" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your application preferences
        </p>
      </div>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* Organization */}
        {activeTab === "organization" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Organization Details</h3>
            <p className="text-sm text-gray-500">Basic information about your company</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="companyName" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="taxId" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Tax ID / VAT Number
                </label>
                <input
                  id="taxId"
                  type="text"
                  value={settings.taxId}
                  onChange={(e) => update("taxId", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={settings.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => update("currency", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div>
                <label htmlFor="language" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Language
                </label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => update("language", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Financial */}
        {activeTab === "financial" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Financial Defaults</h3>
            <p className="text-sm text-gray-500">Default values used in calculations</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="vatPercent" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Default VAT (%)
                </label>
                <input
                  id="vatPercent"
                  type="number"
                  value={settings.vatPercent}
                  onChange={(e) => update("vatPercent", Number(e.target.value))}
                  step="0.1"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="overheadPercent" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Overhead (%)
                </label>
                <input
                  id="overheadPercent"
                  type="number"
                  value={settings.overheadPercent}
                  onChange={(e) => update("overheadPercent", Number(e.target.value))}
                  step="0.1"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="defaultProfit" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Default Profit (%)
                </label>
                <input
                  id="defaultProfit"
                  type="number"
                  value={settings.defaultProfit}
                  onChange={(e) => update("defaultProfit", Number(e.target.value))}
                  step="0.1"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="roundingPrecision" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Rounding Precision (decimals)
                </label>
                <input
                  id="roundingPrecision"
                  type="number"
                  value={settings.roundingPrecision}
                  onChange={(e) => update("roundingPrecision", Number(e.target.value))}
                  min="0"
                  max="6"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Project */}
        {activeTab === "project" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Project Defaults</h3>
            <p className="text-sm text-gray-500">Preferences for new projects</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="measurementUnit" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Measurement Unit System
                </label>
                <select
                  id="measurementUnit"
                  value={settings.measurementUnit}
                  onChange={(e) => update("measurementUnit", e.target.value as "Metric" | "Imperial")}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Metric">Metric</option>
                  <option value="Imperial">Imperial</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoGenerateBoqCode}
                  onChange={(e) => update("autoGenerateBoqCode", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-generate BOQ Codes</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableCostBreakdown}
                  onChange={(e) => update("enableCostBreakdown", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Cost Breakdown</span>
              </label>
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
            <p className="text-sm text-gray-500">Manage authentication and session preferences</p>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => update("twoFactorAuth", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Two-Factor Authentication</span>
              </label>
              <div>
                <label htmlFor="sessionTimeout" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => update("sessionTimeout", Number(e.target.value))}
                  min="1"
                  className="w-full max-w-xs border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            <p className="text-sm text-gray-500">Choose which notifications you receive</p>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => update("emailNotifications", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weeklySummary}
                  onChange={(e) => update("weeklySummary", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Weekly Summary Reports</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Settings;