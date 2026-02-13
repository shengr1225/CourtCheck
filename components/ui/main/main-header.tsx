import { ReactNode } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { MAIN_SPACING } from "./theme";

const HEADER_HEIGHT = 44;

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: MAIN_SPACING.headerPaddingHorizontal,
        gap: 16,
    },
    left: {
        minWidth: 44,
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: -0.408,
        color: "#000000",
    },
    right: {
        minWidth: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
});

export type MainHeaderProps = {
    /** Left slot: logo, back button, or spacer */
    left: ReactNode;
    /** Optional title (centered / flexible); omit for logo-only home header */
    title?: string;
    /** Right slot: menu, close, or spacer */
    right: ReactNode;
    style?: ViewStyle;
};

/**
 * Shared main app header (Figma Frame 231): 44px height, space-between.
 * Use for home (logo left, menu right), menu (spacer left, close right),
 * court detail (back left, title), check-in (back left, close right).
 */
export function MainHeader({ left, title, right, style }: MainHeaderProps) {
    return (
        <View style={[styles.header, style]}>
            <View style={styles.left}>{left}</View>
            {title !== undefined ? (
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
            ) : (
                <View style={{ flex: 1 }} />
            )}
            <View style={styles.right}>{right}</View>
        </View>
    );
}
