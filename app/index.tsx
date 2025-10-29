import wifiFtpServer, { PermissionLocation, WifiInformation } from "@/modules/wifi-ftp-server";
import { useCallback, useEffect, useState } from "react";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets()
  const [serverRunning, setServerRunning] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionLocation | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [wifiInfo, setWifiInfo] = useState<WifiInformation | null>(null);

  const port = "2121";
  const username = "android";
  const password = "android";
  const rootFolder = "/storage/emulated/0";

  const loadWifiInformation = async () => {
    try {
      const info = await wifiFtpServer.getWifiInformation()
      console.log('WiFi information:', JSON.stringify(info, null, 2))
      setWifiInfo(info);
    } catch (error: any) {
      console.error('Error getting WiFi info:', error)
      if (error.code === 'ERR_PERMISSION_DENIED') {
        Alert.alert(
          'Permission Required',
          'Please grant location permission to access WiFi information'
        );
      }
    }
  }

  const checkPermissionStatus = useCallback(async () => {
    try {
      const permission = await wifiFtpServer.permissionLocation()
      console.log('permission location', JSON.stringify(permission, null, 2))
      setPermissionStatus(permission);

      if (permission.granted) {
        await loadWifiInformation();
      }

      return permission;
    } catch (error) {
      console.error('Error checking permission:', error)
      return null;
    }
  }, [])

  const requestPermissionLocation = async () => {
    try {
      const result = await wifiFtpServer.requestPermissionLocation()
      console.log('permission request result', JSON.stringify(result, null, 2))

      if (result.canAskAgain !== undefined) {
        setCanAskAgain(result.canAskAgain);
      }

      await checkPermissionStatus();

      if (!result.granted && result.canAskAgain === false) {
        Alert.alert(
          "Permission Required",
          "Location permission is required to access WiFi information. Please enable it in Settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
              }
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Error requesting permission:', error)

      if (error.code === 'ERR_PERMISSIONS_NOT_DECLARED') {
        Alert.alert(
          "Configuration Error",
          "Location permissions are not properly configured in the app. Please contact the developer.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Error",
          error.message || "Failed to request permission",
          [{ text: "OK" }]
        );
      }
    }
  }

  const openAppSettings = () => {
    Alert.alert(
      "Permission Blocked",
      "Location permission was previously denied. Please enable it manually in Settings > Apps > WiFi FTP Server > Permissions",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            Linking.openSettings();
          }
        }
      ]
    );
  }

  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  const getPermissionButton = () => {
    if (permissionStatus === null) {
      return (
        <TouchableOpacity
          onPress={requestPermissionLocation}
          className="bg-amber-500 rounded-xl p-3"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-semibold">
            Check Permission
          </Text>
        </TouchableOpacity>
      );
    }

    if (!permissionStatus.granted && !canAskAgain) {
      return (
        <TouchableOpacity
          onPress={openAppSettings}
          className="bg-red-500 rounded-xl p-3"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-semibold">
            Open Settings
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={requestPermissionLocation}
        className="bg-amber-500 rounded-xl p-3"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-semibold">
          Grant Permission
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 pt-12">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            WiFi FTP Server
          </Text>
          <Text className="text-gray-600">
            Share files over your local network
          </Text>
        </View>

        {!permissionStatus?.granted && (
          <View className="bg-amber-50 rounded-2xl p-5 mb-4 border border-amber-200">
            <Text className="text-amber-900 font-semibold mb-2">
              Location Permission Required
            </Text>
            <Text className="text-amber-700 text-sm mb-3">
              WiFi information requires location permission on Android
            </Text>
            {getPermissionButton()}
          </View>
        )}

        <View className="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-200">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">WiFi Information</Text>
            <View className={`px-3 py-1 rounded-full ${wifiInfo?.isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
              <Text className={`text-xs font-medium ${wifiInfo?.isConnected ? 'text-green-700' : 'text-red-700'}`}>
                {wifiInfo?.isConnected ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          <View className="border-b border-gray-200 mb-4" />

          <View className="mb-3">
            <Text className="text-gray-500 text-sm mb-1">Status</Text>
            <Text className="text-base font-medium text-gray-900">
              {wifiInfo?.isConnected ? "Connected" : wifiInfo?.isWifiEnabled ? "Not Connected" : "Disabled"}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-500 text-sm mb-1">Network Name (SSID)</Text>
            <Text className="text-base font-medium text-gray-900">
              {wifiInfo?.ssid || "Not connected"}
            </Text>
            {wifiInfo?.bssid && (
              <Text className="text-gray-500 text-xs mt-1">
                BSSID: {wifiInfo.bssid}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-1">IP Address</Text>
            <Text className="text-base font-medium text-gray-900">
              {wifiInfo?.ipAddress || "Not available"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setServerRunning(!serverRunning)}
          className={`rounded-2xl p-5 mb-6 shadow-lg ${!permissionStatus?.granted || !wifiInfo?.isConnected
            ? 'bg-gray-400'
            : serverRunning
              ? 'bg-red-500'
              : 'bg-blue-600'
            }`}
          activeOpacity={0.8}
          disabled={!permissionStatus?.granted || !wifiInfo?.isConnected}
        >
          <Text className="text-white text-center text-lg font-bold">
            {!permissionStatus?.granted
              ? "Permission Required"
              : !wifiInfo?.isConnected
                ? "WiFi Not Connected"
                : serverRunning
                  ? "Stop Server"
                  : "Start Server"}
          </Text>
        </TouchableOpacity>

        {serverRunning && wifiInfo?.ipAddress && (
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200" style={{ marginBottom: insets.bottom }}>
            <View className="mb-4">
              <Text className="text-xl font-bold">
                Server Running
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3">
              <Text className="text-sm mb-2">Server URL</Text>
              <Text className="text-base">
                ftp://{wifiInfo.ipAddress}:{port}
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3">
              <Text className="text-sm mb-2">Username</Text>
              <Text className="text-base">
                {username}
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3">
              <Text className="text-sm mb-2">Password</Text>
              <Text className="text-base">
                {password}
              </Text>
            </View>

            <View className="rounded-xl p-4">
              <Text className="text-sm mb-2">Root Folder</Text>
              <Text className="text-sm">
                {rootFolder}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}