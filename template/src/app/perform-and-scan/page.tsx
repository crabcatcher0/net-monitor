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
import { FileDown } from "lucide-react";


interface ScanResult {
  ip: string;
  mac: string;
  vendor: string;
}

export default function PerformScanGiveTable() {
  const [gatewayIp, setGatewayIp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [fetchingResults, setFetchingResults] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isValidIp = (ip: string): boolean => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}\/24$/;
    return ipRegex.test(ip);
  };

  const handleScan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidIp(gatewayIp)) {
      setMessage("Invalid IP address. example: 192.168.1.0/24.");
      return;
    }

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

      const data: { message: string } = await response.json();
      setMessage(data.message);

      fetchScanResults();
    } catch (error) {
      setMessage((error as Error).message || "An error occurred");
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

      const data: {
        result?: {
          ip_list: string[];
          mac_list: string[];
        };
      } = await response.json();

      if (data.result && Array.isArray(data.result.ip_list) && Array.isArray(data.result.mac_list)) {
        const ipList = data.result.ip_list;
        const macList = data.result.mac_list;

        const parsedResults: ScanResult[] = ipList.map((ip, index) => ({
          ip,
          mac: macList[index]?.split(" ")[0] || "Unknown",
          vendor: macList[index]?.match(/\((.+?)\)/)?.[1] || "Unknown",
        }));

        setScanResults(parsedResults);
      } else {
        setScanResults([]);
      }
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred");
    } finally {
      setFetchingResults(false);
    }
  };

  const downloadResults = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8001/save-scan-result/");
      if (!response.ok) {
        throw new Error("Failed to download the scan results. Please try again.");
      }

      const blob = await response.blob();
      const anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(blob);
      anchor.download = "scan-result.csv";
      anchor.click();
      URL.revokeObjectURL(anchor.href);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="p-4">
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

      {message && <p className="mt-4 text-sm text-green-800">{message}</p>}

      {fetchingResults ? (
        <p className="mt-5 text-sm">Fetching scan results...</p>
      ) : scanResults.length === 0 ? (
        <p className="mt-5 text-sm">Please scan the network to view devices.</p>
      ) : (
        <>
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
          <div className="mt-2">
          <Button onClick={downloadResults} 
            className="flex items-center space-x-1
             text-black bg-transparent 
             hover:bg-gray-200 focus:bg-transparent">
            <FileDown className="w-5 h-5" />
            <span>Download results</span>
          </Button>
          </div>
        </>
      )}
    </div>
  );
}
