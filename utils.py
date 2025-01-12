from datetime import datetime
import subprocess
import re
import csv


def scan_network(gateway_ip: str):
    try:
        # -sn no port scan
        command: list[str] = ["pkexec", "nmap", gateway_ip, "-n", "-sn"]

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


def convert_to_csv():
    try:
        scan_result = extract_ip_and_mac()

        ip_list = scan_result["ip_list"]
        mac_list = scan_result["mac_list"]

        if len(ip_list) != len(mac_list):
            raise ValueError("Error creating csv file.")

        data = list(zip(ip_list, mac_list))

        now = datetime.now()
        dt_string = now.strftime("%Y/%m/%d %H:%M")

        file_path = "scan-result.csv"
        with open(file_path, "w", newline="") as out_file:
            writer = csv.writer(out_file)
            writer.writerow(["IP Address", "MAC Address"])
            writer.writerows(data)
            writer.writerow([f"Scan date and time: {dt_string}"])
        return file_path

    except Exception as e:

        return f"Error: {str(e)}"
