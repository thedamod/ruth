import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import {
  Bell,
  Box,
  Calendar,
  Camera,
  Clock,
  Cloud,
  Container,
  Cpu,
  Database,
  Download,
  FileText,
  Folder,
  Globe,
  HardDrive,
  Image,
  KeyRound,
  Lightbulb,
  MemoryStick,
  Music,
  Network,
  Package,
  Play,
  Plug,
  Printer,
  Radio,
  RefreshCw,
  Server,
  Settings,
  Shield,
  SquareTerminal,
  Trash2,
  Upload,
  Video,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { theme } from "../theme";
import { useBackPress } from "../lib/backPress";

/**
 * Notion-style icon picker — Lucide glyphs only, no emoji.
 * The button shows the current glyph (or a muted placeholder) and opens
 * a calm bottom-sheet grid. Values are Lucide component names
 * (`"Database"`, `"Server"`, …) so they persist as plain strings in the
 * existing `icon` field on scripts/services.
 */

const ICON_MAP: Record<string, LucideIcon> = {
  SquareTerminal,
  Server,
  Database,
  HardDrive,
  Container,
  Package,
  Box,
  Folder,
  FileText,
  Globe,
  Wifi,
  Network,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Play,
  Zap,
  Clock,
  Calendar,
  Bell,
  Settings,
  Wrench,
  Shield,
  KeyRound,
  Cpu,
  MemoryStick,
  Plug,
  Lightbulb,
  Music,
  Video,
  Image,
  Camera,
  Radio,
  Printer,
  Trash2,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP).sort();

export function resolveItemIcon(name?: string | null): LucideIcon | null {
  if (!name) return null;
  return ICON_MAP[name] ?? null;
}

export function ItemIcon({ name, size = 18, color = theme.colors.secondary }: { name?: string | null; size?: number; color?: string }) {
  const Cmp = resolveItemIcon(name);
  if (!Cmp) return null;
  return <Cmp size={size} color={color} strokeWidth={1.8} />;
}

export function IconPicker({
  label = "Icon",
  value,
  onChange,
  compact = false,
}: {
  label?: string;
  value: string | null;
  onChange: (name: string | null) => void;
  /** Compact mode: no label or remove link — sized to sit beside a text field. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  useBackPress(open, () => {
    setOpen(false);
    return true;
  });

  // Responsive grid: derive the column count from the actual viewport width
  // so cells exactly fill each row — no orphan gap on wide screens, no
  // cramping on narrow ones. The modal card has 16px padding per side.
  const { width } = useWindowDimensions();
  const gap = 8;
  const cardPadding = 32;
  const minCell = 48;
  const numCols = Math.max(4, Math.min(8, Math.floor((width - cardPadding + gap) / (minCell + gap))));
  const cellSize = (width - cardPadding - gap * (numCols - 1)) / numCols;

  const Current = resolveItemIcon(value);

  return (
    <View style={compact ? styles.compactWrap : undefined}>
      {compact ? null : <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        <Pressable
          onPress={() => setOpen(true)}
          style={[styles.button, compact && styles.buttonCompact]}
          accessibilityLabel="Choose icon"
        >
          {Current ? (
            <Current size={20} color={theme.colors.foreground} strokeWidth={1.8} />
          ) : (
            <Text style={styles.placeholder}>None</Text>
          )}
        </Pressable>
        {!compact && value ? (
          <Pressable onPress={() => onChange(null)} style={styles.clear} hitSlop={8}>
            <Text style={styles.clearLabel}>Remove</Text>
          </Pressable>
        ) : null}
      </View>
      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View style={styles.card}>
            <Text style={styles.title}>Choose an icon</Text>
            <Text style={styles.sub}>Subtle Lucide glyphs — no emoji.</Text>
            <ScrollView style={styles.gridScroll} contentContainerStyle={[styles.grid, { gap }]}>
              <Pressable
                onPress={() => {
                  onChange(null);
                  setOpen(false);
                }}
                style={[styles.cell, { width: cellSize, height: cellSize }, !value && styles.cellActive]}
                accessibilityLabel="No icon"
              >
                <Text style={styles.noneLabel}>∅</Text>
              </Pressable>
              {AVAILABLE_ICONS.map((name) => {
                const Cmp = ICON_MAP[name]!;
                const active = value === name;
                return (
                  <Pressable
                    key={name}
                    onPress={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    style={[styles.cell, { width: cellSize, height: cellSize }, active && styles.cellActive]}
                    accessibilityLabel={name}
                  >
                    <Cmp size={20} color={active ? theme.colors.foreground : theme.colors.secondary} strokeWidth={1.8} />
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable onPress={() => setOpen(false)} style={styles.done}>
              <Text style={styles.doneLabel}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: theme.colors.secondary, fontSize: 13, fontFamily: theme.font.medium, marginBottom: 6 },
  compactWrap: { justifyContent: "flex-end", paddingBottom: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  button: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.cardAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  // Compact: match the Form TextField input height so bottoms align in a row.
  buttonCompact: { width: 46, height: 46, borderRadius: 12 },
  placeholder: { color: theme.colors.tertiary, fontSize: 12, fontFamily: theme.font.medium },
  clear: { paddingHorizontal: 8, paddingVertical: 6 },
  clearLabel: { color: theme.colors.muted, fontSize: 13, fontFamily: theme.font.regular },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  card: { backgroundColor: theme.colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 28, gap: 8, maxHeight: "72%" },
  title: { color: theme.colors.foreground, fontSize: 16, fontFamily: theme.font.bold },
  sub: { color: theme.colors.muted, fontSize: 12, fontFamily: theme.font.regular },
  gridScroll: { marginTop: 8, maxHeight: 340 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingBottom: 4 },
  cell: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.cardAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  cellActive: { borderColor: theme.colors.cpu },
  noneLabel: { color: theme.colors.muted, fontSize: 18, fontFamily: theme.font.regular },
  done: { backgroundColor: theme.colors.foreground, borderRadius: 999, paddingVertical: 11, alignItems: "center", marginTop: 12 },
  doneLabel: { color: "#0b0b0c", fontFamily: theme.font.medium, fontSize: 14 },
});
