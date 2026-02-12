import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { AUTH_COLORS } from "./theme";

const styles = StyleSheet.create({
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
});

type BackButtonProps = {
    onPress: () => void;
    style?: ViewStyle;
    iconColor?: string;
};

export function BackButton({
    onPress,
    style,
    iconColor = AUTH_COLORS.title,
}: BackButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }, style]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
            <Ionicons name="arrow-back" size={24} color={iconColor} />
        </Pressable>
    );
}
