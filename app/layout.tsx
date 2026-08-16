import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnjoyLife | A good day, planned gently",
  description:
    "A calm lifestyle companion that matches Kuala Lumpur-area activities to your pace, comfort, mood, and budget.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <div className="app-content">{children}</div>
      </body>
    </html>
  );
}
