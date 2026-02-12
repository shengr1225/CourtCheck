import { StyleSheet, Text, View } from "react-native";
import { APP_COLORS } from "./theme";
import { COURT_STATUS, MAIN_RADII, MAIN_SPACING } from "./theme";

export type CourtStatusKey = keyof typeof COURT_STATUS;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: MAIN_SPACING.listItemPaddingVertical,
        paddingHorizontal: MAIN_SPACING.listItemPaddingHorizontal,
        backgroundColor: APP_COLORS.background,
        borderRadius: MAIN_RADII.card,
    },
    left: {
        flex: 1,
        gap: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: APP_COLORS.title,
    },
    distance: {
        fontSize: 14,
        color: "#686D84",
    },
    pill: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: MAIN_RADII.statusPill,
    },
    pillText: {
        fontSize: 14,
        fontWeight: "600",
    },
});

type CourtListItemProps = {
    name: string;
    distance: string;
    status: CourtStatusKey;
};

/**
 * Single row for "courts nearby" list (Figma 1-2755).
 */
export function CourtListItem({ name, distance, status }: CourtListItemProps) {
    const { bg, text } = COURT_STATUS[status];

    return (
        <View style={styles.row}>
            <View style={styles.left}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.distance}>{distance}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: bg }]}>
                <Text style={[styles.pillText, { color: text }]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
            </View>
        </View>
    );
}
