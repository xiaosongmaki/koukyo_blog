interface Window {
  theme?: {
    themeValue: string;
    setPreference: () => void;
    reflectPreference: () => void;
    getTheme: () => string;
    setTheme: (val: string) => void;
  };
  umami?: {
    track: (event: string, data?: Record<string, unknown>) => void;
    identify: (id: string, data?: Record<string, unknown>) => void;
  };
}
