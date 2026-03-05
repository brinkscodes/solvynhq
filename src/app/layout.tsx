import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CommandPalette } from "@/components/shared/command-palette";
import { ThemeProvider } from "@/components/shared/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solvyn - Project Dashboard",
  description: "Development tracker for the Solvyn website project",
  viewport: "width=device-width, initial-scale=1",
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('solvyn-theme');
    if (t === 'light') return;
    document.documentElement.classList.add('dark');
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
