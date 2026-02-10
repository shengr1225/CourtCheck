import { View, Button } from "react-native";
import { useAuthContext } from "@/context/AuthContext";

export default function DevLogout() {
    const { logout } = useAuthContext();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Dev: Logout" onPress={logout} />
        </View>
    );
}
