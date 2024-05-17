import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={`bg-primary ${inter.className}`}>
      <main className="container p-2">
        <div className="h-fit min-h-screen">
          <div className="grid place-items-center mt-8 sm:mt-16">
            {children}
          </div>
        </div>
      </main>
    </body>
  );
}
