import { BackButton } from "@/components/ui/auth/back-button";
import {
    MainScreenLayout,
    MainHeader,
    SectionCard,
    SCROLL_CONTENT,
    APP_COLORS,
    COURT_STATUS,
} from "@/components/ui/main";
import type { CourtStatusKey } from "@/components/ui/main";
import { useAuthContext } from "@/context/AuthContext";
import { createCheckin, listCourts } from "@/lib/courts";
import type { ApiCourt } from "@/lib/courts";
import { Ionicons } from "@expo/vector-icons";
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
const HOME_BG = "#EBF3FF";

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: HOME_BG,
    },
    headerClose: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    scroll: {
        flex: 1,
    },
    inner: {
        gap: 16,
    },
    /** Frame 234: Check In + court name */
    titleBlock: {
        gap: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#000000",
    },
    courtName: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#4F5A6A",
    },
    /** Frame 240: How busy */
    busySection: {
        gap: 16,
    },
    busyTitle: {
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 19,
        letterSpacing: -0.408,
        color: "#000000",
    },
    /** Frame 238 / 239: 2x2 grid rows */
    busyRow: {
        flexDirection: "row",
        gap: 16,
    },
    /** Frame 235 / 237: option card - selected 4px #4941F6, else 1px #E4E4E4 */
    optionCard: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 0,
        gap: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E4E4E4",
    },
    optionCardSelected: {
        borderWidth: 4,
        borderColor: "#4941F6",
    },
    optionInner: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    optionPill: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    optionLabel: {
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#000000",
    },
    /** Add a photo */
    photoSectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 19,
        letterSpacing: -0.408,
        color: "#000000",
    },
    photoDashed: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#C4C4C4",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    photoHint1: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#4F5A6A",
    },
    photoHint2: {
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 19,
        letterSpacing: -0.408,
        color: "#4F5A6A",
    },
    /** Frame 242: Cancel + Check In */
    buttonRow: {
        flexDirection: "row",
        gap: 16,
    },
    cancelButton: {
        flex: 1,
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#E4E4E4",
        borderRadius: 8,
    },
    cancelButtonText: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#1E1E1E",
    },
    submitButton: {
        flex: 1,
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4941F6",
        borderRadius: 8,
    },
    submitButtonText: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#FFFFFF",
    },
    submitButtonDisabled: {
        backgroundColor: "#C0C0C0",
    },
    error: {
        padding: 12,
        backgroundColor: "#FFE0E0",
        borderRadius: 8,
    },
    errorText: {
        fontSize: 14,
        color: "#A90000",
    },
    loading: {
        paddingVertical: 32,
        alignItems: "center",
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

    const goBack = () => router.back();

    const headerRight = (
        <Pressable style={styles.headerClose} onPress={goBack}>
            <Ionicons name="close" size={24} color="#000000" />
        </Pressable>
    );

    if (!id) {
        return (
            <MainScreenLayout>
                <View style={styles.screen}>
                    <MainHeader left={<BackButton onPress={goBack} />} right={headerRight} />
                </View>
            </MainScreenLayout>
        );
    }

    if (loading) {
        return (
            <MainScreenLayout>
                <View style={styles.screen}>
                    <MainHeader left={<BackButton onPress={goBack} />} right={headerRight} />
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={APP_COLORS.primary} />
                    </View>
                </View>
            </MainScreenLayout>
        );
    }

    if (!court) {
        return (
            <MainScreenLayout>
                <View style={styles.screen}>
                    <MainHeader left={<BackButton onPress={goBack} />} right={headerRight} />
                </View>
            </MainScreenLayout>
        );
    }

    const canSubmit = selectedStatus !== null && !submitting;

    return (
        <MainScreenLayout>
            <View style={styles.screen}>
                <MainHeader left={<BackButton onPress={goBack} />} right={headerRight} />
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={SCROLL_CONTENT}
                    showsVerticalScrollIndicator={false}
                >
                    {error ? (
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <SectionCard>
                        <View style={styles.inner}>
                            <View style={styles.titleBlock}>
                                <Text style={styles.title}>Check In</Text>
                                <Text style={styles.courtName}>{court.name}</Text>
                            </View>

                            <View style={styles.busySection}>
                                <Text style={styles.busyTitle}>How busy is it right now?</Text>
                                <View style={styles.busyRow}>
                                    {(["empty", "low"] as CourtStatusKey[]).map((status) => {
                                        const { bg } = COURT_STATUS[status];
                                        const isSelected = selectedStatus === status;
                                        return (
                                            <Pressable
                                                key={status}
                                                style={[
                                                    styles.optionCard,
                                                    isSelected && styles.optionCardSelected,
                                                ]}
                                                onPress={() => setSelectedStatus(status)}
                                            >
                                                <View style={styles.optionInner}>
                                                    <View style={[styles.optionPill, { backgroundColor: bg }]} />
                                                    <Text style={styles.optionLabel}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                                <View style={styles.busyRow}>
                                    {(["medium", "crowded"] as CourtStatusKey[]).map((status) => {
                                        const { bg } = COURT_STATUS[status];
                                        const isSelected = selectedStatus === status;
                                        return (
                                            <Pressable
                                                key={status}
                                                style={[
                                                    styles.optionCard,
                                                    isSelected && styles.optionCardSelected,
                                                ]}
                                                onPress={() => setSelectedStatus(status)}
                                            >
                                                <View style={styles.optionInner}>
                                                    <View style={[styles.optionPill, { backgroundColor: bg }]} />
                                                    <Text style={styles.optionLabel}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <Text style={styles.photoSectionTitle}>Add a photo (optional)</Text>
                            <Pressable style={styles.photoDashed}>
                                <Ionicons name="camera-outline" size={44} color="#4F5A6A" />
                                <Text style={styles.photoHint1}>Tab to add a photo</Text>
                                <Text style={styles.photoHint2}>
                                    Help others see what it's like!
                                </Text>
                            </Pressable>

                            <View style={styles.buttonRow}>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.cancelButton,
                                        { opacity: pressed ? 0.8 : 1 },
                                    ]}
                                    onPress={goBack}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </Pressable>
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
                                        {submitting ? "Submitting…" : "Check In"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </SectionCard>
                </ScrollView>
            </View>
        </MainScreenLayout>
    );
}
