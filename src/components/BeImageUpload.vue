<template>
  <el-upload
    :action="props.apiUpload"
    :list-type="props.listType"
    :auto-upload="props.autoUpload"
    :limit="props.limit"
    :accept="props.accept"
    :multiple="props.multiple"
    :drag="props.drag"
    :name="props.name"
    :directory="props.directory"
    :headers="props.headers"
    :show-file-list="props.showFileList"
    :with-credentials="props.withCredentials"
    :on-success="handleUploadSuccess"
    v-model:file-list="fileList"
  >
    <el-icon><Plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
            v-if="props.preview"
          >
            <el-icon><ZoomIn /></el-icon>
          </span>
          <span
            v-if="!props.disabled && props.download"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
            v-if="!props.disabled && props.apiRemove"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible" :fullscreen="props.fullscreen">
    <img class="w-full" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineModel, ref, watch } from 'vue';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';
import type { UploadFile, UploadUserFile } from 'element-plus';
import { executeOpenApi } from '@/api/common/platform';

const props = withDefaults(
  defineProps<{
    apiUpload: string;
    apiRemove?: string;
    withCredentials?: boolean;
    disabled?: boolean;
    showFileList?: boolean;
    drag?: boolean;
    preview?: boolean;
    multiple?: boolean;
    headers?: Record<string, any>;
    autoUpload?: boolean;
    accept?: string;
    limit?: number;
    listType?: string;
    name?: string;
    directory?: boolean;
    download?: boolean;
    fullscreen?: boolean;
    isDrawer?: boolean;
  }>(),
  {
    withCredentials: true,
    disabled: false,
    showFileList: true,
    preview: true,
    drag: false,
    multiple: false,
    autoUpload: false,
    directory: false,
    download: true,
    listType: 'picture-card',
    name: 'file',
  },
);

const fileListValue = defineModel<any>('modelValue', { default: () => '' });
const fileList = ref<UploadUserFile[]>([]);

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

// -------------------------------------------------------------
// TODO 1: 实现 fileListValue 和 fileList 的健壮双向同步（防死循环）
// -------------------------------------------------------------
let isInternalChange = false;

/** 解析外部传入的值为 Element Plus 标准的 UploadUserFile 数组 */
function parseValueToFileList(val: any): UploadUserFile[] {
  if (!val) return [];
  // 1. 如果是对象数组
  if (Array.isArray(val)) {
    return val.map((item, idx) => {
      if (typeof item === 'string') {
        return { name: item.substring(item.lastIndexOf('/') + 1) || `file_${idx}`, url: item };
      }
      return { ...item, name: item.name || `file_${idx}`, url: item.url };
    });
  }
  // 2. 如果是 JSON 字符串格式
  if (typeof val === 'string' && (val.trim().startsWith('[') || val.trim().startsWith('{'))) {
    try {
      const parsed = JSON.parse(val);
      return parseValueToFileList(parsed);
    } catch {
      // 容错降级按逗号分割处理
    }
  }
  // 3. 如果是逗号分隔的 URL 字符串 (如 "url1,url2")
  if (typeof val === 'string' && val.trim().length > 0) {
    return val.split(',').filter(Boolean).map((url, idx) => ({
      name: url.substring(url.lastIndexOf('/') + 1) || `file_${idx}`,
      url: url.trim(),
    }));
  }
  return [];
}

/** 将 fileList 序列化回外部期望的数据格式（默认为 URL 数组或逗号字符串） */
function formatFileListToValue(list: UploadUserFile[]): any {
  // 只提取上传成功并持有合法 url 的文件
  const validFiles = list.filter((f) => f.url || (f.response && (f.response.url || f.response.data)));

  // 如果外部初始传入的是 Array，则回传 Array；否则回传逗号分割的 URL 字符串
  if (Array.isArray(fileListValue.value)) {
    return validFiles.map((f) => ({
      name: f.name,
      url: f.url || f.response?.url || f.response?.data,
    }));
  }

  // 默认格式：URL 逗号拼接字符串，便于直接保存到数据库 varchar 字段
  return validFiles
    .map((f) => f.url || f.response?.url || f.response?.data)
    .filter(Boolean)
    .join(',');
}

// 外部数据变化 -> 同步至内部 fileList
watch(
  () => fileListValue.value,
  (newVal) => {
    if (isInternalChange) {
      isInternalChange = false;
      return;
    }
    fileList.value = parseValueToFileList(newVal);
  },
  { immediate: true, deep: true },
);

// 内部上传/删除变更 -> 回写通知外部 v-model
watch(
  () => fileList.value,
  (newFiles) => {
    const formatted = formatFileListToValue(newFiles);
    // 浅比对防无意义重复触发
    if (JSON.stringify(formatted) !== JSON.stringify(fileListValue.value)) {
      isInternalChange = true;
      fileListValue.value = formatted;
    }
  },
  { deep: true },
);

// 监听上传成功回调
function handleUploadSuccess(response: any, uploadFile: UploadFile) {
  // 适配服务端接口返回的 url 字段
  if (response?.url) {
    uploadFile.url = response.url;
  } else if (response?.data?.url) {
    uploadFile.url = response.data.url;
  }
}

// -------------------------------------------------------------
// TODO 2: 安全移除与服务端联动
// -------------------------------------------------------------
const handleRemove = (file: UploadFile) => {
  const doSplice = () => {
    const index = fileList.value.findIndex((item) => item.uid === file.uid || item.url === file.url);
    if (index > -1) {
      fileList.value.splice(index, 1);
    }
  };

  if (props.apiRemove) {
    executeOpenApi(props.apiRemove, { fileName: file.name, fileUrl: file.url }, {})
      .then(() => {
        doSplice();
      })
      .catch((err) => {
        console.error('删除文件失败:', err);
      });
  } else {
    doSplice();
  }
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

// -------------------------------------------------------------
// TODO 3: 前端文件下载（支持同源、跨域与 Blob 下载）
// -------------------------------------------------------------
const handleDownload = (file: UploadFile) => {
  const url = file.url || (file.response as any)?.url;
  const fileName = file.name || 'download_file';

  if (!url) {
    console.warn('文件链接不存在，无法下载');
    return;
  }

  // 通过 fetch 将图片或文件以 Blob 格式下载，解决 <a> 标签跨域时无法重命名 (download 属性失效) 的问题
  fetch(url, { credentials: props.withCredentials ? 'include' : 'same-origin' })
    .then((res) => {
      if (!res.ok) throw new Error('网络响应异常');
      return res.blob();
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((err) => {
      console.warn('Blob 下载失败，尝试降级为直接打开/下载:', err);
      // 降级兼容：直接通过 window.location 下载
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = fileName;
      link.click();
    });
};
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>
