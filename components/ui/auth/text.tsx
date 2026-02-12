import { StyleSheet, Text, TextProps } from "react-native";
import { AUTH_TYPOGRAPHY } from "./theme";

const styles = StyleSheet.create({
    title: {
        fontSize: AUTH_TYPOGRAPHY.title.fontSize,
        fontWeight: AUTH_TYPOGRAPHY.title.fontWeight,
        lineHeight: AUTH_TYPOGRAPHY.title.lineHeight,
        letterSpacing: AUTH_TYPOGRAPHY.title.letterSpacing,
        color: AUTH_TYPOGRAPHY.title.color,
        textAlign: "left",
    },
    subtitle: {
        fontSize: AUTH_TYPOGRAPHY.subtitle.fontSize,
        fontWeight: AUTH_TYPOGRAPHY.subtitle.fontWeight,
        lineHeight: AUTH_TYPOGRAPHY.subtitle.lineHeight,
        letterSpacing: AUTH_TYPOGRAPHY.subtitle.letterSpacing,
        color: AUTH_TYPOGRAPHY.subtitle.color,
        textAlign: "left",
    },
});

export function AuthTitle({ style, ...props }: TextProps) {
    return <Text style={[styles.title, style]} {...props} />;
}

export function AuthSubtitle({ style, ...props }: TextProps) {
    return <Text style={[styles.subtitle, style]} {...props} />;
}
