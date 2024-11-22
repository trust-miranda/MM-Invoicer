import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";

export default function Configurator() {
  return (
    <div className="flex flex-col text-xs w-[400px] min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          <span className="text-sm font-semibold">Configurador</span>
        </div>
      </header>
      <main className="flex flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="text-xs">
            <CardHeader>
              <CardTitle className="text-sm">Definições Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label className="text-xs" htmlFor="notifications">
                  Enable Notifications
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch id="dark-mode" />
                <Label className="text-xs" htmlFor="dark-mode">
                  Dark Mode
                </Label>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Definições Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <Input placeholder="Username" className="mb-4 text-xs" />
                <Input
                  placeholder="Email"
                  className="mb-4 text-xs"
                  type="email"
                />
                <Input
                  placeholder="Password"
                  className="text-xs"
                  type="password"
                />
              </form>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button>Aplicar</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Definições Requisições</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch id="public-account" />
                <Label className="text-xs" htmlFor="public-account">
                  Public Account
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch id="data-sharing" />
                <Label className="text-xs" htmlFor="data-sharing">
                  Allow Data Sharing
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SettingsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
