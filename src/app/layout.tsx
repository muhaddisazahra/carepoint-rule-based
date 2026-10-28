
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DHQ Sargodha | Patient Information Assistant",
  description:
    "An independent student-built hospital information chatbot demo for DHQ Sargodha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
