import { useEffect, useState } from "react";
import supabase from "@/Config/SupabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ViewInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("invoices")
        .select(
          `
          id,
          amount,
          date,
          payment_status,
          customers(name)
        `
        )
        .order("date", { ascending: false });

      if (error) throw error;

      if (data) {
        setInvoices(
          data.map((invoice) => ({
            ...invoice,
            customer_name: invoice.customers.name,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>
      {loading ? (
        <p>Loading invoices...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  {new Date(invoice.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{invoice.customer_name}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {invoice.payment_status ? "Paid" : "Unpaid"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
