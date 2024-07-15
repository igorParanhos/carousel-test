import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// core styles are required for all packages
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

// other css files are required only if
// you are using components from the corresponding package
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  primaryColor: "teal",
});

export const metadata: Metadata = {
  title: "Carouselpp",
  description: "Carousel test app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
