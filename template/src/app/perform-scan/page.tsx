import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PerformScan() {
  const [gatewayIp, setGatewayIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

      if (data.message === "Network scan completed.") {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Scan the Network</h2>
      <form onSubmit={handleScan}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="gateway_ip">Router Gateway (e.g.   192.168.1.0/24)</Label>
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
    </div>
  );
}
