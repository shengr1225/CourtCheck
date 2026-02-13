import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

const HEADER_LOGO_HEIGHT = 32;

const styles = StyleSheet.create({
    wrap: {
        height: HEADER_LOGO_HEIGHT,
        width: Math.round(HEADER_LOGO_HEIGHT * (80 / 97)),
        justifyContent: "center",
        alignItems: "flex-start",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});

/**
 * CourtCheck logo for header (top-left). Same branding as auth landing.
 * Figma node 131-536. Export auth-logo.png from Figma/SVG if the app expects PNG.
 */
export function HeaderLogo() {
    return (
        <View style={styles.wrap}>
            <Image
                source={require("@/assets/images/auth-logo.png")}
                style={styles.image}
                contentFit="contain"
            />
        </View>
    );
}
