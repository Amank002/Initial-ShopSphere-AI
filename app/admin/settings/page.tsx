"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  Palette,
  Save,
  Settings,
  Shield,
  Store,
  Moon,
  Sun,
  Clock,
  Mail,
  Globe,
  ShoppingBag,
  Package,
  Users,
  Lock,
} from "lucide-react";

type SettingsTab =
  | "general"
  | "store"
  | "notifications"
  | "security"
  | "appearance";

type StoreSettings = {
  storeName: string;
  storeEmail: string;
  currency: string;
  timezone: string;
};

type NotificationSettings = {
  enabled: boolean;
  orderUpdates: boolean;
  lowStock: boolean;
  customerActivity: boolean;
  marketing: boolean;
};

type SecuritySettings = {
  requireAdminAuth: boolean;
  sessionTimeout: string;
  loginAlerts: boolean;
};

type AppearanceSettings = {
  theme: "light" | "dark";
  compactMode: boolean;
};

type AllSettings = {
  store: StoreSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
};

const SETTINGS_KEY = "shopsphere-settings";

const defaultStoreSettings: StoreSettings = {
  storeName: "ShopSphere AI",
  storeEmail: "admin@shopsphere.ai",
  currency: "INR",
  timezone: "Asia/Kolkata",
};

const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  orderUpdates: true,
  lowStock: true,
  customerActivity: false,
  marketing: false,
};

const defaultSecuritySettings: SecuritySettings = {
  requireAdminAuth: true,
  sessionTimeout: "30",
  loginAlerts: true,
};

const defaultAppearanceSettings: AppearanceSettings = {
  theme: "light",
  compactMode: false,
};

const defaultSettings: AllSettings = {
  store: defaultStoreSettings,
  notifications: defaultNotificationSettings,
  security: defaultSecuritySettings,
  appearance: defaultAppearanceSettings,
};

function loadSettings(): AllSettings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);

    if (!stored) {
      return defaultSettings;
    }

    const parsed = JSON.parse(stored);

    return {
      store: {
        ...defaultStoreSettings,
        ...(parsed.store ?? {}),
      },
      notifications: {
        ...defaultNotificationSettings,
        ...(parsed.notifications ?? {}),
      },
      security: {
        ...defaultSecuritySettings,
        ...(parsed.security ?? {}),
      },
      appearance: {
        ...defaultAppearanceSettings,
        ...(parsed.appearance ?? {}),
      },
    };
  } catch {
    return defaultSettings;
  }
}

