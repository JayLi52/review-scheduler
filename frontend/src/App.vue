<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
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
  <a-layout class="layout">
    <a-layout-header class="header">Mini Scheduler Dashboard</a-layout-header>
    <a-layout-content class="content">
      <a-row :gutter="16">
        <a-col :span="8">
          <TaskForm @submit="handleSubmit" />
          <div style="height: 16px" />
          <LogViewer :logs="logs" />
        </a-col>
        <a-col :span="16">
          <ClusterHeatmap :nodes="nodes" />
          <div style="height: 16px" />
          <a-card title="任务列表" size="small">
            <a-table
              :data-source="tasks"
              :loading="loading"
              row-key="id"
              size="small"
              :pagination="false"
            >
              <a-table-column title="ID" data-index="id" ellipsis />
              <a-table-column title="命令" data-index="command" ellipsis />
              <a-table-column title="CPU" data-index="cpu" width="80" />
              <a-table-column title="内存" data-index="mem" width="100" />
              <a-table-column title="状态" data-index="status" width="100" />
              <a-table-column title="节点" data-index="assignedNodeId" width="140" />
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: #0d1117;
  color: #e6f7ff;
}
.header {
  background: #141a26;
  color: #e6f7ff;
  font-size: 18px;
  font-weight: 600;
}
.content {
  padding: 24px;
}
</style>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
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
  <a-layout class="layout">
    <a-layout-header class="header">Mini Scheduler Dashboard</a-layout-header>
    <a-layout-content class="content">
      <a-row :gutter="16">
        <a-col :span="8">
          <TaskForm @submit="handleSubmit" />
          <div style="height: 16px" />
          <LogViewer :logs="logs" />
        </a-col>
        <a-col :span="16">
          <ClusterHeatmap :nodes="nodes" />
          <div style="height: 16px" />
          <a-card title="任务列表" size="small">
            <a-table
              :data-source="tasks"
              :loading="loading"
              row-key="id"
              size="small"
              :pagination="false"
            >
              <a-table-column title="ID" data-index="id" ellipsis />
              <a-table-column title="命令" data-index="command" ellipsis />
              <a-table-column title="CPU" data-index="cpu" width="80" />
              <a-table-column title="内存" data-index="mem" width="100" />
              <a-table-column title="状态" data-index="status" width="100" />
              <a-table-column title="节点" data-index="assignedNodeId" width="140" />
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: #0d1117;
  color: #e6f7ff;
}
.header {
  background: #141a26;
  color: #e6f7ff;
  font-size: 18px;
  font-weight: 600;
}
.content {
  padding: 24px;
}
</style>

