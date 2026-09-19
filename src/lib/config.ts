export const brand = { name: "Nuvecto", tagline: "Build a mind for code." };
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
export const asset = (path: string) =>
  `${basePath}/assets/${path.replace(/^\/+/, "")}`;
export const locales = ["en", "pl"] as const;
export type Locale = (typeof locales)[number];
export const motionTokens = {
  fast: 0.16,
  normal: 0.3,
  slow: 0.65,
  stagger: 0.07,
};
