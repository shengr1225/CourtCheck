import { Pressable, StyleSheet, Text, View } from "react-native";
import { APP_COLORS } from "./theme";
import { Card } from "./card";
import { COURT_STATUS, MAIN_RADII } from "./theme";
import type { CourtStatusKey } from "./court-list-item";

const styles = StyleSheet.create({
    inner: {
        gap: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: {
        flex: 1,
        gap: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: APP_COLORS.title,
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

export type CourtCardProps = {
    name: string;
    status: CourtStatusKey;
    onPress: () => void;
};

/**
 * Court as a card. Tappable; opens court detail (check-in is on the check-in page).
 */
export function CourtCard({ name, status, onPress }: CourtCardProps) {
    const { bg, text } = COURT_STATUS[status];

    return (
        <Card>
            <Pressable
                style={({ pressed }) => [styles.inner, { opacity: pressed ? 0.95 : 1 }]}
                onPress={onPress}
            >
                <View style={styles.row}>
                    <View style={styles.left}>
                        <Text style={styles.name}>{name}</Text>
                    </View>
                    <View style={[styles.pill, { backgroundColor: bg }]}>
                        <Text style={[styles.pillText, { color: text }]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Card>
    );
}

