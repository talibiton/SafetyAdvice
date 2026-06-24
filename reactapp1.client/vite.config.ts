import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "reactapp1.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

// Get the HTTPS URL for the ASP.NET Core backend
const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7170';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/AuditDetail': {
                target,
                secure: false,
                ws: true,
                changeOrigin: true
            },
            '^/Question': {
                target,
                secure: false,
                ws: true,
                changeOrigin: true
            },
            '^/QuestionsForSpace': {
                target,
                secure: false,
                ws: true,
                changeOrigin: true
            },
            '^/Save': {
                target,
                secure: false,
                ws: true,
                changeOrigin: true
            },
            '^/Hub': {
                target,
                secure: false,
                ws: true,
                changeOrigin: true
            },
            '^/Organization': {
                target,
                secure: false,
                ws: true,
                changeOrigin: true
            },
            '^/Cities': {
                target,
                secure: false,
                ws: true,
                changeOrigin: true
            },
            '^/Kindergarten': {
                target,
                secure: false,
                ws: true,
                changeOrigin: true
            },
            '^/api': {
                target,
                secure: false,
                ws: true,
                changeOrigin: true
            }
        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
