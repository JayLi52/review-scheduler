<script setup lang="ts">
import { DeleteOutlined } from '@ant-design/icons-vue';
import { Popconfirm } from 'ant-design-vue';

defineProps<{
  nodes: Array<{
    id: string;
    name?: string;
    freeCpu: number;
    freeMem: number;
    totalCpu: number;
    totalMem: number;
    status: string;
  }>;
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void;
}>();

const statusColor: Record<string, string> = {
  ONLINE: '#52c41a',
  UNHEALTHY: '#faad14',
  OFFLINE: '#ff4d4f',
};

const formatPercent = (free: number, total: number) =>
  total ? Math.round(((total - free) / total) * 100) : 0;
</script>

<template>
  <a-card title="节点热力图" size="small">
    <div class="grid">
      <div v-for="node in nodes" :key="node.id" class="card">
        <div class="card-header">
          <span>{{ node.name || node.id }}</span>
          <div class="header-actions">
            <a-tag :color="statusColor[node.status] || 'default'">{{ node.status }}</a-tag>
            <Popconfirm
              v-if="node.status !== 'ONLINE'"
              title="确定删除该节点吗？"
              @confirm="emit('delete', node.id)"
            >
              <DeleteOutlined class="delete-icon" />
            </Popconfirm>
          </div>
        </div>
        <div class="metric">
          <span>CPU</span>
          <a-progress
            :percent="formatPercent(node.freeCpu, node.totalCpu)"
            size="small"
            :status="node.status === 'ONLINE' ? 'active' : 'exception'"
          />
        </div>
        <div class="metric">
          <span>MEM</span>
          <a-progress
            :percent="formatPercent(node.freeMem, node.totalMem)"
            size="small"
            :status="node.status === 'ONLINE' ? 'active' : 'exception'"
          />
        </div>
      </div>
    </div>
  </a-card>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.delete-icon {
  color: #ff4d4f;
  cursor: pointer;
  transition: opacity 0.2s;
}
.delete-icon:hover {
  opacity: 0.8;
}
.metric {
  margin: 6px 0;
}
</style>


