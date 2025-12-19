<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  logs: string[];
  autoScroll?: boolean;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const isUserScrolling = ref(false);

const handleScroll = () => {
  const el = containerRef.value;
  if (!el) return;
  isUserScrolling.value = el.scrollHeight - el.scrollTop - el.clientHeight > 50;
};

watch(
  () => props.logs.length,
  () => {
    const el = containerRef.value;
    if (!el) return;
    if (!isUserScrolling.value && props.autoScroll !== false) {
      el.scrollTop = el.scrollHeight;
    }
  },
);

onMounted(() => {
  containerRef.value?.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  containerRef.value?.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <a-card title="实时日志" size="small">
    <div ref="containerRef" class="log-box">
      <div v-for="(line, idx) in logs" :key="idx" class="line">{{ line }}</div>
    </div>
  </a-card>
</template>

<style scoped>
.log-box {
  background: #0a0f16;
  color: #9ad5ff;
  font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
    Courier New, monospace;
  padding: 12px;
  border-radius: 8px;
  height: 280px;
  overflow: auto;
  border: 1px solid #1f2d3d;
}
.line {
  white-space: pre-wrap;
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  logs: string[];
  autoScroll?: boolean;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const isUserScrolling = ref(false);

const handleScroll = () => {
  const el = containerRef.value;
  if (!el) return;
  isUserScrolling.value = el.scrollHeight - el.scrollTop - el.clientHeight > 50;
};

watch(
  () => props.logs.length,
  () => {
    const el = containerRef.value;
    if (!el) return;
    if (!isUserScrolling.value && props.autoScroll !== false) {
      el.scrollTop = el.scrollHeight;
    }
  },
);

onMounted(() => {
  containerRef.value?.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  containerRef.value?.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <a-card title="实时日志" size="small">
    <div ref="containerRef" class="log-box">
      <div v-for="(line, idx) in logs" :key="idx" class="line">{{ line }}</div>
    </div>
  </a-card>
</template>

<style scoped>
.log-box {
  background: #0a0f16;
  color: #9ad5ff;
  font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
    Courier New, monospace;
  padding: 12px;
  border-radius: 8px;
  height: 280px;
  overflow: auto;
  border: 1px solid #1f2d3d;
}
.line {
  white-space: pre-wrap;
}
</style>


