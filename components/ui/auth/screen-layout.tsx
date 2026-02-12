import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AUTH_COLORS, AUTH_SPACING } from "./theme";
import { BackButton } from "./back-button";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AUTH_COLORS.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: AUTH_SPACING.screenPaddingHorizontal,
        paddingTop: AUTH_SPACING.screenPaddingTop,
        paddingBottom: 0,
        minHeight: 44,
    },
    content: {
        flex: 1,
        paddingHorizontal: AUTH_SPACING.screenPaddingHorizontal,
        paddingTop: AUTH_SPACING.contentGap,
        paddingBottom: AUTH_SPACING.screenPaddingBottom,
    },
});

type AuthScreenLayoutProps = {
    children: ReactNode;
    contentStyle?: ViewStyle;
};

export function AuthScreenLayout({ children, contentStyle }: AuthScreenLayoutProps) {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
            <View style={styles.header}>
                <BackButton onPress={() => router.back()} />
            </View>
            <View style={[styles.content, contentStyle]}>{children}</View>
        </SafeAreaView>
    );
}
