
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "./providers";

export const metadata = {
  title: "Broom Marketplace",
  description: "Marketplace demo powered by Next.js + Tailwind + Pi Network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* ✅ Pi SDK hanya sekali load */}
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
      </head>
      <body className="min-h-screen text-white bg-slate-900 flex flex-col">
        <Providers>
          <div className="flex-grow">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
