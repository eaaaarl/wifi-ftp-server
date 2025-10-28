import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets()
  const [serverRunning, setServerRunning] = useState(false);
  const [wifiEnabled] = useState(true);

  const ipAddress = "192.168.1.100";
  const wifiSSID = "MyHomeNetwork";
  const port = "2121";
  const username = "android";
  const password = "android";
  const rootFolder = "/storage/emulated/0";

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
          className={`rounded-2xl p-5 mb-6 shadow-lg ${serverRunning ? 'bg-red-500' : 'bg-blue-600'
            }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-lg font-bold">
            {serverRunning ? "Stop Server" : "Start Server"}
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