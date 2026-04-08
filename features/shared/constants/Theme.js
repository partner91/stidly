export const Theme = {
  colors: {
    background: "#F4EEE8",
    surface: "#FAF9F6",
    surfaceRaised: "#FFFEFC",
    surfaceSoft: "#F7F4EF",
    text: "#2B3A48",
    textMuted: "#7E98A3",
    textSubtle: "#B7C9CE",
    accent: "#4B8192",
    accentStrong: "#356C7E",
    accentSoft: "#DCE8EB",
    divider: "#D6E2E5",
    dividerStrong: "#B8CDD3",
    iconInactive: "#DCE4E5",
    fab: "#F26F5F",
    fabShadow: "#D85E51",
    danger: "#E97A6A",
    overlay: "rgba(43, 58, 72, 0.18)",
  },
  radius: {
    screen: 34,
    section: 24,
    button: 18,
    chip: 999,
  },
  spacing: {
    screen: 22,
    cardPadding: 24,
    row: 16,
  },
  shadow: {
    fab: {
      shadowColor: "#D85E51",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.26,
      shadowRadius: 18,
      elevation: 12,
    },
    tabBar: {
      shadowColor: "#D8CFC4",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export function toLocalDateKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
