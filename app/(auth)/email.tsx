import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function Email() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    return (
        <View style={{ flex: 1, padding: 15, justifyContent: "center" }}>
            <Text>What's your email?</Text>
            <TextInput
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                style={{ borderWidth: 1, padding: 10 }}
            />

            <Text>Two ways to access:</Text>
            <View>
                <Text>• Check in 7 times/month for free access</Text>
                <Text>• Or subscribe for $5/month</Text>
            </View>

            <Button
                title="Sign in with your email"
                onPress={() => router.push("/otp")}
            />
        </View>
    );
}
