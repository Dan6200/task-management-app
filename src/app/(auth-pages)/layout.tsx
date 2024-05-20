import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`bg-primary ${inter.className}`}>
          <main className="container">
            <div className="h-screen flex justify-center">
              <div className="grid place-items-center">{children}</div>
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
