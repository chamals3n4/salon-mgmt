import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "@/Config/SupabaseClient";
export default function Overview() {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPackages() {
      try {
        const { data, error } = await supabase.from("overview").select("*");

        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setOverviewData(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const { total_revenue, daily_revenue, number_of_customers } =
    overviewData || {};

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4 p-8  md:gap-8 lg:grid-cols-4">
        <Link to="/dashboard/invoice">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {/* <CardTitle className="text-sm font-medium">Total Revenue</CardTitle> */}
              <DollarSign className=" h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Create Invoice</div>
            </CardContent>
          </Card>
        </Link>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {total_revenue ? `$${total_revenue.toLocaleString()}` : "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {number_of_customers || "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daily_revenue ? `+${daily_revenue.toLocaleString()}` : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
