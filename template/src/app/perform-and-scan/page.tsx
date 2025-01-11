import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PerformScanGiveTable() {
  const [gatewayIp, setGatewayIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [scanResults, setScanResults] = useState([]);
  const [fetchingResults, setFetchingResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8001/scan/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          network_gateway: gatewayIp,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to perform the scan");
      }

      const data = await response.json();
      setMessage(data.message);

      fetchScanResults();
    } catch (error: any) {
      setMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchScanResults = async () => {
    setFetchingResults(true);
    setError(null);

    try {
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
      setFetchingResults(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Scan the Network</h2>
      <form onSubmit={handleScan}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="gateway_ip">Router Gateway (e.g. 192.168.1.0/24)</Label>
            <Input
              id="gateway_ip"
              placeholder="IP address of your router e.g, 192.168.1.0/24"
              value={gatewayIp}
              onChange={(e) => setGatewayIp(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Scanning..." : "Perform Scan"}
          </Button>
        </div>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}

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
