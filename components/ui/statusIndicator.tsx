import { JSX, SVGProps } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

<Card className="w-full">
  <CardHeader>
    <CardTitle>Alertas PHC</CardTitle>
  </CardHeader>
  <CardContent className="flex flex-col space-y-4">
    <div className="flex items-center space-x-2">
      <CircleIcon className="w-4 h-4 text-green-500" />
      <span>Alertas de Motores: Ok</span>
    </div>
    <div className="flex items-center space-x-2">
      <CircleIcon className="w-4 h-4 text-red-500" />
      <span>Alerta Criação de APs: Erro</span>
    </div>
    <div className="flex items-center space-x-2">
      <CircleIcon className="w-4 h-4 text-green-500" />
      <span>WebService PHC: Ok</span>
    </div>
  </CardContent>
</Card>;

function CircleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
