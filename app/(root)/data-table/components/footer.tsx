import Link from "next/link";
import { ModeToggle } from "./toggle-mode";

export function Footer() {
  return (
    <footer className="relative flex items-center justify-center">
      <Link href="/">Início</Link>
      <span className="mx-2">·</span>
      <Link href="/faturacao-automatica">Faturaçao Automática</Link>
      <span className="mx-2">·</span>
      <Link href="/alteracoes-contratos">Alterações a Contratos</Link>
      <span className="mx-2">·</span>
      <Link href="/rossum">Validaçao de Faturas (Rossum)</Link>
      <div className="absolute right-0">
        <ModeToggle />
      </div>
    </footer>
  );
}
