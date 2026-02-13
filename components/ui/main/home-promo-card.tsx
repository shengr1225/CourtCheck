import { StyleSheet, Text, View } from "react-native";
import { SectionCard } from "./section-card";

const styles = StyleSheet.create({
    inner: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#000000",
        textAlign: "center",
    },
    bigNumber: {
        fontSize: 80,
        fontWeight: "700",
        lineHeight: 95,
        letterSpacing: -0.408,
        color: "#4941F6",
        textAlign: "center",
    },
    body: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#000000",
        textAlign: "center",
    },
    expiration: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#4F5A6A",
        textAlign: "center",
    },
});

const QUALIFY_COUNT = 20;

type HomePromoCardProps = {
    /** Current check-in count from API (user.checkinCount). Counts toward free month. */
    checkinCount?: number | null;
};

/**
 * Frame 210: promo card (Figma). Earn Free Access, count, copy, expiration.
 * Uses backend checkinCount (GET /api/auth/me) for "20 check-ins = free one month".
 */
export function HomePromoCard({ checkinCount }: HomePromoCardProps) {
    const count = checkinCount ?? 0;
    return (
        <SectionCard>
            <View style={styles.inner}>
                <Text style={styles.title}>Earn Free Access</Text>
                <Text style={styles.bigNumber}>{count}</Text>
                <Text style={styles.body}>
                    {QUALIFY_COUNT} check-ins = free one month access
                </Text>
                <Text style={styles.expiration}>expiration: 1/23/2026</Text>
            </View>
        </SectionCard>
    );
}
