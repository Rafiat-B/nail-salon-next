import type { ReactNode } from "react";
import "./globals.css";
import Footer from "../../components/Footer";
import NavbarWrapper from "../../components/NavbarWrapper";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-pink-50 flex flex-col relative z-0">
        <NavbarWrapper />
        <main className="flex-1 p-6">{children}</main>
        <Footer />
        <div id="root-portal"></div>
      </body>
    </html>
  );
}
