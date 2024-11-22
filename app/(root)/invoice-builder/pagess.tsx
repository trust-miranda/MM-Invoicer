import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function InvoiceForm() {
  return (
    <Card className="w-full max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Invoice Generator</CardTitle>
        <CardDescription>
          Fill out the details below to generate an invoice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input id="customer-name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">Customer Email</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer-address">Address</Label>
              <Textarea
                id="customer-address"
                placeholder="123 Main St, Anytown USA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone</Label>
              <Input
                id="customer-phone"
                type="tel"
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="invoice-items">Invoice Items</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Input id="item-name-1" placeholder="Product Name" />
                    </TableCell>
                    <TableCell>
                      <Input
                        id="item-quantity-1"
                        type="number"
                        placeholder="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        id="item-price-1"
                        type="number"
                        placeholder="9.99"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">$9.99</div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Input id="item-name-2" placeholder="Service Name" />
                    </TableCell>
                    <TableCell>
                      <Input
                        id="item-quantity-2"
                        type="number"
                        placeholder="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        id="item-price-2"
                        type="number"
                        placeholder="49.99"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">$49.99</div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">$59.98</div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Tax (10%)
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">$5.99</div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">$65.97</div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button
                variant="outline"
                size="sm"
                className="justify-self-start"
              >
                Add Item
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit">Generate Invoice</Button>
      </CardFooter>
    </Card>
  );
}
