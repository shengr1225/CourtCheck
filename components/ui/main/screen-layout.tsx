import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLORS } from "./theme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLORS.background,
    },
    content: {
        flex: 1,
    },
});

type MainScreenLayoutProps = {
    children: ReactNode;
    contentStyle?: ViewStyle;
};

/**
 * Wrapper for main app screens. Use for Figma node 1-2722 and other main screens.
 */
export function MainScreenLayout({ children, contentStyle }: MainScreenLayoutProps) {
    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
            <View style={[styles.content, contentStyle]}>{children}</View>
        </SafeAreaView>
    );
}
