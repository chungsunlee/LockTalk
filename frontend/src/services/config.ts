// src/services/config.ts
import logging from 'loglevel';

logging.setDefaultLevel('info');

/**
 * # Backend Discovery Service
 *
 * Implements the "mDNS with a fallback" strategy to automatically find the backend.
 */

const MDNS_HOSTNAME = 'locktalk-server.local';
const PORT = 8000;
const MDNS_URL = `http://${MDNS_HOSTNAME}:${PORT}`;

let backendUrl: string | null = null;

async function checkServerHealth(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout
    
    logging.info(`Pinging health check at: ${url}/api/health`);
    const response = await fetch(`${url}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);

    return response.ok && (await response.json()).status === 'ok';
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      logging.warn(`Health check timed out for ${url}.`);
    } else {
      logging.warn(`Health check failed for ${url}:`, error);
    }
    return false;
  }
}

function getFallbackIp(): string | null {
  const metaTag = document.querySelector('meta[name="backend-ip"]');
  const ip = metaTag?.getAttribute('content');
  if (ip && ip !== '__BACKEND_IP_PLACEHOLDER__') {
    return ip;
  }
  return null;
}

export async function fetchBackendUrl(): Promise<string> {
  if (backendUrl) {
    return backendUrl;
  }

  logging.info(`Attempting discovery via mDNS: ${MDNS_URL}`);
  if (await checkServerHealth(MDNS_URL)) {
    logging.info('Successfully connected using mDNS hostname.');
    backendUrl = MDNS_URL;
    return backendUrl;
  }

  logging.warn('mDNS connection failed. Attempting fallback...');
  const fallbackIp = getFallbackIp();
  if (fallbackIp) {
    const fallbackUrl = `http://${fallbackIp}:${PORT}`;
    logging.info(`Attempting discovery via fallback IP: ${fallbackUrl}`);
    if (await checkServerHealth(fallbackUrl)) {
      logging.info('Successfully connected using fallback IP.');
      backendUrl = fallbackUrl;
      return backendUrl;
    }
  }

  logging.error('Fatal: Could not connect to backend using mDNS or fallback IP.');
  alert('Could not connect to the LockTalk server. Please ensure the server is running on the same network and refresh the page.');
  throw new Error('Backend discovery failed.');
}