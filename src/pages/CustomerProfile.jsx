import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "@/Config/SupabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import VerifyImg from "../assets/images/verify.png";

export default function CustomerProfile() {
  const { phoneNumber } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [image, setImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("phone", phoneNumber)
        .single();

      if (error) {
        console.error("Error fetching customer data:", error.message);
      } else {
        setCustomerData(data);
        fetchCustomerInvoices(data.id);
      }
    };
    fetchCustomerData();
  }, [phoneNumber]);

  // Fetch invoices related to the customer
  const fetchCustomerInvoices = async (customerId) => {
    try {
      setLoadingInvoices(true);
      const { data, error } = await supabase
        .from("invoices")
        .select("id, amount, date, payment_status")
        .eq("customer_id", customerId)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching invoices:", error.message);
      } else {
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoadingInvoices(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    setUploadStatus("");
    if (!image) {
      setUploadStatus("Please select an image to upload.");
      return;
    }

    try {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("customer-images")
        .upload(`images/${fileName}`, image);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("customer-images")
        .getPublicUrl(`images/${fileName}`);

      const { error: updateError } = await supabase
        .from("customers")
        .update({ profile_image_url: urlData.publicUrl })
        .eq("id", customerData.id);

      if (updateError) throw updateError;

      setCustomerData({
        ...customerData,
        profile_image_url: urlData.publicUrl,
      });
      setUploadStatus("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setUploadStatus("Error uploading image. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {customerData ? (
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage
                  src={customerData.profile_image_url}
                  alt={customerData.name}
                />
                <AvatarFallback>{customerData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile Info */}
          <Card className="mt-16 text-center">
            <CardHeader>
              <CardTitle className="flex justify-center items-center space-x-2">
                <span className="text-2xl font-bold">{customerData.name}</span>
                <img src={VerifyImg} alt="Verified" className="h-6 w-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-600">{customerData.phone}</p>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Update Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="flex-grow"
                />
                <Button
                  onClick={handleImageUpload}
                  className="flex items-center space-x-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
              </div>
              {uploadStatus && (
                <Alert>
                  <AlertDescription>{uploadStatus}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingInvoices ? (
                <p>Loading invoices...</p>
              ) : invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
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
                          <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                invoice.payment_status
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {invoice.payment_status ? "Paid" : "Unpaid"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>No invoices found for this customer.</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading customer data...</p>
        </div>
      )}
    </div>
  );
}
