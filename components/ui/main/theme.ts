/**
 * Main app design tokens. Aligned with CourtCheck Figma (nodes 1-2722, 1-2745); reuse auth colors for consistency.
 */
export { AUTH_COLORS as APP_COLORS, AUTH_SPACING as APP_SPACING } from "../auth/theme";

/** Home screen background (Figma Home). */
export const HOME_BACKGROUND = "#EBF3FF";

/** Main app background. */
export const MAIN_BACKGROUND = "#EBF3FF";

/** Courts list section background. */
export const SECTION_BACKGROUND = "#EBF3FF";

export const MAIN_SPACING = {
    headerPaddingHorizontal: 16,
    headerPaddingVertical: 12,
    contentPaddingHorizontal: 16,
    contentPaddingBottom: 24,
    contentPaddingTop: 24,
    contentGap: 16,
    cardPadding: 16,
    listItemPaddingVertical: 12,
    listItemPaddingHorizontal: 16,
    sectionGap: 24,
    listGap: 12,
} as const;

/** Frame 2: scroll content padding (24 top, 16 H, 16 bottom, gap 16) */
export const SCROLL_CONTENT = {
    paddingTop: MAIN_SPACING.contentPaddingTop,
    paddingHorizontal: MAIN_SPACING.contentPaddingHorizontal,
    paddingBottom: MAIN_SPACING.contentPaddingBottom,
    gap: MAIN_SPACING.contentGap,
} as const;

export const MAIN_RADII = {
    card: 16,
    statusPill: 16,
} as const;

/** Court status: empty / low / medium / crowded (Figma Frame 224/228) */
export const COURT_STATUS = {
    empty: { bg: "#D1DBFF", text: "#4941F6" },
    low: { bg: "#9EE5A5", text: "#095811" },
    medium: { bg: "#FFF068", text: "#8F5100" },
    crowded: { bg: "#FFC1C1", text: "#A90000" },
} as const;
