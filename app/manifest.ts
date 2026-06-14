import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maddox Training OS",
    short_name: "Maddox Training",
    description: "Private youth hockey training planner and live session app.",
    start_url: "/today",
    display: "standalone",
    background_color: "#eef8fb",
    theme_color: "#10283b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
