import {
    AuthInput,
    AuthPrimaryButton,
    AuthScreenLayout,
    AuthSubtitle,
    AuthTitle,
    authFormStyles,
} from "@/components/ui/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function Name() {
    const router = useRouter();
    const [name, setName] = useState("");

    const canSubmit = name.trim().length > 0;

    return (
        <AuthScreenLayout>
            <View style={authFormStyles.fill}>
                <View style={authFormStyles.formBlock}>
                    <AuthTitle>What&apos;s your name?</AuthTitle>
                    <AuthSubtitle>
                        This will be shown on your court check-ins
                    </AuthSubtitle>
                    <AuthInput
                        placeholder="Your name"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                </View>
                <AuthPrimaryButton
                    onPress={() => router.replace("/(main)")}
                    disabled={!canSubmit}
                >
                    Continue
                </AuthPrimaryButton>
            </View>
        </AuthScreenLayout>
    );
}
