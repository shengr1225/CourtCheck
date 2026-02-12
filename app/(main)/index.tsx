import {
    APP_COLORS,
    CourtCard,
    HomePromoCard,
    MAIN_SPACING,
    MainScreenLayout,
} from "@/components/ui/main";
import { useAuthContext } from "@/context/AuthContext";
import type { ApiCourt } from "@/lib/courts";
import { apiStatusToApp, listCourts } from "@/lib/courts";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: MAIN_SPACING.headerPaddingHorizontal,
        paddingVertical: MAIN_SPACING.headerPaddingVertical,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E0E0E0",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: APP_COLORS.title,
    },
    devLogout: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    devLogoutText: {
        fontSize: 14,
        color: APP_COLORS.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: MAIN_SPACING.contentPaddingHorizontal,
        paddingBottom: MAIN_SPACING.contentPaddingBottom,
    },
    scrollContent: {
        paddingTop: MAIN_SPACING.sectionGap,
        paddingBottom: MAIN_SPACING.contentPaddingBottom,
        gap: MAIN_SPACING.sectionGap,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: APP_COLORS.title,
        marginBottom: 8,
    },
    list: {
        gap: MAIN_SPACING.listGap,
    },
    loading: {
        paddingVertical: 32,
        alignItems: "center",
    },
    error: {
        padding: 16,
        backgroundColor: "#FFE0E0",
        borderRadius: 8,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: "#A90000",
    },
});

export default function Main() {
    const { logout } = useAuthContext();
    const router = useRouter();
    const [courts, setCourts] = useState<ApiCourt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCourts = useCallback(async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
            setError(null);
        }
        try {
            const list = await listCourts();
            setCourts(list);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load courts");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadCourts(courts.length === 0);
        }, [loadCourts, courts.length])
    );

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/(auth)");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <MainScreenLayout>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>CourtCheck</Text>
                {__DEV__ && (
                    <Pressable
                        onPress={handleLogout}
                        style={styles.devLogout}
                        hitSlop={8}
                    >
                        <Text style={styles.devLogoutText}>Log out</Text>
                    </Pressable>
                )}
            </View>
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <HomePromoCard />

                <View>
                    <Text style={styles.sectionTitle}>Courts nearby</Text>
                    {error && (
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}
                    {loading ? (
                        <View style={styles.loading}>
                            <ActivityIndicator size="large" color={APP_COLORS.primary} />
                        </View>
                    ) : (
                        <View style={styles.list}>
                            {courts.map((court) => (
                                <CourtCard
                                    key={court.id}
                                    name={court.name}
                                    status={apiStatusToApp(court.status)}
                                    onPress={() => router.push(`/(main)/court/${court.id}`)}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </MainScreenLayout>
    );
}
