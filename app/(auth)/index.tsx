import { AuthPrimaryButton, AUTH_COLORS, AUTH_SPACING } from "@/components/ui/auth";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOGO_ASPECT = 80 / 92;
const ILLUSTRATION_ASPECT = 370 / 600;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AUTH_COLORS.landingBackground,
        paddingTop: AUTH_SPACING.screenPaddingTop,
        paddingHorizontal: AUTH_SPACING.screenPaddingHorizontal,
        paddingBottom: AUTH_SPACING.screenPaddingBottom,
    },
    page: { flex: 1 },
    content: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 16,
    },
    buttonWrap: {
        paddingTop: 16,
        width: "100%",
    },
    topBlock: {
        alignItems: "center",
        width: "100%",
        gap: 8,
    },
    illustrationWrap: {
        backgroundColor: AUTH_COLORS.background,
        overflow: "hidden",
    },
    titleRow: { alignItems: "center", width: "100%" },
    title: {
        fontFamily: "System",
        fontWeight: "400",
        color: AUTH_COLORS.title,
        textAlign: "center",
    },
    titleUnderline: {
        height: 4,
        backgroundColor: AUTH_COLORS.titleUnderline,
        width: "100%",
        marginTop: 2,
    },
});

// Approximate heights for layout (logo + title block + gaps)
const LOGO_HEIGHT_EST = 92;
const TITLE_BLOCK_HEIGHT_EST = 70;
const GAP_8 = 8;
const GAP_24 = 24;
const BUTTON_HEIGHT_EST = 52;
const VERTICAL_PADDING = 24 + 16 + 16;

export default function LandingScreen() {
    const router = useRouter();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    const responsive = useMemo(() => {
        const horizontalPadding = 16 * 2;
        const safeWidth = Math.max(windowWidth, 320);
        const contentWidth = Math.min(safeWidth - horizontalPadding, 400);

        const logoWidth = Math.max(1, Math.round(contentWidth * 0.22));
        const logoHeight = Math.max(1, Math.round(logoWidth / LOGO_ASPECT));
        const titleFontSize = Math.max(22, Math.min(30, contentWidth * 0.075));
        const titleLineHeight = titleFontSize;
        const underlineMaxWidth = Math.max(1, Math.round(contentWidth * 0.55));

        // tabler-icon-map-pin: responsive to width and to available height (Figma 370×600)
        const availableHeightForIllustration = Math.max(
            0,
            windowHeight -
                VERTICAL_PADDING -
                LOGO_HEIGHT_EST -
                TITLE_BLOCK_HEIGHT_EST -
                GAP_8 * 2 -
                GAP_24 -
                BUTTON_HEIGHT_EST -
                16
        );
        const widthByContent = contentWidth;
        const heightByContent = widthByContent / ILLUSTRATION_ASPECT;
        let illustrationWidth: number;
        let illustrationHeight: number;
        if (
            availableHeightForIllustration > 0 &&
            heightByContent > availableHeightForIllustration
        ) {
            illustrationHeight = Math.round(availableHeightForIllustration);
            illustrationWidth = Math.round(illustrationHeight * ILLUSTRATION_ASPECT);
        } else {
            illustrationWidth = Math.round(widthByContent);
            illustrationHeight = Math.round(heightByContent);
        }
        illustrationWidth = Math.max(1, illustrationWidth);
        illustrationHeight = Math.max(1, illustrationHeight);

        return {
            logoWidth,
            logoHeight,
            titleFontSize,
            titleLineHeight,
            underlineMaxWidth,
            illustrationWidth,
            illustrationHeight,
        };
    }, [windowWidth, windowHeight]);

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
            <View style={styles.page}>
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.topBlock}>
                        <Image
                            source={require("@/assets/images/auth-logo.png")}
                            style={{
                                width: responsive.logoWidth,
                                height: responsive.logoHeight,
                            }}
                            contentFit="contain"
                        />
                        <View style={styles.titleRow}>
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        fontSize: responsive.titleFontSize,
                                        lineHeight: responsive.titleLineHeight,
                                    },
                                ]}
                            >
                                How to use{"\n"}CourtCheck?
                            </Text>
                            <View
                                style={[
                                    styles.titleUnderline,
                                    { maxWidth: responsive.underlineMaxWidth },
                                ]}
                            />
                            </View>
                        <View
                            style={[
                                styles.illustrationWrap,
                                {
                                    width: responsive.illustrationWidth,
                                    height: responsive.illustrationHeight,
                                },
                            ]}
                        >
                            <Image
                                source={require("@/assets/images/auth-hero-illustration.png")}
                                style={{
                                    width: responsive.illustrationWidth,
                                    height: responsive.illustrationHeight,
                                }}
                                contentFit="contain"
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonWrap}>
                    <AuthPrimaryButton onPress={() => router.push("/email")}>
                        Get Started
                    </AuthPrimaryButton>
                </View>
            </View>
        </SafeAreaView>
    );
}