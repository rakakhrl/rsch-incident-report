import { useMediaQuery, useOs, useViewportSize, type OS } from "@mantine/hooks";

const MIN_WIDTH = {
  MOBILE: "(min-width: 320px)",
  SMALL: "(min-width: 481px)",
  MEDIUM: "(min-width: 769px)",
  LARGE: "(min-width: 1025px)",
} as const;

type MinWidth = (typeof MIN_WIDTH)[keyof typeof MIN_WIDTH];

const MAX_WIDTH = {
  MOBILE: "(max-width: 480px)",
  SMALL: "(max-width: 768px)",
  MEDIUM: "(max-width: 1025px)",
  LARGE: "(max-width: 4200px)",
} as const;

type MaxWidth = (typeof MAX_WIDTH)[keyof typeof MAX_WIDTH];

const DEVICE_ORIENTATION = {
  POTRAIT: "POTRAIT",
  LANDSCAPE: "LANDSCAPE",
} as const;

type DeviceOrientation =
  (typeof DEVICE_ORIENTATION)[keyof typeof DEVICE_ORIENTATION];

const DEVICE_TYPE = {
  MOBILE: "MOBILE",
  TABLET: "TABLET",
  LAPTOP: "LAPTOP",
  DESKTOP: "DESKTOP",
  UNRECOGNIZED: "UNRECOGNIZED",
} as const;

type DeviceType = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];

interface DeviceInformation {
  os: OS;
  size: {
    width: number;
    height: number;
  };
  mediaSize: {
    mobile: boolean;
    small: boolean;
    medium: boolean;
    large: boolean;
  };
  orientation: DeviceOrientation;
  type: DeviceType;
}

function useDeviceInfo(): DeviceInformation {
  const os = useOs();
  const { height, width } = useViewportSize();
  const mobile = useMediaQuery(`${MIN_WIDTH.MOBILE} and ${MAX_WIDTH.MOBILE}`)!;
  const small = useMediaQuery(`${MIN_WIDTH.SMALL} and ${MAX_WIDTH.SMALL}`)!;
  const medium = useMediaQuery(`${MIN_WIDTH.MEDIUM} and ${MAX_WIDTH.MEDIUM}`)!;
  const large = useMediaQuery(`${MIN_WIDTH.LARGE} and ${MAX_WIDTH.LARGE}`)!;

  const iphone = os === "ios" && mobile;
  const ipad = os === "ios" && small;
  const macbook = os === "macos" && medium;
  const imac = os === "macos" && large;
  const androidPhone = os === "android" && mobile;
  const androidTablet = os === "android" && small;
  const laptop = (os === "windows" || "linux") && medium;
  const desktop = (os === "windows" || "linux") && large;

  let type: DeviceType;

  if (iphone || androidPhone) {
    type = DEVICE_TYPE.MOBILE;
  } else if (ipad || androidTablet) {
    type = DEVICE_TYPE.TABLET;
  } else if (macbook || laptop) {
    type = DEVICE_TYPE.LAPTOP;
  } else if (imac || desktop) {
    type = DEVICE_TYPE.DESKTOP;
  } else {
    type = DEVICE_TYPE.UNRECOGNIZED;
  }

  return {
    os,
    size: {
      width,
      height,
    },
    mediaSize: {
      mobile,
      small,
      medium,
      large,
    },
    orientation: useMediaQuery("(orientation: landscape)")
      ? DEVICE_ORIENTATION.LANDSCAPE
      : DEVICE_ORIENTATION.POTRAIT,
    type,
  };
}

export {
  useDeviceInfo,
  DEVICE_ORIENTATION,
  DEVICE_TYPE,
  MAX_WIDTH,
  MIN_WIDTH,
  type MinWidth,
  type MaxWidth,
  type DeviceOrientation,
  type DeviceType,
};
