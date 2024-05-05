import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { StoreProvider } from "@/stores/StoreProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Resizer } from "@/components/Resizer";
import { Theme } from "@radix-ui/themes";

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
        <body className={`bg-slate-100 ${inter.className}`}>
          <Resizer>
            <Theme>
              <Navbar />
              <StoreProvider>
                <main className="container">{children}</main>
              </StoreProvider>
            </Theme>
          </Resizer>
        </body>
      </html>
    </ClerkProvider>
  );
}
