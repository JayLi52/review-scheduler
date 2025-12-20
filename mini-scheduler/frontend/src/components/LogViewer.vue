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
  <a-card title="实时日志" size="small" class="log-card">
    <div ref="containerRef" class="log-box">
      <div v-for="(line, idx) in logs" :key="idx" class="line">{{ line }}</div>
    </div>
  </a-card>
</template>

<style scoped>
.log-card {
  display: flex;
  flex-direction: column;
}
.log-box {
  background: rgba(0, 0, 0, 0.25);
  color: #9ad5ff;
  font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
    Courier New, monospace;
  padding: 12px;
  /* 增加底部 padding，防止最新日志贴底太近 */
  padding-bottom: 24px;
  border-radius: 4px;
  height: 100%;
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.line {
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
  font-size: 12px;
}
</style>


