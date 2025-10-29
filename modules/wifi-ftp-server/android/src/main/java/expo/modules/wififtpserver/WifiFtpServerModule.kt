package expo.modules.wififtpserver

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.net.wifi.WifiManager
import androidx.core.content.ContextCompat
import expo.modules.interfaces.permissions.Permissions
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WifiFtpServerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WifiFtpServer")

    AsyncFunction("permissionLocation") {
      val context = appContext.reactContext ?: throw Exception("React context is null")
      val fineLocationGranted = ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.ACCESS_FINE_LOCATION
      ) == PackageManager.PERMISSION_GRANTED
      val coarseLocationGranted = ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.ACCESS_COARSE_LOCATION
      ) == PackageManager.PERMISSION_GRANTED
      mapOf(
        "granted" to (fineLocationGranted || coarseLocationGranted),
        "fineLocation" to fineLocationGranted,
        "coarseLocation" to coarseLocationGranted
      )
    }

    AsyncFunction("requestPermissionLocation") { promise: expo.modules.kotlin.Promise ->
      val permissionManager = appContext.permissions
        ?: run {
          promise.reject("ERR_PERMISSIONS_UNAVAILABLE", "Permission manager is not available", null)
          return@AsyncFunction
        }

      Permissions.askForPermissionsWithPermissionsManager(
        permissionManager,
        promise,
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_COARSE_LOCATION
      )
    }

    AsyncFunction("getWifiInformation") {
      val context = appContext.reactContext ?: throw CodedException(
        "ERR_NO_CONTEXT",
        "React context is null",
        null
      )

      val fineLocationGranted = ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.ACCESS_FINE_LOCATION
      ) == PackageManager.PERMISSION_GRANTED

      val coarseLocationGranted = ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.ACCESS_COARSE_LOCATION
      ) == PackageManager.PERMISSION_GRANTED

      if (!fineLocationGranted && !coarseLocationGranted) {
        throw CodedException(
          "ERR_PERMISSION_DENIED",
          "Location permission is required to access WiFi information",
          null
        )
      }

      val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as? WifiManager
        ?: throw CodedException(
          "ERR_WIFI_UNAVAILABLE",
          "WiFi manager is not available",
          null
        )

      if (!wifiManager.isWifiEnabled) {
        return@AsyncFunction mapOf(
          "isConnected" to false,
          "isWifiEnabled" to false,
          "ssid" to null,
          "bssid" to null,
          "ipAddress" to null,
          "linkSpeed" to null,
          "rssi" to null,
          "frequency" to null
        )
      }

      val wifiInfo = wifiManager.connectionInfo
      val dhcpInfo = wifiManager.dhcpInfo

      // Format IP address
      val ipAddress = toIpAddress(dhcpInfo.ipAddress)

      val ssid = wifiInfo.ssid?.replace("\"", "")?.takeIf { it != "<unknown ssid>" }

      mapOf(
        "isConnected" to (ssid != null),
        "isWifiEnabled" to true,
        "ssid" to ssid,
        "bssid" to wifiInfo.bssid,
        "ipAddress" to ipAddress,
        "linkSpeed" to wifiInfo.linkSpeed,
        "rssi" to wifiInfo.rssi,
        "frequency" to wifiInfo.frequency
      )
    }
  }

  @SuppressLint("DefaultLocale")
  private fun toIpAddress(ip: Int): String? {
    if (ip == 0) return null

    return String.format(
      "%d.%d.%d.%d",
      ip and 0xff,
      ip shr 8 and 0xff,
      ip shr 16 and 0xff,
      ip shr 24 and 0xff
    )
  }
}