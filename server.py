import http.server
import os
import shutil
from pathlib import Path

DIST = '/home/edmr/dashboard/dist'
PUBLIC = '/home/edmr/dashboard/public'

class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Si piden el JSON, copiarlo fresco desde public/ antes de servir
        if self.path == '/homelab-stats.json':
            src = Path(PUBLIC) / 'homelab-stats.json'
            dst = Path(DIST) / 'homelab-stats.json'
            if src.exists():
                shutil.copy(src, dst)
        super().do_GET()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, *args):
        pass

os.chdir(DIST)
httpd = http.server.HTTPServer(('0.0.0.0', 8765), CORSHandler)
print('Servidor corriendo en :8765')
httpd.serve_forever()