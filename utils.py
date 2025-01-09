import os
import re


def scan_network(gateway_ip: str):
    try:
        print("Scanning the network....")
        nmap_scan = os.popen(f"sudo nmap {gateway_ip} -n -sP").read()

        with open("scan_result.txt", "w") as file:
            file.write(nmap_scan)

    except Exception as e:
        return f"Error: {str(e)}"


def extract_ip_and_mac():
    ip_pattern = r"Nmap scan report for (\b(?:\d{1,3}\.){3}\d{1,3}\b)"
    mac_pattern = r"MAC Address: ([0-9A-Fa-f:]+)(?: \((.*?)\))?"
    try:
        with open("scan_result.txt", "r") as scan_result:
            data = scan_result.readlines()

        results: list[str] = []
        unmatched_ips: set[str] = set()

        current_ip = None

        for line in data:
            ip_match = re.search(ip_pattern, line)
            if ip_match:
                current_ip = ip_match.group(1)
                unmatched_ips.add(current_ip)

            mac_match = re.search(mac_pattern, line)
            if mac_match and current_ip:
                mac_address = mac_match.group(1)
                vendor = mac_match.group(2) or "Unknown"
                results.append(f"IP: {current_ip} Mac: {mac_address} ({vendor})")
                unmatched_ips.discard(current_ip)
                current_ip = None

        for ip in unmatched_ips:
            results.append(f"IP: {ip} Mac: Unknown (Vendor: Unknown)")

        return {"ip_and_mac": results}

    except FileNotFoundError:
        return "[!] Please perform a scan first."


def remove_scan_result():
    file_path = "scan_result.txt"
    if os.path.exists(file_path):
        os.remove(file_path)
        print("Successfully cleared logs")
    else:
        print("[!] File not found")
