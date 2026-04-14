export const Theme = {
  colors: {
    background: "#F5F4F1",
    surface: "#FFFFFF",
    surfaceRaised: "#FFFEFB",
    surfaceSoft: "#FBF8F1",
    text: "#2E3036",
    textMuted: "#838790",
    textSubtle: "#B9BDC6",
    accent: "#F5D98E",
    accentStrong: "#F1BC1B",
    accentSoft: "#FFF6E1",
    divider: "#EEEAE2",
    dividerStrong: "#E3DDD4",
    iconInactive: "#C9CDD4",
    fab: "#F3F1EC",
    fabShadow: "#DED9D0",
    danger: "#E96A61",
    successSoft: "#DBF4E7",
    infoSoft: "#DCE8FF",
    overlay: "rgba(46, 48, 54, 0.14)",
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
      shadowColor: "#DED9D0",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.32,
      shadowRadius: 16,
      elevation: 10,
    },
    tabBar: {
      shadowColor: "#D7D2CA",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
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
