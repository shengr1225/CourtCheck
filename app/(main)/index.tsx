import {
  APP_COLORS,
  CourtCard,
  HeaderLogo,
  HomePromoCard,
  MainHeader,
  MainScreenLayout,
  SCROLL_CONTENT,
  SectionCard,
} from "@/components/ui/main";
import { MAIN_SPACING } from "@/components/ui/main/theme";
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
  screen: {
    flex: 1,
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
  },
  courtsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
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
  },
  errorText: {
    fontSize: 14,
    color: "#A90000",
  },
});

export default function Main() {
  const router = useRouter();
  const { user, getCurrentUser } = useAuthContext();
  const [courts, setCourts] = useState<ApiCourt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserCoordinates = useCallback(async () => {
    if (Platform.OS === "web") return undefined;

    try {
      const currentPermission = await Location.getForegroundPermissionsAsync();
      let status = currentPermission.status;

      if (status !== "granted" && currentPermission.canAskAgain) {
        const requestedPermission =
          await Location.requestForegroundPermissionsAsync();
        status = requestedPermission.status;
      }

      if (status !== "granted") return undefined;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return {
        lat: location.coords.latitude,
        long: location.coords.longitude,
      };
    } catch {
      return undefined;
    }
  }, []);

  const loadCourts = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }

      try {
        const coordinates = await getUserCoordinates();
        const list = await listCourts(coordinates);
        setCourts(list);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load courts");
      } finally {
        setLoading(false);
      }
    },
    [getUserCoordinates]
  );

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
              accessibilityRole="button"
              accessibilityLabel="Open menu"
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
