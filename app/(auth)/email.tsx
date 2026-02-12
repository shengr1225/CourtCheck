import {
    AuthInfoCard,
    AuthInput,
    AuthPrimaryButton,
    AuthScreenLayout,
    AuthTitle,
    authFormStyles,
} from "@/components/ui/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, View } from "react-native";

export default function Email() {
    const router = useRouter();
    const { requestOtp } = useAuthContext();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignIn = async () => {
        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }
        if (!email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await requestOtp(email);
            router.push({ pathname: "/otp", params: { email } });
        } catch (err: any) {
            console.error("Failed to send OTP:", err);
            setError(err.message || "Failed to send verification code. Please try again.");
            Alert.alert("Error", "Failed to send verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = email.trim().length > 0 && !loading;

    return (
        <AuthScreenLayout>
            <KeyboardAvoidingView
                style={authFormStyles.fill}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={authFormStyles.formBlock}>
                    <AuthTitle>What&apos;s your email?</AuthTitle>

                    <AuthInput
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setError("");
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        editable={!loading}
                        error={!!error}
                    />

                    {error ? (
                        <Text style={authFormStyles.errorText}>{error}</Text>
                    ) : null}

                    <AuthInfoCard title="Two ways to access">
                        Check in 20 times/month for free access{"\n"}
                        Or subscribe for $5/month
                    </AuthInfoCard>
                </View>

                <AuthPrimaryButton
                    onPress={handleSignIn}
                    disabled={!canSubmit}
                    loading={loading}
                >
                    Sign in with your email
                </AuthPrimaryButton>
            </KeyboardAvoidingView>
        </AuthScreenLayout>
    );
}
