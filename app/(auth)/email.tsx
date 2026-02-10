import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View, Alert, ActivityIndicator } from "react-native";
import { useAuthContext } from "@/context/AuthContext";

export default function Email() {
    const router = useRouter();
    const { requestOtp } = useAuthContext();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignIn = async () => {
        // Validate email
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

            // Navigate to OTP screen
            router.push({
                pathname: "/otp",
                params: { email },
            });
        } catch (err: any) {
            console.error("Failed to send OTP:", err);
            setError(err.message || "Failed to send verification code. Please try again.");
            Alert.alert(
                "Error",
                "Failed to send verification code. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 15, justifyContent: "center" }}>
            <Text>
                What's your email?
            </Text>

            <TextInput
                placeholder="you@example.com"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setError(""); // Clear error when user types
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
                style={{
                    borderWidth: 1,
                    borderColor: error ? "red" : "#ccc",
                    padding: 10,
                    marginBottom: 8,
                    borderRadius: 8,
                    backgroundColor: loading ? "#f5f5f5" : "white",
                }}
            />

            {/* Error message */}
            {error ? (
                <Text style={{ color: "red", marginBottom: 12, fontSize: 14 }}>
                    {error}
                </Text>
            ) : null}

            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 8 }}>
                Two ways to access:
            </Text>
            <View style={{ marginBottom: 20 }}>
                <Text>• Check in 7 times/month for free access</Text>
                <Text>• Or subscribe for $5/month</Text>
            </View>

            <Button
                title={loading ? "Sending code..." : "Sign in with your email"}
                onPress={handleSignIn}
                disabled={!email || loading}
            />

            {loading && (
                <ActivityIndicator
                    style={{ marginTop: 16 }}
                    size="large"
                    color="#007AFF"
                />
            )}
        </View>
    );
}