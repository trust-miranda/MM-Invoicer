import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fatura AG_532406_0924</CardTitle>
        <CardDescription>2024-09-24</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Cliente</h3>
            <div className="space-y-1">
              <p>AGEAS PORTUGAL - COMPANHIA SEGUROS SA</p>
              <p>Avª. Mediterrâneo, nº 1 - Edifício Ageas - Parque Nações</p>
              <p>1990-156 LISBOA</p>
              <p>NIF: 503454109</p>
              <p>FT 2024A249/0924</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Invoice Details</h3>
            <Table>
              <p>Nome: FERNANDO JOAO ALMEIDA CARVALHO</p>
              <p>Nº Processo: 370291</p>
              <TableHeader>
                <TableRow>
                  <TableHead>Referência</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Id Requisição/Consulta</TableHead>
                  <TableHead>Data do Ato Médico</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>01.00.00.94</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>$100.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Product B</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>$200.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <div className="text-right">
                <p>Subtotal: $300.00</p>
                <p>Taxes: $30.00</p>
                <p className="font-semibold">Total: $330.00</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="ml-auto">
          Print
        </Button>
      </CardFooter>
    </Card>
  );
}
