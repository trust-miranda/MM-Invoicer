import MobileNav from "@/components/ui/MobileNav";
import Sidebar from "@/components/ui/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { redirect } from "next/navigation";

const fontHeading = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect("/sign-in");

  return (
    <main className="flex h-screen w-full font-sans-serif">
      <Sidebar user={loggedIn} />
      <div className="flex flex-1 flex-col">
        <div className="root-layout flex items-center justify-between p-4">
          <Image src="/icons/logo.svg" width={30} height={30} alt="menu icon" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        <div
          className={cn(
            "antialiased flex-1 overflow-auto",
            fontHeading.variable,
            fontBody.variable
          )}
        >
          <TooltipProvider>{children}</TooltipProvider>
        </div>
      </div>
    </main>
  );
}
