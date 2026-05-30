export const themeConfig = {
  light: {
    primary: "#2563EB",
    secondary: "#0F172A",
    background: "#F8FAFC",
    card: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    border: "#E2E8F0",
  },

  dark: {
    primary: "#3B82F6",
    secondary: "#F8FAFC",
    background: "#0F172A",
    card: "#1E293B",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    border: "#334155",
  },
};

export type ThemeColors = typeof themeConfig.light;

export type ColorPreset =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red";

export const COLOR_PRESETS = {
  blue: {
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    primaryLight: "#DBEAFE",
    primaryMuted: "#93C5FD",
  },

  green: {
    primary: "#16A34A",
    primaryHover: "#15803D",
    primaryLight: "#DCFCE7",
    primaryMuted: "#86EFAC",
  },

  purple: {
    primary: "#9333EA",
    primaryHover: "#7E22CE",
    primaryLight: "#F3E8FF",
    primaryMuted: "#D8B4FE",
  },

  orange: {
    primary: "#EA580C",
    primaryHover: "#C2410C",
    primaryLight: "#FFEDD5",
    primaryMuted: "#FDBA74",
  },

  red: {
    primary: "#DC2626",
    primaryHover: "#B91C1C",
    primaryLight: "#FEE2E2",
    primaryMuted: "#FCA5A5",
  },
} as const;