import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { APP_COLORS, MAIN_RADII, MAIN_SPACING } from "./theme";

const styles = StyleSheet.create({
    card: {
        backgroundColor: APP_COLORS.background,
        borderRadius: MAIN_RADII.card,
        padding: MAIN_SPACING.cardPadding,
    },
});

type CardProps = {
    children: ReactNode;
    style?: ViewStyle;
};

/**
 * Container card for main app (Figma 1-2745). Use for hero/feature blocks.
 */
export function Card({ children, style }: CardProps) {
    return <View style={[styles.card, style]}>{children}</View>;
}
