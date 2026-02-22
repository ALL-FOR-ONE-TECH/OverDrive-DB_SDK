"""
Helper to download the OverDrive native binary from GitHub Releases.

Usage:
    python -m overdrive.download

Or in code:
    from overdrive.download import ensure_binary
    ensure_binary()
"""

import os
import platform
import sys
import urllib.request
from pathlib import Path

REPO = "ALL-FOR-ONE-TECH/OverDrive-DB_SDK"
VERSION = "v1.0.1"


def get_binary_info():
    """Get the correct binary name for the current platform."""
    system = platform.system()
    if system == "Windows":
        return "overdrive-windows-x64.dll", "overdrive.dll"
    elif system == "Darwin":
        return "liboverdrive-macos-arm64.dylib", "liboverdrive.dylib"
    else:
        return "liboverdrive-linux-x64.so", "liboverdrive.so"


def ensure_binary(target_dir: str = None) -> str:
    """
    Download the native binary if not already present.
    
    Args:
        target_dir: Directory to place the binary. Defaults to package directory.
    
    Returns:
        Path to the binary.
    """
    remote_name, local_name = get_binary_info()

    if target_dir is None:
        target_dir = str(Path(__file__).parent)

    dest = os.path.join(target_dir, local_name)

    if os.path.exists(dest):
        print(f"✓ overdrive: Binary already present ({local_name})")
        return dest

    url = f"https://github.com/{REPO}/releases/download/{VERSION}/{remote_name}"
    print(f"⬇ overdrive: Downloading {remote_name}...")

    try:
        urllib.request.urlretrieve(url, dest)
        size_mb = os.path.getsize(dest) / (1024 * 1024)
        print(f"✓ overdrive: Downloaded {local_name} ({size_mb:.1f} MB)")
        return dest
    except Exception as e:
        print(f"⚠ overdrive: Download failed: {e}")
        print(f"  Download manually from: https://github.com/{REPO}/releases/tag/{VERSION}")
        print(f"  Place the binary in: {target_dir}/")
        return ""


if __name__ == "__main__":
    path = ensure_binary()
    if path:
        print(f"\nBinary ready at: {path}")
    else:
        sys.exit(1)
