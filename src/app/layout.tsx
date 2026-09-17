import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ramírez Ferrero - Estudio Jurídico",
  description: "Sistema de gestión para el estudio jurídico Ramírez Ferrero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
