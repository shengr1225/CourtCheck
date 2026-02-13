import { BackButton } from "@/components/ui/auth/back-button";
import { formatTimePast } from "@/components/ui/main/court-card";
import {
    MainScreenLayout,
    MainHeader,
    SectionCard,
    SCROLL_CONTENT,
    APP_COLORS,
    COURT_STATUS,
} from "@/components/ui/main";
import { listCourts, apiStatusToApp } from "@/lib/courts";
import type { ApiCourt, ApiCheckinWithUser } from "@/lib/courts";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const HOME_BG = "#EBF3FF";

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

const INFO_CARD_STYLE = { padding: 16, gap: 16 };

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: HOME_BG,
    },
    scroll: {
        flex: 1,
    },
    courtPhoto: {
        width: "100%",
        height: 254,
        borderRadius: 0,
        backgroundColor: "#D9D9D9",
    },
    /** Row: status pill + clock + time */
    statusRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    pill: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    pillText: {
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 19,
        letterSpacing: -0.408,
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    timeText: {
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 19,
        letterSpacing: -0.408,
        color: "#4F5A6A",
    },
    /** Frame 20: Check-in button - opacity 0.5 when disabled */
    checkInButton: {
        height: 56,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "#4941F6",
        borderRadius: 8,
    },
    checkInButtonText: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#FFFFFF",
    },
    checkInHint: {
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 19,
        letterSpacing: -0.408,
        color: "#000000",
        textAlign: "center",
    },
    activityTitle: {
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 24,
        letterSpacing: -0.408,
        color: "#000000",
    },
    activityList: {
        gap: 10,
    },
    activityItem: {
        gap: 10,
    },
    activityItemRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    activityBy: {
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 19,
        letterSpacing: -0.408,
        color: "#000000",
    },
    divider: {
        height: 1,
        backgroundColor: "#E4E4E4",
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "400",
        color: "#4F5A6A",
        fontStyle: "italic",
    },
    loading: {
        paddingVertical: 32,
        alignItems: "center",
    },
});

function RecentActivityItem({
    checkIn,
    showDivider,
}: {
    checkIn: ApiCheckinWithUser;
    showDivider: boolean;
}) {
    const statusKey = apiStatusToApp(checkIn.status);
    const { bg, text } = COURT_STATUS[statusKey];
    const name = checkIn.userName?.trim() || "Someone";

    return (
        <View style={styles.activityItem}>
            <View style={styles.activityItemRow}>
                <View style={[styles.pill, { backgroundColor: bg }]}>
                    <Text style={[styles.pillText, { color: text }]}>
                        {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                    </Text>
                </View>
                <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={16} color="#4F5A6A" />
                    <Text style={styles.timeText}>{formatTimePast(checkIn.createdAt)}</Text>
                </View>
            </View>
            <Text style={styles.activityBy}>by {name}</Text>
            {showDivider && <View style={styles.divider} />}
        </View>
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
                <View style={styles.screen}>
                    <MainHeader
                        left={<BackButton onPress={() => router.back()} />}
                        title="Invalid court"
                        right={<View />}
                    />
                </View>
            </MainScreenLayout>
        );
    }

    if (loading) {
        return (
            <MainScreenLayout>
                <View style={styles.screen}>
                    <MainHeader
                        left={<BackButton onPress={() => router.back()} />}
                        title="Court"
                        right={<View />}
                    />
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={APP_COLORS.primary} />
                    </View>
                </View>
            </MainScreenLayout>
        );
    }

    if (error || !court) {
        return (
            <MainScreenLayout>
                <View style={styles.screen}>
                    <MainHeader
                        left={<BackButton onPress={() => router.back()} />}
                        title={error ?? "Court not found"}
                        right={<View />}
                    />
                </View>
            </MainScreenLayout>
        );
    }

    const statusKey = apiStatusToApp(court.status);
    const { bg, text } = COURT_STATUS[statusKey];

    return (
        <MainScreenLayout>
            <View style={styles.screen}>
                <MainHeader
                    left={<BackButton onPress={() => router.back()} />}
                    title={court.name}
                    right={<View />}
                />
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={SCROLL_CONTENT}
                    showsVerticalScrollIndicator={false}
                >
                    <SectionCard style={INFO_CARD_STYLE}>
                        {court.photoUrl ? (
                            <Image
                                source={{ uri: court.photoUrl }}
                                style={styles.courtPhoto}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.courtPhoto} />
                        )}
                        <View style={styles.statusRow}>
                            <View style={[styles.pill, { backgroundColor: bg }]}>
                                <Text style={[styles.pillText, { color: text }]}>
                                    {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                                </Text>
                            </View>
                            <View style={styles.timeRow}>
                                <Ionicons name="time-outline" size={16} color="#4F5A6A" />
                                <Text style={styles.timeText}>
                                    {formatTimePast(court.lastUpdatedAt)}
                                </Text>
                            </View>
                        </View>
                        <Pressable
                            style={({ pressed }) => [
                                styles.checkInButton,
                                { opacity: 0.5 },
                                pressed && { opacity: 0.6 },
                            ]}
                            onPress={() =>
                                router.push(`/(main)/court/${court.id}/check-in`)
                            }
                        >
                            <Text style={styles.checkInButtonText}>Check-in</Text>
                        </Pressable>
                        <Text style={styles.checkInHint}>
                            Check-in will be enabled once you are nearby and have location turned
                            on.
                        </Text>
                    </SectionCard>

                    <SectionCard>
                        <Text style={styles.activityTitle}>Recent Activity</Text>
                        {checkins.length > 0 ? (
                            <View style={styles.activityList}>
                                {checkins.map((c, i) => (
                                    <RecentActivityItem
                                        key={c.checkinId}
                                        checkIn={c}
                                        showDivider={i < checkins.length - 1}
                                    />
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.emptyText}>
                                No check-ins yet. Be the first!
                            </Text>
                        )}
                    </SectionCard>
                </ScrollView>
            </View>
        </MainScreenLayout>
    );
}
