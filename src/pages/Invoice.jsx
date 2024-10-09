import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import supabase from "@/Config/SupabaseClient";

export default function Invoice() {
  const [packages, setPackages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPackages, setSelectedPackages] = useState([
    { id: "", price: "" },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch packages
        const { data: packageData, error: packageError } = await supabase
          .from("packages")
          .select("*");
        if (packageError)
          console.error("Error fetching packages:", packageError.message);
        else setPackages(packageData || []);

        // Fetch customers
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*");
        if (customerError)
          console.error("Error fetching customers:", customerError.message);
        else setCustomers(customerData || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle customer selection
  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
  };

  // Handle package selection
  const handlePackageSelect = (index, packageId) => {
    const selectedPackage = packages.find((pack) => pack.id === packageId);
    const updatedPackages = [...selectedPackages];
    updatedPackages[index] = selectedPackage
      ? { id: packageId, price: selectedPackage.price }
      : { id: "", price: "" };
    setSelectedPackages(updatedPackages);
  };

  // Add another package input
  const addPackage = () => {
    setSelectedPackages([...selectedPackages, { id: "", price: "" }]);
  };

  // Remove selected package input
  const removePackage = (index) => {
    setSelectedPackages(selectedPackages.filter((_, i) => i !== index));
  };

  // Calculate total amount whenever selected packages change
  useEffect(() => {
    const total = selectedPackages.reduce(
      (sum, pkg) => sum + parseFloat(pkg.price || 0),
      0
    );
    setTotalAmount(total);
  }, [selectedPackages]);

  const handleSubmit = async () => {
    if (!selectedCustomer || selectedPackages.length === 0) {
      alert("Please select a customer and at least one package.");
      return;
    }

    try {
      // Insert into invoices table
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert([
          {
            customer_id: selectedCustomer,
            amount: totalAmount,
            payment_status: paymentStatus,
          },
        ])
        .select();

      if (invoiceError) throw invoiceError;

      const invoiceId = invoiceData[0].id;

      // Insert each package into invoice_packages table
      const invoicePackagesData = selectedPackages.map((pkg) => ({
        invoice_id: invoiceId,
        package_id: pkg.id,
        package_price: pkg.price,
      }));

      const { error: invoicePackagesError } = await supabase
        .from("invoice_packages")
        .insert(invoicePackagesData);

      if (invoicePackagesError) throw invoicePackagesError;

      alert("Invoice created successfully!");

      // Reset form
      setSelectedCustomer("");
      setSelectedPackages([{ id: "", price: "" }]);
      setTotalAmount(0);
      setPaymentStatus(false); // Reset payment status
    } catch (error) {
      console.error("Error creating invoice:", error.message);
    }
  };

  // TODO :  Write the Unpaid Logic

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl">Create New Invoice</CardTitle>
        <CardDescription>
          Select the customer and packages below
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="grid gap-4">
          {/* Customer Selection */}
          <div className="w-full">
            <Label htmlFor="customer">Select Customer</Label>
            <Select
              onValueChange={handleCustomerSelect}
              defaultValue={selectedCustomer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Customers</SelectLabel>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Package Selection */}
          {selectedPackages.map((pkg, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-end space-y-2 sm:space-y-0 sm:space-x-2"
            >
              <div className="w-full sm:flex-grow">
                <Label htmlFor={`package-${index}`}>Select Package</Label>
                <Select
                  onValueChange={(value) => handlePackageSelect(index, value)}
                  defaultValue={pkg.id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Packages</SelectLabel>
                      {packages.map((pack) => (
                        <SelectItem key={pack.id} value={pack.id}>
                          {pack.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-24">
                <Label htmlFor={`price-${index}`}>Price</Label>
                <Input
                  id={`price-${index}`}
                  type="text"
                  placeholder="Price"
                  value={pkg.price}
                  readOnly
                />
              </div>
              <Button
                type="button"
                onClick={() => removePackage(index)}
                className="w-full bg-red-500 hover:bg-red-400 sm:w-auto mt-2 sm:mt-0"
              >
                Remove
              </Button>
            </div>
          ))}

          <Button type="button" onClick={addPackage} className="w-full mt-2">
            Add Another Package
          </Button>

          {/* Total Amount */}
          <div className="flex justify-between items-center">
            <Label>Total Amount</Label>
            <span className="text-lg font-bold">{`$${totalAmount.toFixed(
              2
            )}`}</span>
          </div>

          <RadioGroup
            value={paymentStatus ? "received" : "not_received"}
            onValueChange={(value) => setPaymentStatus(value === "received")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="received" id="r1" />
              <Label htmlFor="r1">Payment Received</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not_received" id="r2" />
              <Label htmlFor="r2">Payment Not Received</Label>
            </div>
          </RadioGroup>

          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-emerald-500 hover:bg-emerald-400 mt-4"
          >
            Create Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
