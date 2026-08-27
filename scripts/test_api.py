import urllib.request
import json
import time
import subprocess
import os
import sys

def test_backend():
    print("Testing Backend APIs...")
    base_url = "http://127.0.0.1:8000/api"
    
    endpoints = [
        "/health",
        "/summary",
        "/revenue-trend",
        "/outlet-performance",
        "/group-performance",
        "/order-type",
        "/top-products",
        "/settlement",
        "/orders?page=1&page_size=50",
        "/filters"
    ]

    for ep in endpoints:
        url = base_url + ep
        start = time.time()
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                elapsed = (time.time() - start) * 1000
                print(f"SUCCESS [{resp.status}] {ep:<35} in {elapsed:.1f}ms")
        except Exception as e:
            print(f"FAILED {ep}: {e}")

if __name__ == '__main__':
    test_backend()
