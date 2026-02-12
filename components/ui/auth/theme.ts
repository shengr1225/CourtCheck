/**
 * Auth design tokens (Figma). Shared by auth screens and landing.
 */
export const AUTH_COLORS = {
    background: "#FFFFFF",
    landingBackground: "#EBF3FF",
    title: "#000000",
    body: "#000000",
    placeholder: "#686D84",
    inputBg: "#EFEFF1",
    infoCardBg: "#EDF2FF",
    infoCardText: "#4941F6",
    primary: "#4941F6",
    primaryDisabled: "#B8B2F8",
    primaryText: "#FFFFFF",
    error: "#E53935",
    titleUnderline: "#EDFF8D",
} as const;

export const AUTH_SPACING = {
    screenPaddingTop: 24,
    screenPaddingHorizontal: 16,
    screenPaddingBottom: 16,
    contentGap: 24,
    formGap: 16,
    sectionGap: 40,
    buttonPaddingHorizontal: 16,
    inputPaddingVertical: 17,
    inputPaddingHorizontal: 18,
    infoCardPadding: 17,
    infoCardGap: 10,
} as const;

export const AUTH_TYPOGRAPHY = {
    title: {
        fontSize: 28,
        fontWeight: "400" as const,
        lineHeight: 34,
        letterSpacing: -0.4,
        color: AUTH_COLORS.title,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "400" as const,
        lineHeight: 24,
        letterSpacing: -0.32,
        color: AUTH_COLORS.body,
    },
    input: {
        fontSize: 20,
        fontWeight: "500" as const,
        lineHeight: 24,
        letterSpacing: -0.32,
    },
    button: {
        fontSize: 20,
        fontWeight: "400" as const,
        lineHeight: 24,
        letterSpacing: -0.4,
    },
    infoCardTitle: {
        fontSize: 16,
        fontWeight: "700" as const,
        lineHeight: 21,
        letterSpacing: -0.32,
    },
    infoCardBody: {
        fontSize: 16,
        fontWeight: "400" as const,
        lineHeight: 21,
        letterSpacing: -0.32,
    },
} as const;

export const AUTH_RADII = {
    input: 6,
    button: 8,
    infoCard: 6,
} as const;
