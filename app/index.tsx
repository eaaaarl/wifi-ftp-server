import wifiFtpServer, { PermissionLocation } from "@/modules/wifi-ftp-server";
import { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Index() {
  const insets = useSafeAreaInsets()
  const [serverRunning, setServerRunning] = useState(false);
  const [wifiEnabled] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<PermissionLocation | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);

  const ipAddress = "192.168.1.100";
  const wifiSSID = "MyHomeNetwork";
  const port = "2121";
  const username = "android";
  const password = "android";
  const rootFolder = "/storage/emulated/0";

  const checkPermissionStatus = async () => {
    try {
      const permission = await wifiFtpServer.permissionLocation()
      console.log('permission location', JSON.stringify(permission, null, 2))
      setPermissionStatus(permission);
      return permission;
    } catch (error) {
      console.error('Error checking permission:', error)
      return null;
    }
  }

  const requestPermissionLocation = async () => {
    try {
      const result = await wifiFtpServer.requestPermissionLocation()
      console.log('permission request result', JSON.stringify(result, null, 2))

      // Update canAskAgain status
      if (result.canAskAgain !== undefined) {
        setCanAskAgain(result.canAskAgain);
      }

      // Refresh permission status
      await checkPermissionStatus();

      // Show alert if permission was denied permanently
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

      // Handle manifest permission error
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

  // Check permission status when component mounts
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  // Determine which button to show
  const getPermissionButton = () => {
    // Still loading
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

    // Permission denied and can't ask again
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

    // Can request permission
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

        {/* Permission Status Card */}
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

        {/* Permission Granted Indicator */}
        {permissionStatus?.granted && (
          <View className="bg-green-50 rounded-2xl p-5 mb-4 border border-green-200">
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-green-900 font-semibold mb-1">
                  ✓ Location Permission Granted
                </Text>
                <Text className="text-green-700 text-xs">
                  Fine: {permissionStatus.fineLocation ? '✓' : '✗'} | Coarse: {permissionStatus.coarseLocation ? '✓' : '✗'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* WiFi Status Card */}
        <View className="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View>
                <Text className="text-gray-500 text-sm mb-1">WiFi Status</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {wifiEnabled ? "Connected" : "Disconnected"}
                </Text>
              </View>
            </View>
            <View className={`px-3 py-1 rounded-full ${wifiEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
              <Text className={`text-xs font-medium ${wifiEnabled ? 'text-green-700' : 'text-red-700'}`}>
                {wifiEnabled ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </View>

        {/* IP Address Card */}
        <View className="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-200">
          <View className="flex-row items-center">
            <View>
              <Text className="text-gray-500 text-sm mb-1">IP Address</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {ipAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* WiFi SSID Card */}
        <View className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-200">
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm mb-1">WiFi SSID</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {wifiSSID}
              </Text>
            </View>
          </View>
        </View>

        {/* Start/Stop Server Button */}
        <TouchableOpacity
          onPress={() => setServerRunning(!serverRunning)}
          className={`rounded-2xl p-5 mb-6 shadow-lg ${!permissionStatus?.granted
            ? 'bg-gray-400'
            : serverRunning
              ? 'bg-red-500'
              : 'bg-blue-600'
            }`}
          activeOpacity={0.8}
          disabled={!permissionStatus?.granted}
        >
          <Text className="text-white text-center text-lg font-bold">
            {!permissionStatus?.granted
              ? "Permission Required"
              : serverRunning
                ? "Stop Server"
                : "Start Server"}
          </Text>
        </TouchableOpacity>

        {/* Server Details Card - Only visible when server is running */}
        {serverRunning && (
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200" style={{ marginBottom: insets.bottom }}>
            <View className="mb-4">
              <Text className="text-xl font-bold">
                Server Running
              </Text>
            </View>

            {/* Server URL */}
            <View className="rounded-xl p-4 mb-3 ">
              <Text className=" text-sm mb-2">Server URL</Text>
              <Text className=" text-base">
                ftp://{ipAddress}:{port}
              </Text>
            </View>

            {/* Username */}
            <View className=" rounded-xl p-4 mb-3">
              <Text className="text-sm mb-2">Username</Text>
              <Text className="text-base" >
                {username}
              </Text>
            </View>

            {/* Password */}
            <View className="rounded-xl p-4 mb-3">
              <Text className="text-sm mb-2">Password</Text>
              <Text className="text-base" >
                {password}
              </Text>
            </View>

            {/* Root Folder */}
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