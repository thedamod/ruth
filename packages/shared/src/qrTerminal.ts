/**
 * Terminal QR rendering — mirrors t3code `startupAccess.renderTerminalQrCode`.
 *
 * Renders a QR code with half-block characters (two rows per terminal line)
 * so the server can print a scannable pairing URL on boot / `home-server pair`.
 * The QR encodes the pairing URL, which already contains the final connection
 * string (LAN, tailnet IP, or MagicDNS via `tailscale serve`).
 */
import { QrCode } from "./qrCode.ts";

export function renderTerminalQrCode(value: string, margin = 2): string {
  const qrCode = QrCode.encodeText(value, QrCode.Ecc.MEDIUM);
  const rows: Array<string> = [];
  const isDark = (x: number, y: number): boolean =>
    x >= 0 && x < qrCode.size && y >= 0 && y < qrCode.size && qrCode.getModule(x, y);

  for (let y = -margin; y < qrCode.size + margin; y += 2) {
    let row = "";
    for (let x = -margin; x < qrCode.size + margin; x += 1) {
      const topDark = isDark(x, y);
      const bottomDark = isDark(x, y + 1);
      row += topDark ? (bottomDark ? "█" : "▀") : bottomDark ? "▄" : " ";
    }
    rows.push(row);
  }
  return rows.join("\n");
}
