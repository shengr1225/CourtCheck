import {
    MainHeader,
    MainScreenLayout,
    SectionCard,
    SCROLL_CONTENT,
} from "@/components/ui/main";
import { useAuthContext } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const MENU_BG = "#EBF3FF";

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: MENU_BG,
    },
    top: {
        ...SCROLL_CONTENT,
    },
    cardInner: {
        gap: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#000000",
    },
    cardSubtitle: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#4F5A6A",
    },
    unsubscribeButton: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#1E1E1E",
        borderRadius: 8,
    },
    unsubscribeButtonText: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#1E1E1E",
    },
    spacer: {
        flex: 1,
    },
    signOutWrap: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    signOutButton: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1E1E1E",
        borderRadius: 8,
    },
    signOutButtonText: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#FFFFFF",
    },
    headerClose: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default function MenuScreen() {
    const router = useRouter();
    const { logout } = useAuthContext();

    const handleClose = () => router.back();

    const handleUnsubscribe = () => {
        // Placeholder: could open link or modal
    };

    const handleSignOut = async () => {
        try {
            await logout();
            router.replace("/(auth)");
        } catch (err) {
            console.error("Sign out failed:", err);
        }
    };

    return (
        <MainScreenLayout>
            <View style={styles.screen}>
                <View style={styles.top}>
                    <MainHeader
                        left={<View style={{ width: 44 }} />}
                        right={
                            <Pressable style={styles.headerClose} onPress={handleClose}>
                                <Ionicons name="close" size={24} color="#000000" />
                            </Pressable>
                        }
                    />
                    <SectionCard>
                        <View style={styles.cardInner}>
                            <Text style={styles.cardTitle}>Membership</Text>
                            <Text style={styles.cardSubtitle}>
                                Next Renewal: 2/23/2026
                            </Text>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.unsubscribeButton,
                                    { opacity: pressed ? 0.8 : 1 },
                                ]}
                                onPress={handleUnsubscribe}
                            >
                                <Text style={styles.unsubscribeButtonText}>
                                    Unsubscribe
                                </Text>
                            </Pressable>
                        </View>
                    </SectionCard>
                </View>

                <View style={styles.spacer} />

                <View style={styles.signOutWrap}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.signOutButton,
                            { opacity: pressed ? 0.9 : 1 },
                        ]}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutButtonText}>Sign Out</Text>
                    </Pressable>
                </View>
            </View>
        </MainScreenLayout>
    );
}