const tabs: {
  id: SettingsTab;
  label: string;
  icon: typeof Settings;
}[] = [
  { id: "general", label: "General Settings", icon: Settings },
  { id: "store", label: "Store", icon: Store },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const [storeSettings, setStoreSettings] =
    useState<StoreSettings>(defaultStoreSettings);

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(defaultNotificationSettings);

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(
    defaultSecuritySettings,
  );

  const [appearanceSettings, setAppearanceSettings] =
    useState<AppearanceSettings>(defaultAppearanceSettings);

  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const settings = loadSettings();

      setStoreSettings(settings.store);
      setNotificationSettings(settings.notifications);
      setSecuritySettings(settings.security);
      setAppearanceSettings(settings.appearance);
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function handleSave() {
    const settings: AllSettings = {
      store: storeSettings,
      notifications: notificationSettings,
      security: securitySettings,
      appearance: appearanceSettings,
    };

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

      window.dispatchEvent(new Event("settings-updated"));
      window.dispatchEvent(new Event("shopsphere-sync"));

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch {
      window.alert(
        "Unable to save settings. Please check your browser storage.",
      );
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container-app py-12">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-100" />
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="h-72 animate-pulse rounded-2xl bg-white lg:col-span-3" />
            <div className="h-96 animate-pulse rounded-2xl bg-white lg:col-span-9" />
          </div>
        </div>
      </main>
    );
  }

  const isDark = appearanceSettings.theme === "dark";

  return (
    <main
      className={`min-h-screen transition-colors ${
        isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-950"
      }`}
    >
      <div
        className={`container-app ${
          appearanceSettings.compactMode ? "py-5" : "py-10"
        }`}
      >
        <div>
          <Link
            href="/admin"
            className={`inline-flex items-center gap-2 text-sm font-bold transition ${
              isDark
                ? "text-gray-300 hover:text-violet-400"
                : "text-gray-700 hover:text-indigo-600"
            }`}
          >
            <ArrowLeft size={17} />
            Back to Admin Dashboard
          </Link>

          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
            Settings
          </h1>

          <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Manage your ShopSphere AI store preferences.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <aside
            className={`h-fit rounded-2xl border p-3 shadow-sm lg:col-span-3 ${
              isDark
                ? "border-gray-800 bg-gray-900"
                : "border-gray-200 bg-white"
            }`}
          >
            <nav
              className="flex gap-2 overflow-x-auto lg:flex-col"
              aria-label="Settings navigation"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSaved(false);
                    }}
                    aria-pressed={active}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition lg:w-full ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : isDark
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={19} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <section className="min-w-0 lg:col-span-9">
            {/* GENERAL SETTINGS */}
            {activeTab === "general" && (
              <SettingsCard
                icon={<Settings size={24} />}
                title="General Settings"
                description="Configure your basic store information."
                isDark={isDark}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Store Name"
                    value={storeSettings.storeName}
                    onChange={(value) =>
                      setStoreSettings((current) => ({
                        ...current,
                        storeName: value,
                      }))
                    }
                    isDark={isDark}
                  />

                  <InputField
                    label="Store Email"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(value) =>
                      setStoreSettings((current) => ({
                        ...current,
                        storeEmail: value,
                      }))
                    }
                    isDark={isDark}
                  />

                  <SelectField
                    label="Currency"
                    value={storeSettings.currency}
                    onChange={(value) =>
                      setStoreSettings((current) => ({
                        ...current,
                        currency: value,
                      }))
                    }
                    isDark={isDark}
                    options={[
                      { value: "INR", label: "Indian Rupee (₹)" },
                      { value: "USD", label: "US Dollar ($)" },
                      { value: "EUR", label: "Euro (€)" },
                      { value: "GBP", label: "British Pound (£)" },
                    ]}
                  />

                  <SelectField
                    label="Timezone"
                    value={storeSettings.timezone}
                    onChange={(value) =>
                      setStoreSettings((current) => ({
                        ...current,
                        timezone: value,
                      }))
                    }
                    isDark={isDark}
                    options={[
                      { value: "Asia/Kolkata", label: "India — IST" },
                      { value: "UTC", label: "UTC" },
                      {
                        value: "America/New_York",
                        label: "US Eastern Time",
                      },
                      { value: "Europe/London", label: "London" },
                    ]}
                  />
                </div>
              </SettingsCard>
            )}

            {/* STORE */}
            {activeTab === "store" && (
              <SettingsCard
                icon={<Store size={24} />}
                title="Store"
                description="Manage storefront preferences."
                isDark={isDark}
              >
                <div className="space-y-2">
                  <SettingRow
                    icon={<Globe size={19} />}
                    title="Storefront enabled"
                    description="Allow customers to browse the storefront."
                    checked={true}
                    disabled
                    isDark={isDark}
                  />

                  <SettingRow
                    icon={<SparklesIcon />}
                    title="Product recommendations"
                    description="Show personalized recommendations on the storefront."
                    checked={true}
                    disabled
                    isDark={isDark}
                  />

                  <SettingRow
                    icon={<ShoppingBag size={19} />}
                    title="Shopping assistant"
                    description="Display the ShopSphere shopping assistant."
                    checked={true}
                    disabled
                    isDark={isDark}
                  />
                </div>

                <Notice isDark={isDark} title="Frontend demo">
                  ShopSphere AI uses localStorage and mock data. These store
                  features are demonstrations and do not control a live store
                  backend.
                </Notice>
              </SettingsCard>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <SettingsCard
                icon={<Bell size={24} />}
                title="Notifications"
                description="Control which store alerts are enabled."
                isDark={isDark}
              >
                <div className="space-y-1">
                  <SettingRow
                    title="Enable notifications"
                    description="Enable or disable notification preferences."
                    checked={notificationSettings.enabled}
                    onChange={(checked) =>
                      setNotificationSettings((current) => ({
                        ...current,
                        enabled: checked,
                      }))
                    }
                    isDark={isDark}
                  />

                  <SettingRow
                    icon={<ShoppingBag size={19} />}
                    title="Order updates"
                    description="Receive alerts when an order status changes."
                    checked={notificationSettings.orderUpdates}
                    onChange={(checked) =>
                      setNotificationSettings((current) => ({
                        ...current,
                        orderUpdates: checked,
                      }))
                    }
                    disabled={!notificationSettings.enabled}
                    isDark={isDark}
                  />

                  <SettingRow
                    icon={<Package size={19} />}
                    title="Low stock alerts"
                    description="Get alerts when products are running low."
                    checked={notificationSettings.lowStock}
                    onChange={(checked) =>
                      setNotificationSettings((current) => ({
                        ...current,
                        lowStock: checked,
                      }))
                    }
                    disabled={!notificationSettings.enabled}
                    isDark={isDark}
                  />

                  <SettingRow
                    icon={<Users size={19} />}
                    title="Customer activity"
                    description="Receive updates about customer activity."
                    checked={notificationSettings.customerActivity}
                    onChange={(checked) =>
                      setNotificationSettings((current) => ({
                        ...current,
                        customerActivity: checked,
                      }))
                    }
                    disabled={!notificationSettings.enabled}
                    isDark={isDark}
                  />

                  <SettingRow
                    icon={<Mail size={19} />}
                    title="Marketing notifications"
                    description="Receive promotional notification preferences."
                    checked={notificationSettings.marketing}
                    onChange={(checked) =>
                      setNotificationSettings((current) => ({
                        ...current,
                        marketing: checked,
                      }))
                    }
                    disabled={!notificationSettings.enabled}
                    isDark={isDark}
                  />
                </div>
              </SettingsCard>
            )}

            {activeTab === "security" && (
              <SettingsCard
                icon={<Shield size={24} />}
                title="Security"
                description="Manage demo security preferences."
                isDark={isDark}
              >
                <div className="space-y-2">
                  <SettingRow
                    icon={<Lock size={19} />}
                    title="Require admin authentication"
                    description="Save your preference for requiring admin login."
                    checked={securitySettings.requireAdminAuth}
                    onChange={(checked) =>
                      setSecuritySettings((current) => ({
                        ...current,
                        requireAdminAuth: checked,
                      }))
                    }
                    isDark={isDark}
                  />

                  <SettingRow
                    icon={<Bell size={19} />}
                    title="Login alerts"
                    description="Save your preference for successful login alerts."
                    checked={securitySettings.loginAlerts}
                    onChange={(checked) =>
                      setSecuritySettings((current) => ({
                        ...current,
                        loginAlerts: checked,
                      }))
                    }
                    isDark={isDark}
                  />

                  <SelectField
                    label="Session timeout preference"
                    value={securitySettings.sessionTimeout}
                    onChange={(value) =>
                      setSecuritySettings((current) => ({
                        ...current,
                        sessionTimeout: value,
                      }))
                    }
                    isDark={isDark}
                    options={[
                      { value: "15", label: "15 minutes" },
                      { value: "30", label: "30 minutes" },
                      { value: "60", label: "1 hour" },
                      { value: "120", label: "2 hours" },
                    ]}
                  />
                </div>

                <Notice isDark={isDark} title="Demo mode">
                  Security options are stored as frontend preferences. They do
                  not change the actual admin authentication middleware or
                  enforce session expiration. Do not store real passwords or
                  payment credentials in localStorage.
                </Notice>
              </SettingsCard>
            )}

            {activeTab === "appearance" && (
              <SettingsCard
                icon={<Palette size={24} />}
                title="Appearance"
                description="Customize the appearance of this settings page."
                isDark={isDark}
              >
                <p className="text-sm font-bold">Theme</p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <ThemeCard
                    title="Light"
                    description="Clean, bright interface."
                    selected={appearanceSettings.theme === "light"}
                    dark={false}
                    onClick={() =>
                      setAppearanceSettings((current) => ({
                        ...current,
                        theme: "light",
                      }))
                    }
                  />

                  <ThemeCard
                    title="Dark"
                    description="Dark settings interface."
                    selected={appearanceSettings.theme === "dark"}
                    dark
                    onClick={() =>
                      setAppearanceSettings((current) => ({
                        ...current,
                        theme: "dark",
                      }))
                    }
                  />
                </div>

                <div className="mt-6">
                  <SettingRow
                    icon={<Clock size={19} />}
                    title="Compact mode"
                    description="Reduce vertical spacing in the settings page."
                    checked={appearanceSettings.compactMode}
                    onChange={(checked) =>
                      setAppearanceSettings((current) => ({
                        ...current,
                        compactMode: checked,
                      }))
                    }
                    isDark={isDark}
                  />
                </div>

                <Notice isDark={isDark} title="Appearance preview">
                  Theme and compact mode changes appear immediately on this
                  settings page. Save Settings to remember your preferences.
                </Notice>
              </SettingsCard>
            )}

            {/* SAVE BUTTON */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                aria-live="polite"
                className={`text-sm ${
                  saved
                    ? "font-semibold text-green-600"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                }`}
              >
                {saved
                  ? "Your settings have been saved."
                  : "Remember to save your changes."}
              </p>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                {saved ? <Check size={18} /> : <Save size={18} />}
                {saved ? "Settings Saved" : "Save Settings"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SparklesIcon() {
  return <Palette size={19} />;
}

function SettingsCard({
  icon,
  title,
  description,
  isDark,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-colors sm:p-8 ${
        isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            isDark
              ? "bg-indigo-500/15 text-indigo-300"
              : "bg-indigo-50 text-indigo-600"
          }`}
        >
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-black sm:text-2xl">{title}</h2>
          <p
            className={`mt-1 text-sm ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7">{children}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  isDark,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  isDark: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
          isDark
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-200 bg-gray-50 text-gray-900"
        }`}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  isDark,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  isDark: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
          isDark
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-200 bg-gray-50 text-gray-900"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SettingRow({
  icon,
  title,
  description,
  checked,
  onChange,
  disabled = false,
  isDark = false,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  isDark?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b py-4 last:border-b-0 ${
        isDark ? "border-gray-800" : "border-gray-100"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span
            className={`mt-1 shrink-0 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {icon}
          </span>
        )}

        <div>
          <p className="font-bold">{title}</p>
          <p
            className={`mt-1 text-sm leading-6 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled || !onChange}
        onClick={() => onChange?.(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition focus:outline-none focus:ring-4 focus:ring-indigo-200 ${
          checked ? "bg-indigo-600" : "bg-gray-300"
        } ${disabled || !onChange ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ThemeCard({
  title,
  description,
  selected,
  onClick,
  dark,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  dark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-2xl border-2 p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-indigo-100 ${
        selected
          ? "border-indigo-600"
          : "border-gray-200 hover:border-indigo-300"
      }`}
    >
      <div
        className={`flex h-24 items-center justify-center rounded-xl ${
          dark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        {dark ? <Moon size={30} /> : <Sun size={30} />}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>

        {selected && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
            <Check size={14} />
          </span>
        )}
      </div>
    </button>
  );
}

function Notice({
  title,
  children,
  isDark,
}: {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      className={`mt-6 rounded-xl border p-4 ${
        isDark
          ? "border-indigo-900 bg-indigo-950/50 text-indigo-100"
          : "border-indigo-100 bg-indigo-50 text-indigo-900"
      }`}
    >
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm leading-6 opacity-80">{children}</p>
    </div>
  );
}
