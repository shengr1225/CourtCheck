import { View, Text, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Name() {
    const router = useRouter();
    const [name, setName] = useState("");

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
            <Text>What's your name</Text>
            <TextInput
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, padding: 10}}
            />
            <Button
                title="Continue"
                // Navigate to loading screen; after backend confirms user, redirect to main app
                onPress={() => router.push("/(auth)/loading")}
            />
        </View>
    );
}
