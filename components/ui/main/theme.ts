/**
 * Main app design tokens. Aligned with CourtCheck Figma; reuse auth colors for consistency.
 */
export { AUTH_COLORS as APP_COLORS, AUTH_SPACING as APP_SPACING } from "../auth/theme";

export const MAIN_SPACING = {
    headerPaddingHorizontal: 16,
    headerPaddingVertical: 12,
    contentPaddingHorizontal: 16,
    contentPaddingBottom: 24,
    cardPadding: 16,
    listItemPaddingVertical: 12,
    listItemPaddingHorizontal: 16,
    sectionGap: 24,
    listGap: 12,
} as const;

export const MAIN_RADII = {
    card: 12,
    statusPill: 14,
} as const;

/** Court status: empty / low / medium / crowded */
export const COURT_STATUS = {
    empty: { bg: "#D1DBFF", text: "#4941F6" },
    low: { bg: "#9EE5A5", text: "#095811" },
    medium: { bg: "#FFE4A0", text: "#8B6914" },
    crowded: { bg: "#FFC1C1", text: "#A90000" },
} as const;
