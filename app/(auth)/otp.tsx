import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useAuthContext } from "@/context/AuthContext";

export default function OTP() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const { verifyOtp } = useAuthContext();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async () => {
        if (code.length !== 6) {
            setError("Enter the 6-digit code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await verifyOtp(email!, code);
            router.replace("/(auth)/name");
        } catch (err: any) {
            setError(err.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
            <Text>Enter the code sent to your email</Text>

            <TextInput
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                style={{
                    borderWidth: 1,
                    padding: 12,
                    marginVertical: 12,
                }}
            />

            {error ? <Text style={{ marginBottom: 8 }}>{error}</Text> : null}

            <Button title="Verify" onPress={handleVerify} disabled={loading} />

            {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
        </View>
    );
}
