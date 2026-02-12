import { BackButton } from "@/components/ui/auth/back-button";
import {
    Card,
    MainScreenLayout,
    APP_COLORS,
    MAIN_SPACING,
    COURT_STATUS,
    MAIN_RADII,
} from "@/components/ui/main";
import type { CourtStatusKey } from "@/components/ui/main";
import { useAuthContext } from "@/context/AuthContext";
import { createCheckin, listCourts } from "@/lib/courts";
import type { ApiCourt } from "@/lib/courts";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const STATUS_OPTIONS: CourtStatusKey[] = ["empty", "low", "medium", "crowded"];

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: MAIN_SPACING.headerPaddingHorizontal,
        paddingVertical: MAIN_SPACING.headerPaddingVertical,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E0E0E0",
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "600",
        color: APP_COLORS.title,
    },
    content: {
        flex: 1,
        paddingHorizontal: MAIN_SPACING.contentPaddingHorizontal,
        paddingBottom: MAIN_SPACING.contentPaddingBottom,
    },
    scrollContent: {
        paddingTop: MAIN_SPACING.sectionGap,
        gap: MAIN_SPACING.sectionGap,
        paddingBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: APP_COLORS.title,
        marginBottom: 12,
    },
    statusGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    statusOption: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: MAIN_RADII.card,
        borderWidth: 2,
        borderColor: "transparent",
    },
    statusOptionSelected: {
        borderColor: APP_COLORS.primary,
    },
    statusOptionText: {
        fontSize: 15,
        fontWeight: "600",
    },
    submitButton: {
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: MAIN_RADII.card,
        backgroundColor: APP_COLORS.primary,
        alignItems: "center",
    },
    submitButtonDisabled: {
        backgroundColor: "#C0C0C0",
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: APP_COLORS.primaryText,
    },
    photoNote: {
        fontSize: 14,
        color: "#686D84",
        fontStyle: "italic",
    },
    loading: {
        paddingVertical: 32,
        alignItems: "center",
    },
    error: {
        padding: 12,
        backgroundColor: "#FFE0E0",
        borderRadius: 8,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: "#A90000",
    },
});

export default function CheckInScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthContext();
    const [court, setCourt] = useState<ApiCourt | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<CourtStatusKey | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCourt = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const list = await listCourts();
            const found = list.find((c) => c.id === id) ?? null;
            setCourt(found);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load court");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadCourt();
    }, [loadCourt]);

    const handleSubmit = async () => {
        if (!id || !selectedStatus) return;
        setSubmitting(true);
        setError(null);
        try {
            const checkin = await createCheckin(id, { status: selectedStatus });
            const addedCheckin = {
                ...checkin,
                userName: user?.name ?? "You",
            };
            Alert.alert("Checked in!", "Your check-in was recorded.", [
                {
                    text: "OK",
                    onPress: () =>
                        router.replace({
                            pathname: `/(main)/court/${id}`,
                            params: { addedCheckin: JSON.stringify(addedCheckin) },
                        }),
                },
            ]);
        } catch (e) {
            const err = e as Error & { status?: number };
            const message =
                err.status === 401
                    ? "Session expired. Please log out and log in again to check in."
                    : err.message || "Check-in failed";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!id) {
        return (
            <MainScreenLayout>
                <View style={styles.header}>
                    <BackButton onPress={() => router.back()} />
                    <Text style={styles.headerTitle}>Invalid court</Text>
                </View>
            </MainScreenLayout>
        );
    }

    if (loading) {
        return (
            <MainScreenLayout>
                <View style={styles.header}>
                    <BackButton onPress={() => router.back()} />
                    <Text style={styles.headerTitle}>Check in</Text>
                </View>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={APP_COLORS.primary} />
                </View>
            </MainScreenLayout>
        );
    }

    if (!court) {
        return (
            <MainScreenLayout>
                <View style={styles.header}>
                    <BackButton onPress={() => router.back()} />
                    <Text style={styles.headerTitle}>Court not found</Text>
                </View>
            </MainScreenLayout>
        );
    }

    const canSubmit = selectedStatus !== null && !submitting;

    return (
        <MainScreenLayout>
            <View style={styles.header}>
                <BackButton onPress={() => router.back()} />
                <Text style={styles.headerTitle} numberOfLines={1}>
                    Check in · {court.name}
                </Text>
            </View>
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {error && (
                    <View style={styles.error}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View>
                    <Text style={styles.sectionTitle}>How busy is it right now?</Text>
                    <Card>
                        <View style={styles.statusGrid}>
                            {STATUS_OPTIONS.map((status) => {
                                const { bg, text } = COURT_STATUS[status];
                                const isSelected = selectedStatus === status;
                                return (
                                    <Pressable
                                        key={status}
                                        onPress={() => setSelectedStatus(status)}
                                        style={[
                                            styles.statusOption,
                                            { backgroundColor: bg },
                                            isSelected && styles.statusOptionSelected,
                                        ]}
                                    >
                                        <Text style={[styles.statusOptionText, { color: text }]}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </Card>
                </View>

                <View>
                    <Text style={styles.sectionTitle}>Add a photo (optional)</Text>
                    <Card>
                        <Text style={styles.photoNote}>
                            Photo upload will be available when the server supports it.
                            You can still check in without a photo.
                        </Text>
                    </Card>
                </View>

                <Pressable
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                    style={({ pressed }) => [
                        styles.submitButton,
                        !canSubmit && styles.submitButtonDisabled,
                        { opacity: pressed && canSubmit ? 0.9 : 1 },
                    ]}
                >
                    <Text style={styles.submitButtonText}>
                        {submitting ? "Submitting…" : "Check in"}
                    </Text>
                </Pressable>
            </ScrollView>
        </MainScreenLayout>
    );
}
