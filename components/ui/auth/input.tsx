import {
    AUTH_COLORS,
    AUTH_RADII,
    AUTH_SPACING,
    AUTH_TYPOGRAPHY,
} from "./theme";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

const styles = StyleSheet.create({
    input: {
        backgroundColor: AUTH_COLORS.inputBg,
        borderRadius: AUTH_RADII.input,
        paddingVertical: AUTH_SPACING.inputPaddingVertical,
        paddingHorizontal: AUTH_SPACING.inputPaddingHorizontal,
        fontSize: AUTH_TYPOGRAPHY.input.fontSize,
        fontWeight: AUTH_TYPOGRAPHY.input.fontWeight,
        lineHeight: AUTH_TYPOGRAPHY.input.lineHeight,
        color: AUTH_COLORS.title,
    },
    inputError: {
        backgroundColor: "#FFEBEE",
    },
});

type AuthInputProps = TextInputProps & {
    error?: boolean;
};

export function AuthInput({ error, style, ...props }: AuthInputProps) {
    return (
        <TextInput
            placeholderTextColor={AUTH_COLORS.placeholder}
            style={[styles.input, error && styles.inputError, style]}
            {...props}
        />
    );
}
