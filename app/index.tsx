import { Redirect } from "expo-router";

export default function Index() {
  const loggedIn = false; // placeholder

  if (loggedIn) {
    return <Redirect href="/(main)" />;
  }

  return <Redirect href="/(auth)" />;
}