import { Lamp } from "@/components/ui/Lamp";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-sans-serif">
      {children}
      <div className="auth-asset">
        <div>
          <Lamp />
        </div>
      </div>
    </main>
  );
}
