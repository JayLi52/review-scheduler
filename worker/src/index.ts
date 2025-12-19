import axios from 'axios';
import os from 'os';

const MASTER_URL = process.env.MASTER_URL ?? 'http://localhost:3000';
const NODE_ID = process.env.NODE_ID ?? `worker-${os.hostname()}`;
const HEARTBEAT_INTERVAL = Number(process.env.HEARTBEAT_INTERVAL ?? 3000);

const totalCpu = os.cpus().length;
const totalMem = Math.floor(os.totalmem() / (1024 * 1024)); // MB

async function register() {
  await axios.post(`${MASTER_URL}/nodes/register`, {
    id: NODE_ID,
    name: NODE_ID,
    totalCpu,
    totalMem,
  });
  console.log(`[worker] registered as ${NODE_ID}`);
}

async function heartbeat() {
  const freeMem = Math.floor(os.freemem() / (1024 * 1024));
  // 粗略估算：可用 CPU 近似为总核数
  const freeCpu = totalCpu;
  await axios.post(`${MASTER_URL}/nodes/heartbeat`, {
    id: NODE_ID,
    freeCpu,
    freeMem,
  });
}

async function main() {
  try {
    await register();
  } catch (err) {
    console.error('[worker] register failed', err);
    return;
  }

  setInterval(async () => {
    try {
      await heartbeat();
    } catch (err) {
      console.warn('[worker] heartbeat failed', (err as Error).message);
    }
  }, HEARTBEAT_INTERVAL);
}

void main();

