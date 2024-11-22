"use client";
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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { JSX, SVGProps } from "react";

export default function InvoiceBuilder() {
  return (
    <Card className="w-full max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
      <CardHeader>
        <CardTitle>Generate Invoice</CardTitle>
        <CardDescription>
          Fill out the form to create a new invoice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Acme Inc." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-address">Company Address</Label>
              <Textarea
                id="company-address"
                placeholder="123 Main St, Anytown USA"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input id="invoice-number" type="number" placeholder="123" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoice-date">Invoice Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Select date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Select date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tax-rate">Tax Rate</Label>
                <Input id="tax-rate" type="number" placeholder="10" />
              </div>
            </div>
          </div>
          <div className="col-span-full">
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
                    <Input placeholder="Product or service" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="1" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="$0.00" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="$0.00" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Input placeholder="Product or service" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="1" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="$0.00" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="$0.00" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="grid gap-4 mt-4">
              <div className="flex items-center justify-between">
                <Label>Subtotal</Label>
                <div className="font-medium">$0.00</div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Tax</Label>
                <div className="font-medium">$0.00</div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-medium">Total Due</Label>
                <div className="font-medium">$0.00</div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="ml-auto"
        >
          Generate Invoice
        </Button>
      </CardFooter>
    </Card>
  );
}

function CalendarIcon(
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
