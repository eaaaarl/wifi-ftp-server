import { NativeModule, requireNativeModule } from "expo";

import {
  PermissionLocation,
  WifiFtpServerModuleEvents,
} from "./WifiFtpServer.types";

declare class WifiFtpServerModule extends NativeModule<WifiFtpServerModuleEvents> {
  permissionLocation(): Promise<PermissionLocation>;
  requestPermissionLocation(): Promise<any>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<WifiFtpServerModule>("WifiFtpServer");
