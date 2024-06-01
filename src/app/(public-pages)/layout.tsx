import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.css";
import { StoreProvider } from "@/stores/StoreProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Resizer } from "@/components/Resizer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Management App",
  description: "An application for managing tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`bg-background ${inter.className}`}>
          <Resizer>
            <Navbar />
            <StoreProvider>
              <main className="container">{children}</main>
            </StoreProvider>
          </Resizer>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
