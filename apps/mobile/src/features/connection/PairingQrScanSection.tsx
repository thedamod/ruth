import React, { useCallback, useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScanLine, X } from "lucide-react-native";
import { theme } from "../../theme";

/**
 * Scan button + QR scanner for pairing URLs — mirrors t3code
 * `ConnectionsNewRouteScreen` scan_qr mode.
 *
 * The server prints a terminal QR code encoding the pairing URL
 * (`home-server start` / `home-server pair`, incl. the final Tailscale
 * connection string when `--tailscale` is used). Scanning fills the
 * pairing-URL field via `onScanned`; the user then taps Pair & add.
 */
export function PairingQrScanSection({ onScanned }: { onScanned: (data: string) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);
  const [locked, setLocked] = useState(false);

  const openScanner = useCallback(async () => {
    if (permission?.granted) {
      setLocked(false);
      setShowScanner(true);
      return;
    }
    const res = await requestPermission();
    if (res.granted) {
      setLocked(false);
      setShowScanner(true);
      return;
    }
    if (res.canAskAgain) {
      Alert.alert(
        "Camera access needed",
        "Allow camera access to scan the pairing QR code shown in your server terminal.",
      );
      return;
    }
    Alert.alert(
      "Camera access needed",
      "Camera access was denied for this app. Open Settings to enable it.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => void Linking.openSettings() },
      ],
    );
  }, [permission?.granted, requestPermission]);

  const closeScanner = useCallback(() => {
    setShowScanner(false);
    setLocked(false);
  }, []);

  const handleScan = useCallback(
    ({ data }: { data: string }) => {
      if (locked) return;
      setLocked(true);
      const text = data.trim();
      if (!text) {
        setTimeout(() => setLocked(false), 600);
        return;
      }
      setShowScanner(false);
      onScanned(text);
    },
    [locked, onScanned],
  );

  if (showScanner) {
    return (
      <View style={styles.scannerWrap}>
        {permission?.granted ? (
          <CameraView
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleScan}
            style={styles.camera}
          />
        ) : (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionText}>Camera permission is required to scan a QR code.</Text>
            <Pressable style={styles.secondaryBtn} onPress={() => void openScanner()}>
              <Text style={styles.secondaryBtnLabel}>Allow camera</Text>
            </Pressable>
          </View>
        )}
        <Pressable style={styles.cancelBtn} onPress={closeScanner}>
          <X size={14} color={theme.colors.foreground} />
          <Text style={styles.cancelLabel}>Cancel</Text>
        </Pressable>
        <Text style={styles.scannerHint}>Point the camera at the QR code in your server terminal</Text>
      </View>
    );
  }

  return (
    <Pressable style={styles.scanBtn} onPress={() => void openScanner()}>
      <ScanLine size={16} color={theme.colors.foreground} strokeWidth={1.8} />
      <Text style={styles.scanLabel}>Scan QR code</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scanBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#141414",
    paddingVertical: 13,
  },
  scanLabel: { color: theme.colors.foreground, fontFamily: theme.font.medium, fontSize: 14 },
  scannerWrap: { gap: 10 },
  camera: { aspectRatio: 1, width: "100%", borderRadius: 24, overflow: "hidden" },
  permissionBox: {
    alignItems: "center",
    gap: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  permissionText: {
    color: theme.colors.muted,
    fontSize: 14,
    fontFamily: theme.font.regular,
    textAlign: "center",
    lineHeight: 20,
  },
  secondaryBtn: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#141414",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryBtnLabel: { color: theme.colors.foreground, fontFamily: theme.font.medium, fontSize: 14 },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#141414",
    paddingVertical: 11,
  },
  cancelLabel: { color: theme.colors.foreground, fontFamily: theme.font.medium, fontSize: 14 },
  scannerHint: {
    color: theme.colors.muted,
    fontFamily: theme.font.regular,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
  },
});
