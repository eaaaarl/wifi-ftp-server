import { NativeModule, requireNativeModule } from "expo";

import {
  PermissionLocation,
  PermissionResponse,
  WifiFtpServerModuleEvents,
  WifiInformation,
} from "./WifiFtpServer.types";

declare class WifiFtpServerModule extends NativeModule<WifiFtpServerModuleEvents> {
  permissionLocation(): Promise<PermissionLocation>;
  requestPermissionLocation(): Promise<PermissionResponse>;
  getWifiInformation(): Promise<WifiInformation>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<WifiFtpServerModule>("WifiFtpServer");
