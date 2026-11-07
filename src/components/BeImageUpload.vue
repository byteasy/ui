<template>
  <div class="w-full">
    <el-upload
      ref="uploadRef"
      :action="props.apiUpload"
      :list-type="props.listType"
      :auto-upload="props.autoUpload"
      :limit="actualLimit"
      :accept="props.accept"
      :multiple="props.single ? false : props.multiple"
      :drag="props.drag"
      :name="props.formParamName"
      :directory="props.directory"
      :headers="props.headers"
      :show-file-list="props.showFileList"
      :with-credentials="props.withCredentials"
      :on-success="handleUploadSuccess"
      :on-change="handleChange"
      :on-exceed="handleExceed"
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
  </div>
</template>

<script lang="ts" setup>
import { computed, defineModel, ref, watch } from 'vue';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';
import type {
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from 'element-plus';
import { genFileId } from 'element-plus';
import { executeOpenApi } from '@/api/common/platform';

const props = withDefaults(
  defineProps<{
    apiUpload?: string;
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
    formParamName?: string;
    directory?: boolean;
    download?: boolean;
    fullscreen?: boolean;
    isDrawer?: boolean;
    /** 🔥 是否启用单文件覆盖模式 */
    single?: boolean;
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
    formParamName: 'file',
    single: false,
  },
);

const uploadRef = ref<UploadInstance>();
const fileListValue = defineModel<any>('modelValue', { default: () => '' });
const fileList = ref<UploadUserFile[]>([]);

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

// 单文件模式下强制 limit = 1
const actualLimit = computed(() => (props.single ? 1 : props.limit));

let isInternalChange = false;

// -------------------------------------------------------------
// 🔥 核心改进 1：超出限制时，自动替换覆盖上一个文件
// -------------------------------------------------------------
const handleExceed: UploadProps['onExceed'] = (files) => {
  if (props.single || props.limit === 1) {
    uploadRef.value!.clearFiles();
    const rawFile = files[0] as UploadRawFile;
    rawFile.uid = genFileId();
    uploadRef.value!.handleStart(rawFile);
    // 如果是自动上传，立即触发新文件上传
    if (props.autoUpload) {
      uploadRef.value!.submit();
    }
  }
};

// -------------------------------------------------------------
// 🔥 核心改进 2：文件改变时的覆盖截取处理
// -------------------------------------------------------------
const handleChange: UploadProps['onChange'] = (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles,
) => {
  if (props.single || props.limit === 1) {
    // 强制只保留最后一个文件（最新选择的）
    if (uploadFiles.length > 1) {
      fileList.value = [uploadFiles[uploadFiles.length - 1]];
    }
  }
};

/** 解析外部传入的值为 Element Plus 标准的 UploadUserFile 数组 */
function parseValueToFileList(val: any): UploadUserFile[] {
  if (!val) return [];
  // 1. 如果是对象数组
  if (Array.isArray(val)) {
    const arr = val.map((item, idx) => {
      if (typeof item === 'string') {
        return { name: item.substring(item.lastIndexOf('/') + 1) || `file_${idx}`, url: item };
      }
      return { ...item, name: item.name || `file_${idx}`, url: item.url };
    });
    return props.single ? arr.slice(-1) : arr;
  }
  // 2. 如果是 JSON 格式字符串
  if (typeof val === 'string' && (val.trim().startsWith('[') || val.trim().startsWith('{'))) {
    try {
      const parsed = JSON.parse(val);
      return parseValueToFileList(parsed);
    } catch {
      // 容错按普通字符串处理
    }
  }
  // 3. 如果是 URL 字符串（可能是单 URL 或逗号分隔）
  if (typeof val === 'string' && val.trim().length > 0) {
    const list = val
      .split(',')
      .filter(Boolean)
      .map((url, idx) => ({
        name: url.substring(url.lastIndexOf('/') + 1) || `file_${idx}`,
        url: url.trim(),
      }));
    return props.single ? list.slice(-1) : list;
  }
  return [];
}

/** 将内部 fileList 同步回外部期望的数据格式 */
function formatFileListToValue(list: UploadUserFile[]): any {
  const validFiles = list.filter(
    (f) => f.url || (f.response && (f.response.url || f.response.data)),
  );

  // 🔥 单文件模式下，直接返回单字符串 URL（如 "https://.../a.jpg"）
  if (props.single) {
    if (validFiles.length === 0) return '';
    const last = validFiles[validFiles.length - 1];
    return last.url || last.response?.url || last.response?.data || '';
  }

  // 多文件数组模式
  if (Array.isArray(fileListValue.value)) {
    return validFiles.map((f) => ({
      name: f.name,
      url: f.url || f.response?.url || f.response?.data,
    }));
  }

  // 多文件默认逗号拼接
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
    if (JSON.stringify(formatted) !== JSON.stringify(fileListValue.value)) {
      isInternalChange = true;
      fileListValue.value = formatted;
    }
  },
  { deep: true },
);

// 监听上传成功回调
function handleUploadSuccess(response: any, uploadFile: UploadFile) {
  if (response?.url) {
    uploadFile.url = response.url;
  } else if (response?.data?.url) {
    uploadFile.url = response.data.url;
  }
}

// 移除文件
const handleRemove = (file: UploadFile) => {
  const doSplice = () => {
    const index = fileList.value.findIndex(
      (item) => item.uid === file.uid || item.url === file.url,
    );
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

// 文件下载
const handleDownload = (file: UploadFile) => {
  const url = file.url || (file.response as any)?.url;
  const fileName = file.name || 'download_file';

  if (!url) {
    console.warn('文件链接不存在，无法下载');
    return;
  }

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
      console.warn('Blob 下载失败，尝试降级为直接打开:', err);
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
