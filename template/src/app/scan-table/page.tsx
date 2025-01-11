import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PerformScan from "../perform-scan/page";

export default function ScanTable() {
  const [scanResults, setScanResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://127.0.0.1:8001/scan-result/");
        if (!response.ok) {
          throw new Error("Failed to fetch scan results");
        }
        const data = await response.json();

        if (data.result && Array.isArray(data.result.ip_list) && Array.isArray(data.result.mac_list)) {
          const ipList = data.result.ip_list;
          const macList = data.result.mac_list;

          const parsedResults = ipList.map((ip, index) => ({
            ip,
            mac: macList[index]?.split(" ")[0] || "Unknown",
            vendor: macList[index]?.match(/\((.+?)\)/)?.[1] || "Unknown",
          }));

          setScanResults(parsedResults);
        } else {
          setScanResults([]);
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <PerformScan />
      {scanResults.length === 0 ? (
        <p className="mt-5 text-sm">Please scan the network to view devices.</p>
      ) : (
        <Table className="mt-5">
          <TableCaption>List of devices connected to your network.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>MAC Address</TableHead>
              <TableHead>Vendor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scanResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{result.ip}</TableCell>
                <TableCell>{result.mac}</TableCell>
                <TableCell>{result.vendor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
