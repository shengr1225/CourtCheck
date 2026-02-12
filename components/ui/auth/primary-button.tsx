import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import {
    AUTH_COLORS,
    AUTH_RADII,
    AUTH_SPACING,
    AUTH_TYPOGRAPHY,
} from "./theme";

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
        backgroundColor: AUTH_COLORS.primary,
        borderRadius: AUTH_RADII.button,
        paddingVertical: 16,
        paddingHorizontal: AUTH_SPACING.buttonPaddingHorizontal,
    },
    buttonDisabled: {
        backgroundColor: AUTH_COLORS.primaryDisabled,
        opacity: 0.9,
    },
    text: {
        fontSize: AUTH_TYPOGRAPHY.button.fontSize,
        fontWeight: AUTH_TYPOGRAPHY.button.fontWeight,
        lineHeight: AUTH_TYPOGRAPHY.button.lineHeight,
        letterSpacing: AUTH_TYPOGRAPHY.button.letterSpacing,
        color: AUTH_COLORS.primaryText,
        textAlign: "center",
    },
});

type AuthPrimaryButtonProps = {
    children: ReactNode;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
};

export function AuthPrimaryButton({
    children,
    onPress,
    disabled,
    loading,
}: AuthPrimaryButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                (disabled || pressed) && styles.buttonDisabled,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={AUTH_COLORS.primaryText} />
            ) : (
                <Text style={styles.text}>{children}</Text>
            )}
        </Pressable>
    );
}
