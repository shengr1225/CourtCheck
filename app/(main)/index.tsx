import { Button, View, Text } from "react-native";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function Main() {
    const { logout } = useAuthContext();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            // Redirect back to the start of auth flow
            router.replace("/(auth)");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Main App</Text>

            {__DEV__ && (
                <Button
                    title="Dev Logout"
                    onPress={handleLogout}
                />
            )}
        </View>
    );
}
