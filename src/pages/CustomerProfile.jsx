import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "@/Config/SupabaseClient";

export default function CustomerProfile() {
  const { phoneNumber } = useParams();
  const [customerData, setCustomerData] = useState(null);

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
      }
    };
    fetchCustomerData();
  }, [phoneNumber]);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Customer Profile</h2>
      {customerData ? (
        // TODO : Fetch the invoices of customer to the table
        <div>
          <p>
            <strong>Name:</strong> {customerData.name}
          </p>
          <p>
            <strong>Phone:</strong> {customerData.phone}
          </p>
        </div>
      ) : (
        <p>Loading customer data...</p>
      )}
    </div>
  );
}
