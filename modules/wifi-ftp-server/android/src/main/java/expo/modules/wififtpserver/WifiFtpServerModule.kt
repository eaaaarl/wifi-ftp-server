package expo.modules.wififtpserver

import android.Manifest
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import expo.modules.interfaces.permissions.Permissions
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
  }
}