<script setup lang="ts">
import { reactive } from 'vue';
import { message } from 'ant-design-vue';

const emit = defineEmits<{
  (e: 'submit', payload: { command: string; cpu: number; mem: number }): Promise<void> | void;
}>();

const formState = reactive({
  command: 'echo \"hello world\"',
  cpu: 1,
  mem: 128,
});

const onSubmit = async () => {
  if (!formState.command) {
    message.warning('请输入命令');
    return;
  }
  await emit('submit', { ...formState });
};
</script>

<template>
  <a-card title="提交任务" size="small">
    <a-form layout="vertical" @submit.prevent="onSubmit">
      <a-form-item label="命令">
        <a-input v-model:value="formState.command" placeholder="要执行的命令" />
      </a-form-item>
      <a-form-item label="CPU (核)">
        <a-input-number v-model:value="formState.cpu" :min="1" :max="64" style="width: 100%" />
      </a-form-item>
      <a-form-item label="内存 (MB)">
        <a-input-number v-model:value="formState.mem" :min="64" :max="65536" style="width: 100%" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" block>
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>


