import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function ScanCompleteAlert() {
  return (
    <Alert className="border-none mt-2 mb-2">
      <Terminal />
      <AlertTitle className="text-green-600">2025-01-7 | 09:21</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  )
}
