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
    template: "%s | Todoriko"
  },
  description:
    "Todoriko is the best todo list and task management app. Organize your daily tasks, boost productivity, and never miss deadlines with Todoriko's smart features. Free todo list app for personal and work use.",
  keywords:
    "Todoriko, todoriko app, todo list, to do list, to-do list, task management, productivity app, todo app, best todo list app, task organizer, schedule planner, task tracker, daily planner, checklist app, work organizer, project management, time management, personal organizer, productivity tool, task scheduling, reminder app, goal tracker, task list, digital planner, work planning, task reminder, productivity suite, list maker, task manager, organize tasks, daily tasks, work tasks, personal tasks, free todo app",

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
    default: "TodoRiko - Smart Todo List & Task Management App",
    template: "%s | TodoRiko",
  },
  description:
    "TodoRiko is a powerful and intuitive todo list and task management application. Organize your tasks, boost productivity, and never miss a deadline with our smart scheduling features.",
  keywords:
    "todo list, todoriko, to do list, to-do list, task management, productivity app, todo app, task organizer, schedule planner, TodoRiko, task tracker, daily planner, checklist app, work organizer, project management, time management, personal organizer, productivity tool, task scheduling, reminder app, goal tracker, task list, digital planner, work planning, task reminder, productivity suite, list maker, task manager, organize tasks, daily tasks, work tasks, personal tasks",
  authors: [{ name: "TodoRiko Team" }],
  creator: "TodoRiko",
  publisher: "TodoRiko",
  metadataBase: new URL("https://todoriko.xyz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TodoRiko - Smart Todo List & Task Management App",
    description:
      "Organize your tasks, boost productivity, and never miss a deadline with TodoRiko's smart scheduling features.",
    url: "https://todoriko.xyz",
    siteName: "TodoRiko",
    images: [
      {
        url: "/todorik.svg",
        width: 800,
        height: 600,
        alt: "TodoRiko Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TodoRiko - Smart Todo List & Task Management App",
    description:
      "Organize your tasks, boost productivity, and never miss a deadline with TodoRiko's smart scheduling features.",
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
