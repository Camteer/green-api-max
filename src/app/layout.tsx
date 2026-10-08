import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAX",
  description: "Ультра ультима пак макс++9000, все тут будем",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full`}
		>
			<body className="relative z-1 w-full min-h-full bg-cover bg-no-repeat bg-right flex flex-col">
				{children}
			</body>
		</html>
	);
}
