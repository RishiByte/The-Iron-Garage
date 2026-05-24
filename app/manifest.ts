import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "THE IRON GARAGE",
    short_name: "Iron Garage",
    description: "Premium local-first workout planning and progress tracking.",
    start_url: "/",
    display: "standalone",
    background_color: "#111214",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
