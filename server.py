#!/usr/bin/env python3
"""Simple dev server for Vaaniai. Run: python3 server.py"""
import http.server, socketserver, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    def log_message(self, format, *args):
        print(f"  {args[0]} {args[1]}")

print(f"\n  Vaaniai running at http://localhost:{PORT}")
print(f"  Open in Chrome or Edge for voice features\n")
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
