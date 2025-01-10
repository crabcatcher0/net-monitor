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
        const response = await fetch("http://127.0.0.1:8001/scan-result/");
        if (!response.ok) {
          throw new Error("Failed to fetch scan results");
        }
        const data = await response.json();
  
        if (data.result && Array.isArray(data.result.ip_and_mac)) {
          const parsedResults = data.result.ip_and_mac.map((entry: string) => {
            const match = entry.match(/IP:\s([\d.]+)\sMac:\s([\w:]+)\s\((.+)?\)/);
            return match
              ? {
                  ip: match[1],
                  mac: match[2],
                  vendor: match[3] || "Unknown",
                }
              : { ip: "Unknown", mac: "Unknown", vendor: "Unknown" };
          });
          setScanResults(parsedResults);
        } else {
          setScanResults([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
