import {
  AuthInfoCard,
  AuthPrimaryButton,
  AuthScreenLayout,
  AuthSubtitle,
  AuthTitle,
  authFormStyles,
} from "@/components/ui/auth";
import { apiFetch } from "@/lib/api";
import { initStripe, useStripe } from "@stripe/stripe-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

type PaymentSheetResponse = {
  paymentIntent?: string;
  paymentIntentClientSecret?: string;
  setupIntentClientSecret?: string | null;
  pendingSetupIntentClientSecret?: string | null;
  customerSessionClientSecret: string;
  customer: string;
  publishableKey: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
};

const styles = StyleSheet.create({
  note: {
    fontSize: 13,
    color: "#6B7280",
  },
});

export default function Checkout() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [paymentSheetReady, setPaymentSheetReady] = useState(false);
  const [error, setError] = useState("");

  const billingName =
    typeof name === "string" && name.trim() ? name.trim() : "CourtCheck Member";

  const initializePaymentSheet = useCallback(async () => {
    setInitializing(true);
    setError("");
    setPaymentSheetReady(false);

    try {
      const response = await apiFetch("/api/stripe/payment-sheet", {
        method: "POST",
      });
      const {
        paymentIntent,
        paymentIntentClientSecret,
        setupIntentClientSecret,
        pendingSetupIntentClientSecret,
        customerSessionClientSecret,
        customer,
        publishableKey,
      } = response as PaymentSheetResponse;

      const resolvedSetupIntentClientSecret =
        setupIntentClientSecret ?? pendingSetupIntentClientSecret ?? undefined;
      const resolvedPaymentIntentClientSecret =
        paymentIntentClientSecret ?? paymentIntent ?? undefined;

      if (
        !resolvedSetupIntentClientSecret &&
        !resolvedPaymentIntentClientSecret
      ) {
        throw new Error(
          "Missing payment secret from server. Expected setupIntentClientSecret or paymentIntentClientSecret."
        );
      }

      await initStripe({
        publishableKey,
        urlScheme: "courtcheck",
      });

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "CourtCheck",
        customerId: customer,
        customerSessionClientSecret,
        ...(resolvedSetupIntentClientSecret
          ? { setupIntentClientSecret: resolvedSetupIntentClientSecret }
          : { paymentIntentClientSecret: resolvedPaymentIntentClientSecret! }),
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { name: billingName },
        returnURL: "courtcheck://stripe-redirect",
      });

      if (initError) {
        throw new Error(initError.message);
      }

      setPaymentSheetReady(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to initialize payment. Please try again.";
      setError(message);
    } finally {
      setInitializing(false);
    }
  }, [billingName, initPaymentSheet]);

  useEffect(() => {
    initializePaymentSheet();
  }, [initializePaymentSheet]);

  const openPaymentSheet = async () => {
    if (!paymentSheetReady || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        if (paymentError.code !== "Canceled") {
          setError(paymentError.message);
          Alert.alert("Payment failed", paymentError.message);
        }
        return;
      }

      Alert.alert("Success", "Your 7-day free trial is active.");
      router.replace("/(main)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout>
      <View style={authFormStyles.fill}>
        <View style={authFormStyles.formBlock}>
          <AuthTitle>Start your 7-day free trial</AuthTitle>
          <AuthSubtitle>
            Subscription renews monthly after trial. Cancel anytime.
          </AuthSubtitle>

          <AuthInfoCard title="CourtCheck Premium">
            7-day free trial{"\n"}Then $5/month for unlimited access
          </AuthInfoCard>

          <Text style={styles.note}>
            Secure checkout powered by Stripe. No charges today.
          </Text>

          {error ? <Text style={authFormStyles.errorText}>{error}</Text> : null}
        </View>

        <View style={authFormStyles.formBlock}>
          <AuthPrimaryButton
            onPress={openPaymentSheet}
            disabled={!paymentSheetReady || loading || initializing}
            loading={loading || initializing}
          >
            Start Free Trial
          </AuthPrimaryButton>

          {!!error && !initializing ? (
            <AuthPrimaryButton
              onPress={initializePaymentSheet}
              disabled={loading}
            >
              Retry
            </AuthPrimaryButton>
          ) : null}
        </View>
      </View>
    </AuthScreenLayout>
  );
}
