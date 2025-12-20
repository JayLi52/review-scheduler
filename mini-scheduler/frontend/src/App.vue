<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { message, theme } from 'ant-design-vue';
import { io } from 'socket.io-client';
import { api } from './api';
import TaskForm from './components/TaskForm.vue';
import ClusterHeatmap from './components/ClusterHeatmap.vue';
import LogViewer from './components/LogViewer.vue';

const nodes = ref<any[]>([]);
const tasks = ref<any[]>([]);
const logs = ref<string[]>([]);
const loading = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;
let socket: any = null;

// 初始化 WebSocket
const initSocket = () => {
  socket = io(import.meta.env.VITE_API_BASE ?? 'http://localhost:3000');
  
  socket.on('connect', () => {
    logs.value.push(`[System] Connected to log stream`);
  });

  socket.on('log', (data: any) => {
    const time = new Date(data.timestamp).toLocaleTimeString();
    logs.value.push(`[${time}] [${data.nodeId}] [${data.taskId}] ${data.message}`);
    // 保持最多 1000 行日志，避免内存溢出
    if (logs.value.length > 1000) {
      logs.value.shift();
    }
  });

  socket.on('disconnect', () => {
    logs.value.push(`[System] Disconnected from log stream`);
  });
};

const refresh = async (silent = false) => {
  if (!silent) loading.value = true;
  try {
    const [nodeRes, taskRes] = await Promise.all([api.get('/nodes'), api.get('/tasks')]);
    nodes.value = nodeRes.data ?? [];
    tasks.value = taskRes.data ?? [];
  } finally {
    if (!silent) loading.value = false;
  }
};

const handleSubmit = async (payload: { command: string; cpu: number; mem: number }) => {
  await api.post('/tasks', payload);
  message.success('任务已提交');
  await refresh(true);
};

const handleDeleteNode = async (nodeId: string) => {
  try {
    await api.delete(`/nodes/${nodeId}`);
    message.success('节点已删除');
    await refresh(true);
  } catch (err) {
    message.error('删除节点失败');
  }
};

onMounted(() => {
  refresh();
  initSocket();
  // 每 2 秒轮询一次状态
  timer = setInterval(() => {
    refresh(true);
  }, 2000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (socket) {
    socket.disconnect();
    socket = null;
  }
});
</script>

<template>
  <a-config-provider :theme="{ algorithm: theme.darkAlgorithm }">
    <a-layout class="layout">
      <a-layout-header class="header">Mini Scheduler Dashboard</a-layout-header>
      <a-layout-content class="content">
        <a-flex gap="middle" class="full-height">
          <!-- 左侧面板 -->
          <a-flex vertical gap="middle" class="panel-left">
            <TaskForm @submit="handleSubmit" />
            <LogViewer :logs="logs" class="flex-fill" />
          </a-flex>

          <!-- 右侧面板 -->
          <a-flex vertical gap="middle" class="panel-right">
            <ClusterHeatmap :nodes="nodes" />
            <a-card title="任务列表" size="small" class="flex-fill task-list-card">
              <a-table
                :data-source="tasks"
                :loading="loading"
                row-key="id"
                size="small"
                :pagination="false"
                :scroll="{ y: 'calc(100% - 40px)' }"
                class="full-height-table"
              >
                <a-table-column title="ID" data-index="id" ellipsis />
                <a-table-column title="命令" data-index="command" ellipsis />
                <a-table-column title="CPU" data-index="cpu" width="80" />
                <a-table-column title="内存" data-index="mem" width="100" />
                <a-table-column title="状态" data-index="status" width="100" />
                <a-table-column title="节点" data-index="assignedNodeId" width="140" />
              </a-table>
            </a-card>
          </a-flex>
        </a-flex>
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>

<style scoped>
.layout {
  height: 100vh;
  overflow: hidden;
}
.header {
  font-size: 18px;
  font-weight: 600;
  height: 64px;
  line-height: 64px;
  padding: 0 24px;
}
.content {
  padding: 16px;
  height: calc(100vh - 64px);
  overflow: hidden;
}

.full-height {
  height: 100%;
}

.panel-left {
  width: 320px;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
}

.panel-right {
  flex: 1;
  height: 100%;
  overflow: hidden;
  min-width: 0;
}

.flex-fill {
  flex: 1;
  min-height: 0; /* 关键：允许 flex 子项缩小到内容以下 */
  display: flex;
  flex-direction: column;
}

/* 针对 LogViewer 和 TaskList 的深度样式调整，确保占满剩余空间 */
:deep(.ant-card-body) {
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 任务列表表格样式调整 */
.task-list-card :deep(.ant-card-body) {
  padding: 0; /* 表格贴边 */
  overflow: hidden;
}
.full-height-table {
  height: 100%;
}
</style>

