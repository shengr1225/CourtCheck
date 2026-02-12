import { StyleSheet, Text, View } from "react-native";
import { Card } from "./card";
import { APP_COLORS } from "./theme";

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: APP_COLORS.title,
        marginBottom: 4,
    },
    body: {
        fontSize: 14,
        color: "#686D84",
        lineHeight: 20,
    },
});

/**
 * Upper card for main home (Figma 1-2746). "Earn free access" promo block.
 */
export function HomePromoCard() {
    return (
        <Card>
            <Text style={styles.title}>Earn free access</Text>
            <Text style={styles.body}>
                20 check-ins = free one month access
            </Text>
        </Card>
    );
}
