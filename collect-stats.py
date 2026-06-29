import psutil, json, time, subprocess
from pathlib import Path

OUTPUT_PATH = Path('/home/edmr/dashboard/public/homelab-stats.json')

def get_temp():
    try:
        temps = psutil.sensors_temperatures()
        for key in ['coretemp', 'cpu_thermal', 'k10temp', 'acpitz']:
            if key in temps and temps[key]:
                return round(temps[key][0].current, 1)
    except:
        pass
    try:
        result = subprocess.run(
            ['cat', '/sys/class/thermal/thermal_zone0/temp'],
            capture_output=True, text=True
        )
        return round(int(result.stdout.strip()) / 1000, 1)
    except:
        return None

def collect():
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    net = psutil.net_io_counters()
    uptime_seconds = time.time() - psutil.boot_time()
    uptime_hours = round(uptime_seconds / 3600, 1)

    try:
        result = subprocess.run(
            ['docker', 'ps', '--format', '{{.Names}}|{{.Status}}'],
            capture_output=True, text=True
        )
        services = {}
        for line in result.stdout.strip().split('\n'):
            if '|' in line:
                name, status = line.split('|', 1)
                services[name] = 'running' if 'Up' in status else 'stopped'
    except:
        services = {}

    stats = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "cpu_percent": cpu,
        "temperature_c": get_temp(),
        "ram": {
            "total_gb": round(ram.total / 1e9, 1),
            "used_gb": round(ram.used / 1e9, 1),
            "percent": ram.percent
        },
        "disk": {
            "total_gb": round(disk.total / 1e9, 1),
            "used_gb": round(disk.used / 1e9, 1),
            "percent": disk.percent
        },
        "network": {
            "bytes_sent_mb": round(net.bytes_sent / 1e6, 1),
            "bytes_recv_mb": round(net.bytes_recv / 1e6, 1)
        },
        "uptime_hours": uptime_hours,
        "services": services
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(stats, indent=2, ensure_ascii=True),
        encoding='utf-8'
    )
    print(f"[{stats['timestamp']}] Stats updated ✓")

if __name__ == '__main__':
    while True:
        collect()
        time.sleep(10)
