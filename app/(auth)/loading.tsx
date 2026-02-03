import { View, Text, ActivityIndicator } from "react-native";

export default function Loading() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
            }}
        >
            <ActivityIndicator size="large" />
            <Text>Signing you in…</Text>
        </View>
    );
}
