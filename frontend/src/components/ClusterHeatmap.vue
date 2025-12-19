<script setup lang="ts">
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
          <a-tag :color="statusColor[node.status] || 'default'">{{ node.status }}</a-tag>
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
  background: #111a2c;
  border: 1px solid #1f2d3d;
  border-radius: 8px;
  padding: 12px;
  color: #e6f7ff;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.metric {
  margin: 6px 0;
}
</style>

<script setup lang="ts">
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
          <a-tag :color="statusColor[node.status] || 'default'">{{ node.status }}</a-tag>
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
  background: #111a2c;
  border: 1px solid #1f2d3d;
  border-radius: 8px;
  padding: 12px;
  color: #e6f7ff;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.metric {
  margin: 6px 0;
}
</style>


