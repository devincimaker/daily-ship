import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/fraunces";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dailyship.xyz"),
  title: {
    default: "dailyship.xyz | One ship every day",
    template: "%s | dailyship.xyz",
  },
  description:
    "A public daily shipping log: projects, experiments, and real progress every day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
