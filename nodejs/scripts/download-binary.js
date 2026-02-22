/**
 * Postinstall script — downloads the correct native binary from GitHub Releases.
 * Runs automatically after `npm install overdrive-db`.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = 'ALL-FOR-ONE-TECH/OverDrive-DB_SDK';
const VERSION = 'v1.0.1';

function getBinaryInfo() {
    const platform = os.platform();
    const arch = os.arch();

    if (platform === 'win32') {
        return { name: 'overdrive-windows-x64.dll', local: 'overdrive.dll' };
    } else if (platform === 'darwin') {
        return { name: 'liboverdrive-macos-arm64.dylib', local: 'liboverdrive.dylib' };
    } else {
        return { name: 'liboverdrive-linux-x64.so', local: 'liboverdrive.so' };
    }
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, { headers: { 'User-Agent': 'overdrive-db-npm' } }, (response) => {
            // Follow redirects (GitHub releases use 302)
            if (response.statusCode === 301 || response.statusCode === 302) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Download failed: HTTP ${response.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
            file.on('error', reject);
        });
        request.on('error', reject);
    });
}

async function main() {
    const { name, local } = getBinaryInfo();
    const libDir = path.join(__dirname, '..', 'lib');
    const destPath = path.join(libDir, local);

    // Skip if binary already exists
    if (fs.existsSync(destPath)) {
        console.log(`✓ overdrive-db: Native binary already present (${local})`);
        return;
    }

    // Also check if binary is in the package root
    const rootPath = path.join(__dirname, '..', local);
    if (fs.existsSync(rootPath)) {
        console.log(`✓ overdrive-db: Native binary found at root (${local})`);
        return;
    }

    console.log(`⬇ overdrive-db: Downloading ${name} from GitHub Releases...`);

    const url = `https://github.com/${REPO}/releases/download/${VERSION}/${name}`;

    try {
        if (!fs.existsSync(libDir)) {
            fs.mkdirSync(libDir, { recursive: true });
        }

        await download(url, destPath);

        // Make executable on Unix
        if (os.platform() !== 'win32') {
            fs.chmodSync(destPath, 0o755);
        }

        const size = fs.statSync(destPath).size;
        console.log(`✓ overdrive-db: Downloaded ${local} (${(size / 1024 / 1024).toFixed(1)} MB)`);
    } catch (err) {
        console.warn(`⚠ overdrive-db: Auto-download failed: ${err.message}`);
        console.warn(`  Please download manually from:`);
        console.warn(`  https://github.com/${REPO}/releases/tag/${VERSION}`);
        console.warn(`  Place the binary in: ${libDir}/`);
        // Don't fail the install — user can download manually
    }
}

main();
