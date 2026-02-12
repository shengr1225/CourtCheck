import {
    AuthInput,
    AuthPrimaryButton,
    AuthScreenLayout,
    AuthSubtitle,
    AuthTitle,
    authFormStyles,
} from "@/components/ui/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function OTP() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const { verifyOtp } = useAuthContext();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerifyOTP = async () => {
        if (code.length !== 6) {
            setError("Enter the 6-digit code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const nextStep = await verifyOtp(email, code);
            const goToName = __DEV__ ? true : nextStep === "name";
            if (goToName) {
                router.replace("/(auth)/name");
            } else {
                router.replace("/(main)");
            }
        } catch (err: any) {
            setError(err.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthScreenLayout>
            <View style={authFormStyles.fill}>
                <View style={authFormStyles.formBlock}>
                    <AuthTitle>Enter the code</AuthTitle>
                    <AuthSubtitle>
                        To sign in, enter the code we just sent to your email
                    </AuthSubtitle>
                    <AuthInput
                        placeholder="000000"
                        value={code}
                        onChangeText={(text) => {
                            setCode(text);
                            setError("");
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!loading}
                        error={!!error}
                    />
                    {error ? (
                        <Text style={authFormStyles.errorText}>{error}</Text>
                    ) : null}
                </View>
                <AuthPrimaryButton
                    onPress={handleVerifyOTP}
                    disabled={loading || code.length !== 6}
                    loading={loading}
                >
                    Continue
                </AuthPrimaryButton>
            </View>
        </AuthScreenLayout>
    );
}
