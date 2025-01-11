import subprocess
import re


def scan_network(gateway_ip: str):
    try:
        command: list[str] = ["pkexec", "nmap", gateway_ip, "-n", "-sP"]

        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        if result.returncode != 0:
            raise RuntimeError(f"Error running nmap: {result.stderr}")

        with open("scan_result.txt", "w") as file:
            file.write(result.stdout)

    except Exception as e:
        print(f"Error: {str(e)}")


def extract_ip_and_mac():
    ip_pattern = r"Nmap scan report for (\b(?:\d{1,3}\.){3}\d{1,3}\b)"
    mac_pattern = r"MAC Address: ([0-9A-Fa-f:]+)(?: \((.*?)\))?"
    try:
        with open("scan_result.txt", "r") as scan_result:
            data = scan_result.readlines()

        ip_list: list[str] = []
        mac_list: list[str] = []

        unmatched_ips: set[str] = set()
        current_ip = None

        for line in data:
            ip_match = re.search(ip_pattern, line)
            if ip_match:
                current_ip = ip_match.group(1)
                unmatched_ips.add(current_ip)
                ip_list.append(current_ip)
                mac_list.append("Unknown")

            mac_match = re.search(mac_pattern, line)
            if mac_match and current_ip:
                mac_address = mac_match.group(1)
                vendor = mac_match.group(2) or "Unknown"
                mac_list[ip_list.index(current_ip)] = f"{mac_address} ({vendor})"
                unmatched_ips.discard(current_ip)
                current_ip = None

        return {"ip_list": ip_list, "mac_list": mac_list}

    except FileNotFoundError:
        return "[!] Please perform a scan first."
