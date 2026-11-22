import type { Metadata } from "next";
import { poppins } from "@/fonts";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ChatProvider } from "@/features/chat/context/ChatContext";
import { SettingsProvider } from "@/features/settings/context/SettingsContext";
import { THEME_KEY } from "@/features/settings/services/preferencesStorage";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Money Tips Financial Advisor",
  description: "An AI financial chat based advisor",
};

/** Applies the saved theme before first paint to avoid a light-mode flash. */
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('${THEME_KEY}') || 'system';
    var dark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
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
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          <SettingsProvider>
            <ChatProvider>{children}</ChatProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
