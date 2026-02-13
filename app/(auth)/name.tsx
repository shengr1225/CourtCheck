import {
  AuthInput,
  AuthPrimaryButton,
  AuthScreenLayout,
  AuthSubtitle,
  AuthTitle,
  authFormStyles,
} from "@/components/ui/auth";
import { useAuthContext } from "@/context/AuthContext";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function Name() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [name, setName] = useState(user?.name ?? "");

  const canSubmit = name.trim().length > 0;
  const hasStripeCustomer = !!user?.stripeCustomerId;

  return (
    <AuthScreenLayout>
      <View style={authFormStyles.fill}>
        <View style={authFormStyles.formBlock}>
          <AuthTitle>What&apos;s your name?</AuthTitle>
          <AuthSubtitle>
            This will be shown on your court check-ins
          </AuthSubtitle>
          <AuthInput
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
        <AuthPrimaryButton
          onPress={() => {
            if (hasStripeCustomer) {
              router.replace("/(main)");
              return;
            }

            router.push({
              pathname: "/(auth)/checkout",
              params: { name: name.trim() },
            } as Href);
          }}
          disabled={!canSubmit}
        >
          Continue
        </AuthPrimaryButton>
      </View>
    </AuthScreenLayout>
  );
}
