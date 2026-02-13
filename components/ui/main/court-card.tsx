import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { APP_COLORS } from "./theme";
import { Card } from "./card";
import { COURT_STATUS, MAIN_RADII } from "./theme";
import type { CourtStatusKey } from "./court-list-item";

/** "816 Brookside Dr, Danville, CA, 94526, USA" → "816 Brookside Dr, Danville" */
export function formatLocationShort(addressLine: string): string {
    const parts = addressLine.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}, ${parts[1]}`;
    if (parts.length === 1) return parts[0];
    return addressLine;
}

/** Time past only, Figma style: "8 min ago", "2 hr ago". */
export function formatTimePast(iso: string): string {
    try {
        const d = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hr ago`;
        if (diffDays < 7) return `${diffDays} d ago`;
        return `${diffDays} d ago`;
    } catch {
        return "";
    }
}

/** Frame 225: court list item - border #E4E4E4, 16px radius, 16px padding, 10px gap */
const styles = StyleSheet.create({
    cardBorder: {
        borderWidth: 1,
        borderColor: "#E4E4E4",
        borderRadius: 16,
    },
    inner: {
        gap: 10,
    },
    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        flex: 1,
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#000000",
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    locationText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 19,
        letterSpacing: -0.408,
        color: "#4F5A6A",
    },
    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    pill: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    pillText: {
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 19,
        letterSpacing: -0.408,
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    timeText: {
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 19,
        letterSpacing: -0.408,
        color: "#4F5A6A",
    },
});

export type CourtCardProps = {
    name: string;
    status: CourtStatusKey;
    onPress: () => void;
    /** Full address line; shown as street + city with location icon. */
    addressLine?: string | null;
    /** ISO timestamp of last check-in; shown beside status. */
    lastUpdatedAt?: string | null;
};

/**
 * Court list item card (Figma 1-2756). Park name, location (icon + street, city), bottom left: status + last check-in time.
 */
export function CourtCard({
    name,
    status,
    onPress,
    addressLine,
    lastUpdatedAt,
}: CourtCardProps) {
    const { bg, text } = COURT_STATUS[status];
    const locationShort = addressLine ? formatLocationShort(addressLine) : null;
    const timePast = lastUpdatedAt ? formatTimePast(lastUpdatedAt) : null;

    return (
        <Card style={styles.cardBorder}>
            <Pressable
                style={({ pressed }) => [styles.inner, { opacity: pressed ? 0.95 : 1 }]}
                onPress={onPress}
            >
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {name}
                    </Text>
                    <Ionicons name="chevron-forward" size={24} color="#000000" />
                </View>
                {locationShort ? (
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={16} color="#4F5A6A" />
                        <Text style={styles.locationText} numberOfLines={1}>
                            {locationShort}
                        </Text>
                    </View>
                ) : null}
                <View style={styles.bottomRow}>
                    <View style={[styles.pill, { backgroundColor: bg }]}>
                        <Text style={[styles.pillText, { color: text }]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                    </View>
                    {timePast ? (
                        <View style={styles.timeRow}>
                            <Ionicons name="time-outline" size={16} color="#4F5A6A" />
                            <Text style={styles.timeText}>{timePast}</Text>
                        </View>
                    ) : null}
                </View>
            </Pressable>
        </Card>
    );
}

