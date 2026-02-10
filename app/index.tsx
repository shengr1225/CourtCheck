import { useEffect } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { user, loading, getCurrentUser } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(main)" />;
  }

  return <Redirect href="/(auth)" />;
}