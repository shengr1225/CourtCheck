import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { MAIN_RADII } from "./theme";

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: MAIN_RADII.card,
        paddingVertical: 24,
        paddingHorizontal: 16,
        gap: 24,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
});

type SectionCardProps = {
    children: ReactNode;
    style?: ViewStyle;
};

/**
 * Shared white card (Figma Frame 210 / 211): 16px radius, shadow.
 * Use for promo, membership, check-in form, court info, recent activity.
 */
export function SectionCard({ children, style }: SectionCardProps) {
    return <View style={[styles.card, style]}>{children}</View>;
}
