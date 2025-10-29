export interface PermissionLocation {
  granted: boolean;
  fineLocation: boolean;
  coarseLocation: boolean;
}

export interface PermissionResponse {
  status: "granted" | "denied" | "undetermined";
  granted: boolean;
  canAskAgain?: boolean;
  expires?: "never" | number;
}

export interface WifiInformation {
  isConnected: boolean;
  isWifiEnabled: boolean;
  ssid: string | null;
  bssid: string | null;
  ipAddress: string | null;
  linkSpeed: number; // WiFi link speed in Mbps
  rssi: number; // Signal strength in dBm (typically -100 to 0)
  frequency: number;
}

export type WifiFtpServerModuleEvents = {};
