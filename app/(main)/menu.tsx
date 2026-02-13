import { APP_COLORS, MainScreenLayout } from "@/components/ui/main";
import { useAuthContext } from "@/context/AuthContext";
import {
  ApiSubscription,
  getCurrentUserSubscription,
  subscribeCurrentUser,
  unsubscribeCurrentUser,
} from "@/lib/stripe";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF3FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  membershipCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  membershipBody: {
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  membershipTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  membershipDetail: {
    fontSize: 18,
    fontWeight: "400",
    color: "#4F5A6A",
    textAlign: "center",
  },
  membershipSubDetail: {
    fontSize: 15,
    color: "#4F5A6A",
    textAlign: "center",
  },
  outlinedButton: {
    width: "100%",
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  outlinedButtonText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#1E1E1E",
  },
  signOutButton: {
    width: "100%",
    height: 56,
    borderRadius: 8,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: "auto",
    marginBottom: 24,
  },
  signOutText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  loadingWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#A90000",
    textAlign: "center",
  },
});

function formatDateFromUnix(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US");
}

export default function MenuScreen() {
  const router = useRouter();
  const { logout, getCurrentUser } = useAuthContext();

  const [subscription, setSubscription] = useState<ApiSubscription | null>(
    null
  );
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionActionLoading, setSubscriptionActionLoading] =
    useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSubscription() {
      setLoading(true);
      setError(null);
      try {
        const currentUser = await getCurrentUser();
        const currentStripeCustomerId = currentUser?.stripeCustomerId ?? null;

        if (!mounted) return;

        setStripeCustomerId(currentStripeCustomerId);

        if (!currentStripeCustomerId) {
          setSubscription(null);
          setError("No membership found for this account.");
          return;
        }

        const data = await getCurrentUserSubscription(currentStripeCustomerId);
        if (mounted) {
          setSubscription(data);
        }
      } catch (e) {
        if (mounted) {
          setError(
            e instanceof Error
              ? e.message
              : "Failed to load membership details."
          );
          setSubscription(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSubscription();

    return () => {
      mounted = false;
    };
  }, [getCurrentUser]);

  const renewalText = useMemo(() => {
    if (!subscription) return "No active subscription";
    const periodEnd = formatDateFromUnix(subscription.currentPeriodEnd);
    return subscription.cancelAtPeriodEnd
      ? `Ends on ${periodEnd}`
      : `Renews on ${periodEnd}`;
  }, [subscription]);

  const statusText = useMemo(() => {
    if (!subscription) return "";
    return subscription.status;
  }, [subscription]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)");
    } catch (err) {
      Alert.alert(
        "Sign out failed",
        err instanceof Error ? err.message : "Please try again."
      );
    }
  };

  const actionLabel = subscription?.cancelAtPeriodEnd
    ? "Subscribe"
    : "Unsubscribe";

  const handleSubscriptionAction = async () => {
    if (!stripeCustomerId || subscriptionActionLoading || loading) {
      return;
    }

    try {
      setSubscriptionActionLoading(true);
      setError(null);

      const updatedSubscription = subscription?.cancelAtPeriodEnd
        ? await subscribeCurrentUser(stripeCustomerId)
        : await unsubscribeCurrentUser(stripeCustomerId);

      setSubscription(updatedSubscription);

      Alert.alert(
        "Subscription updated",
        updatedSubscription.cancelAtPeriodEnd
          ? "Your subscription is set to cancel at period end."
          : "Your subscription will continue and auto-renew."
      );
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : `Failed to ${actionLabel.toLowerCase()}. Please try again.`;
      setError(message);
      Alert.alert(`${actionLabel} failed`, message);
    } finally {
      setSubscriptionActionLoading(false);
    }
  };

  return (
    <MainScreenLayout contentStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Pressable
          onPress={() => router.back()}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        >
          <MaterialCommunityIcons name="close" size={32} color="#000000" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.membershipCard}>
          <View style={styles.membershipBody}>
            <Text style={styles.membershipTitle}>Membership</Text>
            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color={APP_COLORS.primary} />
              </View>
            ) : (
              <>
                <Text style={styles.membershipDetail}>{renewalText}</Text>
                {!!statusText && (
                  <Text style={styles.membershipSubDetail}>
                    {`Status: ${statusText}`}
                  </Text>
                )}
                {!!error && <Text style={styles.errorText}>{error}</Text>}
              </>
            )}
          </View>

          <Pressable
            onPress={handleSubscriptionAction}
            style={styles.outlinedButton}
            disabled={!stripeCustomerId || subscriptionActionLoading || loading}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
          >
            <Text style={styles.outlinedButtonText}>
              {subscriptionActionLoading ? `${actionLabel}...` : actionLabel}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogout}
          style={styles.signOutButton}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </MainScreenLayout>
  );
}
