import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

export default function Invoicer() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Orders</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Orders</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Package className="h-5 w-5" />
                <span className="sr-only">Products</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Products</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Customers</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Customers</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LineChart className="h-5 w-5" />
                <span className="sr-only">Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside> */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet> */}
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">FINANCEIRO</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Invoicer</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/icons/trust_user.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>A minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Definições</DropdownMenuItem>
              <DropdownMenuItem>Ajuda</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card
                className="bg-white sm:col-span-2"
                x-chunk="dashboard-05-chunk-0 "
              >
                <CardHeader className="pb-3">
                  <CardTitle>Invoicer</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Emitir fatura manualmente...
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button>Criar Fatura</Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1" className=" bg-white">
                <CardHeader className="pb-2">
                  <CardDescription>Esta Semana</CardDescription>
                  <CardTitle className="text-4xl">$1,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +25% face à semana anterior
                    <Progress
                      value={25}
                      aria-label="25% increase"
                      className="bg-gray-200"
                    />
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
              <Card className=" bg-white" x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>Este Mês</CardDescription>
                  <CardTitle className="text-4xl">$5,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% face ao mês anterior
                    <Progress
                      value={12}
                      aria-label="12% increase"
                      className="bg-gray-200"
                    />
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </div>
            <Tabs defaultValue="week">
              <div className="flex items-center text-xs ">
                <TabsList>
                  <TabsTrigger className="text-xs bg-white" value="week">
                    Semana
                  </TabsTrigger>
                  <TabsTrigger className="text-xs bg-white" value="month">
                    Mês
                  </TabsTrigger>
                  <TabsTrigger className="text-xs bg-white" value="year">
                    Ano
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-xs  bg-white"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="text-xs sr-only sm:not-sr-only">
                          Filtrar
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Emitidas
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Recusadas
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Creditadas
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm  bg-white"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only ">Exportar</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="week">
                <Card
                  className=" bg-white"
                  x-chunk="dashboard-05-chunk-3 text-xs"
                >
                  <CardHeader className="px-7 text-xs">
                    <CardTitle>Faturação</CardTitle>
                    <CardDescription>
                      Últimas faturas emitidas...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="text-xs">
                          <TableHead className="text-xs">Cliente</TableHead>
                          <TableHead className="hidden text-xs sm:table-cell">
                            Tipo
                          </TableHead>
                          <TableHead className="hidden text-xs sm:table-cell">
                            Estado
                          </TableHead>
                          <TableHead className="hidden text-xs md:table-cell">
                            Data
                          </TableHead>
                          <TableHead className="text-right text-xs">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-accent text-xs">
                          <TableCell>
                            <div className="font-medium text-xs">
                              Manuel Miranda
                            </div>
                            <div className="hidden text-xs text-muted-foreground md:inline">
                              manuel.miranda@exemplo.pt
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            Fatura (Venda)
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              Regularizada
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-xs md:table-cell">
                            2024-06-23
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            $250.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium text-xs">
                              Patrícia Teixeira
                            </div>
                            <div className="hidden text-xs text-muted-foreground md:inline">
                              patricia.teixeira@exemplo.pt
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            Nota de Crédito
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            <Badge className="text-xs" variant="outline">
                              Recusada
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            2024-06-24
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            $150.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium text-xs">
                              Sergio Castro
                            </div>
                            <div className="hidden text-xs text-muted-foreground md:inline">
                              sergio.castro@examplo.pt
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            Fatura (Compra)
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              Regularizada
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-xs md:table-cell">
                            2024-06-25
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            $350.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium text-xs">
                              Gabriela Souto
                            </div>
                            <div className="hidden text-xs text-muted-foreground md:inline">
                              gabriela.souto@exemplo.pt
                            </div>
                          </TableCell>
                          <TableCell className="hidden  text-xs sm:table-cell">
                            Fatura (Compra)
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              Regularizada
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-xs md:table-cell">
                            20243-06-26
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            $450.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium text-xs">
                              Liam Johnson
                            </div>
                            <div className="hidden text-xs text-muted-foreground md:inline">
                              liam@example.com
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            Fatura (Venda)
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              Regularizada
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-xs md:table-cell">
                            2023-06-23
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            $250.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium text-xs ">
                              Liam Johnson
                            </div>
                            <div className="hidden text-xs text-muted-foreground md:inline">
                              liam@example.com
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            Fatura (Venda)
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              Regularizada
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-xs md:table-cell">
                            2023-06-23
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            $250.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium text-xs">
                              Olivia Smith
                            </div>
                            <div className="hidden text-xs text-muted-foreground md:inline">
                              olivia@example.com
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            Fatura (Venda)
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            <Badge className="text-xs" variant="outline">
                              Recusada
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-xs md:table-cell">
                            2023-06-24
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            $150.00
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium text-xs">
                              Emma Brown
                            </div>
                            <div className="hidden text-xs text-muted-foreground md:inline">
                              emma@example.com
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            Fatura - (Venda)
                          </TableCell>
                          <TableCell className="hidden text-xs sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              Regularizada
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-xs md:table-cell">
                            2023-06-26
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            $450.00
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card
              className="overflow-hidden  bg-white"
              x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row text-xs items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex text-xs items-center gap-2">
                    Fatura Nº FT 2024A41/7349
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 text-xs transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copiar Nº Fatura</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Data: Novembro 23, 2024</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Seguir Fatura
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Exportar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Detalhes da Fatura</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Glimmer Lamps x <span>2</span>
                      </span>
                      <span>$250.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Aqua Filters x <span>1</span>
                      </span>
                      <span>$49.00</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>$299.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Envio</span>
                      <span>$5.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Imposto</span>
                      <span>$25.00</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>$329.00</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Informações de Envio</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>Manuel Miranda</span>
                      <span>Rua António Gomes Soares Pereira</span>
                      <span>nº94, 5º Dto Poente, 4470-139 Maia</span>
                    </address>
                  </div>
                  <div className="grid auto-rows-max gap-3">
                    <div className="font-semibold">
                      Informações de Faturação
                    </div>
                    <div className="text-muted-foreground">
                      O mesmo que o endereço de envio.
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Informação do Cliete</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Cliente</dt>
                      <dd>Manuel Miranda</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href="mailto:">manuel.miranda@exemplo.pt</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Telefone</dt>
                      <dd>
                        <a href="tel:">+351 916 567 890</a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Informações de Pagamento</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        Visa
                      </dt>
                      <dd>**** **** **** 4532</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Atualizada em{" "}
                  <time dateTime="2023-11-23">Novembro 23, 2024</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Fatura Anterior</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Próxima Fatura</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
