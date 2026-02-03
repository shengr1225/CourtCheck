import { View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function LandingScreen() {
    const router = useRouter();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Get Started" onPress={() => router.push("/email")} />
        </View>
    );
}