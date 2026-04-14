import useMediaQuery from "./useMediaQuery";

export const useIsSmall = () => useMediaQuery("(min-width: 480px)");
export const useIsMedium = () => useMediaQuery("(min-width: 767px)");
export const useIsLarge = () => useMediaQuery("(min-width: 991px)");
export const useIsXl = () => useMediaQuery("(min-width: 1200px)");
export const useIs2Xl = () => useMediaQuery("(min-width: 1440px)");
export const useIs3Xl = () => useMediaQuery("(min-width: 1600px)");
export const useIs4Xl = () => useMediaQuery("(min-width: 1800px)");
export const useIs5Xl = () => useMediaQuery("(min-width: 2000px)");
