import { AUTH_COLORS, AUTH_SPACING } from "./theme";
import { StyleSheet } from "react-native";

/**
 * Shared layout styles for auth form screens (email, OTP, name).
 * Use with AuthScreenLayout: fill for outer container, formBlock for title+input section.
 */
export const authFormStyles = StyleSheet.create({
    fill: {
        flex: 1,
        justifyContent: "space-between",
    },
    formBlock: {
        gap: AUTH_SPACING.sectionGap,
    },
    errorText: {
        fontSize: 14,
        color: AUTH_COLORS.error,
    },
});
