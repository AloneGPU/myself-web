export function useEasterEggs(_opts?: any) {
  return {
    sparkleMode: false,
    heartRainMode: false,
    snowMode: false,
    heartRain: false,
    toasts: [] as any[],
    easterToasts: [] as any[],
    pushToast: (_title?: string, _msg?: string, _icon?: string) => {},
    dismissToast: (_id?: string) => {},
    konamiProgress: 0,
    commandOpen: false,
    setCommandOpen: (_v: boolean) => {},
    handleLogoClick: () => {},
    handleFooterClick: () => {},
  };
}
