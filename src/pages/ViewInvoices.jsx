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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function ViewInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false); // Store the payment status of the selected invoice

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

  // Handle updating the payment status in the database
  const handleUpdate = async () => {
    try {
      if (selectedInvoice) {
        const { data, error } = await supabase
          .from("invoices")
          .update({ payment_status: paymentStatus }) // Update the payment status
          .eq("id", selectedInvoice.id);

        if (error) throw error;

        // Update the local state
        const updatedInvoices = invoices.map((invoice) =>
          invoice.id === selectedInvoice.id
            ? { ...invoice, payment_status: paymentStatus }
            : invoice
        );
        setInvoices(updatedInvoices);
        setOpen(false); // Close the dialog
      }
    } catch (error) {
      console.error("Error updating invoice:", error.message);
    }
  };

  // Toggle the dialog with the selected invoice
  const openDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentStatus(invoice.payment_status); // Set the initial switch state
    setOpen(true);
  };

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
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <button onClick={() => openDialog(invoice)}>
                        {invoice.payment_status ? "Paid" : "Unpaid"}
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit the Payment Status</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center space-x-4">
                        <span>Unpaid</span>
                        <Switch
                          checked={paymentStatus}
                          onCheckedChange={(checked) =>
                            setPaymentStatus(checked)
                          }
                        />
                        <span>Paid</span>
                      </div>
                      <button
                        onClick={handleUpdate}
                        className="mt-4 p-2 bg-blue-500 text-white rounded"
                      >
                        Save
                      </button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
