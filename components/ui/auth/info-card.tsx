import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    AUTH_COLORS,
    AUTH_RADII,
    AUTH_SPACING,
    AUTH_TYPOGRAPHY,
} from "./theme";

const styles = StyleSheet.create({
    card: {
        backgroundColor: AUTH_COLORS.infoCardBg,
        borderRadius: AUTH_RADII.infoCard,
        padding: AUTH_SPACING.infoCardPadding,
        gap: AUTH_SPACING.infoCardGap,
    },
    title: {
        fontSize: AUTH_TYPOGRAPHY.infoCardTitle.fontSize,
        fontWeight: AUTH_TYPOGRAPHY.infoCardTitle.fontWeight,
        lineHeight: AUTH_TYPOGRAPHY.infoCardTitle.lineHeight,
        letterSpacing: AUTH_TYPOGRAPHY.infoCardTitle.letterSpacing,
        color: AUTH_COLORS.infoCardText,
    },
    body: {
        fontSize: AUTH_TYPOGRAPHY.infoCardBody.fontSize,
        fontWeight: AUTH_TYPOGRAPHY.infoCardBody.fontWeight,
        lineHeight: AUTH_TYPOGRAPHY.infoCardBody.lineHeight,
        letterSpacing: AUTH_TYPOGRAPHY.infoCardBody.letterSpacing,
        color: AUTH_COLORS.infoCardText,
    },
});

type AuthInfoCardProps = {
    title: string;
    children: ReactNode;
};

export function AuthInfoCard({ title, children }: AuthInfoCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{children}</Text>
        </View>
    );
}
