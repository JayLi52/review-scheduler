<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { message, theme } from 'ant-design-vue';
import { api } from './api';
import TaskForm from './components/TaskForm.vue';
import ClusterHeatmap from './components/ClusterHeatmap.vue';
import LogViewer from './components/LogViewer.vue';

const nodes = ref<any[]>([]);
const tasks = ref<any[]>([]);
const logs = ref<string[]>(['日志占位：接入 WebSocket 后实时更新']);
const loading = ref(false);

const refresh = async () => {
  loading.value = true;
  try {
    const [nodeRes, taskRes] = await Promise.all([api.get('/nodes'), api.get('/tasks')]);
    nodes.value = nodeRes.data ?? [];
    tasks.value = taskRes.data ?? [];
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (payload: { command: string; cpu: number; mem: number }) => {
  await api.post('/tasks', payload);
  message.success('任务已提交');
  await refresh();
};

onMounted(() => {
  refresh();
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

