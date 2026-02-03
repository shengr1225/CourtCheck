import { View, Text, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function OTP() {
    const router = useRouter();
    const [code, setCode] = useState("");

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
            <Text>Enter the code</Text>
            <Text>To sign in, enter the code we just sent to your email</Text>
            <TextInput
                placeholder="000000"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 10}}
            />
            <Button title="Continue" onPress={() => router.push("/name")} />
        </View>
    );
}
