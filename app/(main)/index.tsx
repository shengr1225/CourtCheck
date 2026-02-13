import {
    APP_COLORS,
    CourtCard,
    HeaderLogo,
    HomePromoCard,
    MainHeader,
    MainScreenLayout,
    SectionCard,
    SCROLL_CONTENT,
} from "@/components/ui/main";
import { MAIN_RADII, SECTION_BACKGROUND } from "@/components/ui/main/theme";
import { useAuthContext } from "@/context/AuthContext";
import type { ApiCourt } from "@/lib/courts";
import { apiStatusToApp, listCourts } from "@/lib/courts";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
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

  const getUserCoordinates = useCallback(async () => {
    if (Platform.OS === "web") return undefined;

    useFocusEffect(
        useCallback(() => {
            loadCourts(courts.length === 0);
            getCurrentUser();
        }, [loadCourts, courts.length, getCurrentUser])
    );

    return (
        <MainScreenLayout>
            <View style={styles.screen}>
                <MainHeader
                    left={<HeaderLogo />}
                    right={
                        <Pressable
                            onPress={() => router.push("/(main)/menu")}
                            style={styles.headerRight}
                            hitSlop={8}
                        >
                            <Ionicons name="menu" size={24} color="#000000" />
                        </Pressable>
                    }
                />
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={SCROLL_CONTENT}
                    showsVerticalScrollIndicator={false}
                >
                    <HomePromoCard checkinCount={user?.checkinCount} />
                    <SectionCard>
                        <View style={styles.courtsSection}>
                            <Text style={styles.sectionTitle}>Available Courts</Text>
                            {error ? (
                                <View style={styles.error}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}
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
                                            addressLine={court.addressLine}
                                            lastUpdatedAt={court.lastUpdatedAt}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    </SectionCard>
                </ScrollView>
            </View>
        </MainScreenLayout>
    );
}
