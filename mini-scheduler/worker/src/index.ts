import axios from 'axios';
import os from 'os';
import { io } from 'socket.io-client';

const MASTER_URL = process.env.MASTER_URL ?? 'http://localhost:3000';
const NODE_ID = process.env.NODE_ID ?? `worker-${os.hostname()}-${process.pid}`;
const HEARTBEAT_INTERVAL = Number(process.env.HEARTBEAT_INTERVAL ?? 3000);
const POLL_INTERVAL = 2000;

// 初始化 WebSocket 连接
const socket = io(MASTER_URL);

socket.on('connect', () => {
  console.log('[worker] connected to log stream');
});

function log(taskId: string, message: string) {
  const payload = {
    nodeId: NODE_ID,
    taskId,
    message,
    timestamp: Date.now(),
  };
  // 发送日志到 Server
  socket.emit('log', payload);
  // 本地也打印
  console.log(`[${taskId}] ${message}`);
}

const totalCpu = os.cpus().length;
const totalMem = Math.floor(os.totalmem() / (1024 * 1024)); // MB

// 本地资源预留状态
let reservedCpu = 0;
let reservedMem = 0;

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
  // 汇报的是“逻辑剩余资源”，即总资源减去被任务预留的资源
  // 而不是 os.freemem()，因为 os.freemem() 会波动且不反映调度器的预留视角
  const freeMem = Math.max(0, totalMem - reservedMem);
  const freeCpu = Math.max(0, totalCpu - reservedCpu);
  
  try {
    const res = await axios.post(`${MASTER_URL}/nodes/heartbeat`, {
      id: NODE_ID,
      freeCpu,
      freeMem,
    });
    if (res.data?.error === 'NODE_NOT_FOUND') {
      console.warn('[worker] node not found, re-registering...');
      await register();
    }
  } catch (err) {
    console.warn('[worker] heartbeat failed', (err as Error).message);
  }
}

async function runTask(task: any) {
  log(task.id, `Received task (cmd: ${task.command})`);
  
  // 1. 预留资源
  reservedCpu += task.cpu;
  reservedMem += task.mem;
  
  try {
    // 2. 更新状态为 RUNNING
    await axios.post(`${MASTER_URL}/tasks/${task.id}/status`, { status: 'RUNNING' });
    log(task.id, 'Status updated to RUNNING');
    
    // 3. 模拟执行 10s
    for (let i = 1; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        log(task.id, `Executing... ${i * 10}%`);
    }
    
    // 4. 随机决定结果 (80% 成功)
    const isSuccess = Math.random() < 0.8;
    const finalStatus = isSuccess ? 'SUCCESS' : 'FAILED';
    
    log(task.id, `Finished with status: ${finalStatus}`);
    await axios.post(`${MASTER_URL}/tasks/${task.id}/status`, { status: finalStatus });
    
  } catch (err) {
    console.error(`[worker] task ${task.id} error`, err);
    log(task.id, `Error: ${(err as Error).message}`);
    try {
        await axios.post(`${MASTER_URL}/tasks/${task.id}/status`, { status: 'FAILED' });
    } catch (e) { /* ignore */ }
  } finally {
    // 5. 释放资源
    reservedCpu = Math.max(0, reservedCpu - task.cpu);
    reservedMem = Math.max(0, reservedMem - task.mem);
  }
}

async function pollTasks() {
  try {
    const res = await axios.get(`${MASTER_URL}/tasks/poll`, {
      params: { nodeId: NODE_ID },
    });
    const tasks = res.data;
    if (Array.isArray(tasks) && tasks.length > 0) {
      // 并发执行任务
      tasks.forEach((task) => runTask(task));
    }
  } catch (err) {
    // 忽略轮询错误，避免刷屏
  }
}

async function main() {
  try {
    await register();
  } catch (err) {
    console.error('[worker] register failed', err);
  }

  // 心跳循环
  setInterval(async () => {
    await heartbeat();
  }, HEARTBEAT_INTERVAL);
  
  // 任务轮询循环
  setInterval(async () => {
    await pollTasks();
  }, POLL_INTERVAL);
}

void main();

