import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";
import ClientLayout from "./ClientLayout";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: {
    default: "Todoriko - Best Todo List & Task Management App",
    template: "%s | Todoriko",
  },
  description:
    "Todoriko is the best todo list and task management app. Organize your daily tasks, boost productivity, and never miss deadlines with Todoriko's smart features. Free todo list app for personal and work use.",
  keywords:
    "Todoriko, todoriko app, todo list, to do list, to-do list, task management, productivity app, todo app, best todo list app, task organizer, schedule planner, task tracker, daily planner, checklist app, work organizer, project management, time management, personal organizer, productivity tool, task scheduling, reminder app, goal tracker, task list, digital planner, work planning, task reminder, productivity suite, list maker, task manager, organize tasks, daily tasks, work tasks, personal tasks, free todo app",
  authors: [{ name: "Todoriko Team" }],
  creator: "Todoriko",
  publisher: "Todoriko",
  metadataBase: new URL("https://todoriko.xyz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Todoriko - Best Todo List & Task Management App",
    description:
      "Todoriko is the best todo list and task management app. Organize your daily tasks, boost productivity, and never miss deadlines with Todoriko's smart features.",
    url: "https://todoriko.xyz",
    siteName: "Todoriko",
    images: [
      {
        url: "/todorik.svg",
        width: 800,
        height: 600,
        alt: "Todoriko Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todoriko - Best Todo List & Task Management App",
    description:
      "Todoriko is the best todo list and task management app. Organize your daily tasks, boost productivity, and never miss deadlines with Todoriko's smart features.",
    creator: "@todoriko",
    images: ["/todorik.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/todorik.svg",
    shortcut: "/todorik.svg",
    apple: "/todorik.svg",
  },
  manifest: "/manifest.json",
  themeColor: "#f67011",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClientLayout montserrat={montserrat} poppins={poppins}>
        {children}
      </ClientLayout>
    </html>
  );
}
