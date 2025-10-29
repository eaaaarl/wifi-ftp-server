export interface PermissionLocation {
  granted:boolean;
  fineLocation:boolean;
  coarseLocation:boolean;
}

export interface PermissionResponse {
  status: "granted" | "denied" | "undetermined";
  granted: boolean;
  canAskAgain?: boolean;
  expires?: "never" | number;
}

export type WifiFtpServerModuleEvents = {};
