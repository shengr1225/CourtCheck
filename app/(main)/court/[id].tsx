import { BackButton } from "@/components/ui/auth/back-button";
import {
    Card,
    MainScreenLayout,
    APP_COLORS,
    MAIN_SPACING,
    COURT_STATUS,
    MAIN_RADII,
} from "@/components/ui/main";
import { listCourts, apiStatusToApp } from "@/lib/courts";
import type { ApiCourt, ApiCheckinWithUser } from "@/lib/courts";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

function parseAddedCheckin(param: string | undefined): ApiCheckinWithUser | null {
    if (!param?.trim()) return null;
    try {
        const parsed = JSON.parse(param) as ApiCheckinWithUser;
        if (parsed?.checkinId && parsed?.createdAt) return parsed;
    } catch {
        /* ignore */
    }
    return null;
}
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

function formatLastUpdated(iso: string): string {
    try {
        const d = new Date(iso);
        const now = new Date();
        const sameDay = d.toDateString() === now.toDateString();
        if (sameDay) {
            return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
        }
        return d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

function formatCheckinTime(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

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
        marginBottom: 8,
    },
    lastCard: {
        gap: 10,
    },
    courtPhoto: {
        width: "100%",
        height: 160,
        borderRadius: MAIN_RADII.card,
        backgroundColor: "#E8E8E8",
    },
    lastMeta: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
    },
    lastCrowd: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: MAIN_RADII.statusPill,
    },
    lastCrowdText: {
        fontSize: 14,
        fontWeight: "600",
    },
    lastTime: {
        fontSize: 14,
        color: "#686D84",
    },
    previousList: {
        gap: 8,
    },
    previousRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: APP_COLORS.background,
        borderRadius: MAIN_RADII.card,
    },
    previousName: {
        fontSize: 15,
        fontWeight: "500",
        color: APP_COLORS.title,
    },
    previousTime: {
        fontSize: 14,
        color: "#686D84",
    },
    checkInButton: {
        marginTop: 8,
        paddingVertical: 14,
        borderRadius: MAIN_RADII.card,
        backgroundColor: APP_COLORS.primary,
        alignItems: "center",
    },
    checkInButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: APP_COLORS.primaryText,
    },
    emptyText: {
        fontSize: 15,
        color: "#686D84",
        fontStyle: "italic",
    },
    loading: {
        paddingVertical: 32,
        alignItems: "center",
    },
});

function PreviousCheckInRow({ checkIn }: { checkIn: ApiCheckinWithUser }) {
    const displayName = checkIn.userName?.trim() || "Someone";
    return (
        <View style={styles.previousRow}>
            <Text style={styles.previousName}>{displayName}</Text>
            <Text style={styles.previousTime}>{formatCheckinTime(checkIn.createdAt)}</Text>
        </View>
    );
}

function LastUpdateCard({ court }: { court: ApiCourt }) {
    const statusKey = apiStatusToApp(court.status);
    const { bg, text } = COURT_STATUS[statusKey];

    return (
        <Card>
            <View style={styles.lastCard}>
                {court.photoUrl ? (
                    <Image
                        source={{ uri: court.photoUrl }}
                        style={styles.courtPhoto}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.courtPhoto, { backgroundColor: "#E8E8E8" }]} />
                )}
                <View style={styles.lastMeta}>
                    <View style={[styles.lastCrowd, { backgroundColor: bg }]}>
                        <Text style={[styles.lastCrowdText, { color: text }]}>
                            {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                        </Text>
                    </View>
                    <Text style={styles.lastTime}>
                        Updated {formatLastUpdated(court.lastUpdatedAt)}
                    </Text>
                </View>
            </View>
        </Card>
    );
}

export default function CourtDetailScreen() {
    const { id, addedCheckin: addedCheckinParam } = useLocalSearchParams<{
        id: string;
        addedCheckin?: string;
    }>();
    const router = useRouter();
    const [court, setCourt] = useState<ApiCourt | null>(null);
    const [checkins, setCheckins] = useState<ApiCheckinWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCourt = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const list = await listCourts();
            const found = list.find((c) => c.id === id) ?? null;
            setCourt(found);
            const fromApi = found?.checkins ?? [];
            setCheckins(
                [...fromApi].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load court");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadCourt();
    }, [loadCourt]);

    // Merge check-in we just added (name + time) so it shows even before the list API returns it
    useEffect(() => {
        const added = parseAddedCheckin(addedCheckinParam);
        if (!added || loading) return;
        setCheckins((prev) => {
            if (prev.some((c) => c.checkinId === added.checkinId)) return prev;
            const merged = [added, ...prev].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            return merged;
        });
        router.setParams({ addedCheckin: "" });
    }, [addedCheckinParam, loading, router]);

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
                    <Text style={styles.headerTitle}>Court</Text>
                </View>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={APP_COLORS.primary} />
                </View>
            </MainScreenLayout>
        );
    }

    if (error || !court) {
        return (
            <MainScreenLayout>
                <View style={styles.header}>
                    <BackButton onPress={() => router.back()} />
                    <Text style={styles.headerTitle}>
                        {error ?? "Court not found"}
                    </Text>
                </View>
            </MainScreenLayout>
        );
    }

    return (
        <MainScreenLayout>
            <View style={styles.header}>
                <BackButton onPress={() => router.back()} />
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {court.name}
                </Text>
            </View>
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text style={styles.sectionTitle}>Last update</Text>
                    <LastUpdateCard court={court} />
                </View>

                <View>
                    <Text style={styles.sectionTitle}>Previous check-ins</Text>
                    {checkins.length > 0 ? (
                        <View style={styles.previousList}>
                            {checkins.map((c) => (
                                <PreviousCheckInRow key={c.checkinId} checkIn={c} />
                            ))}
                        </View>
                    ) : (
                        <Card>
                            <Text style={styles.emptyText}>
                                No check-ins yet. Be the first!
                            </Text>
                        </Card>
                    )}
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.checkInButton,
                        { opacity: pressed ? 0.9 : 1 },
                    ]}
                    onPress={() =>
                        router.push(`/(main)/court/${court.id}/check-in`)
                    }
                >
                    <Text style={styles.checkInButtonText}>Check in</Text>
                </Pressable>
            </ScrollView>
        </MainScreenLayout>
    );
}
