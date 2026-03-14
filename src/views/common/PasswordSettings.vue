<template>
  <div class="password-modify-container">
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-position="right"
      :label-width="160"
      class="password-form"
    >
      <!-- 原始密码 -->
      <el-form-item :label="$t('passwordModify.oldPasswordLabel')" prop="oldPassword">
        <el-input
          v-model="passwordForm.oldPassword"
          type="password"
          :placeholder="$t('passwordModify.placeholders.oldPassword')"
          show-password
        />
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item :label="$t('passwordModify.newPasswordLabel')" prop="newPassword">
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          :placeholder="$t('passwordModify.placeholders.newPassword')"
          show-password
          @input="checkPasswordStrength"
        />
        <!-- 优化后的密码强度提示 -->
        <div class="password-strength-wrapper" v-if="passwordForm.newPassword">
          <div class="strength-header">
            <span class="strength-label">{{ $t('passwordModify.passwordStrength.label') }}</span>
            <span class="strength-text">{{ strengthText }}</span>
          </div>
          <div class="strength-bar-container">
            <div
              class="strength-bar"
              :class="getStrengthClass()"
              :style="{ width: `${strengthLevel * 33.3}%` }"
            ></div>
          </div>
          <div class="strength-tips">
            {{ getStrengthTips() }}
          </div>
        </div>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item :label="$t('passwordModify.confirmPasswordLabel')" prop="confirmPassword">
        <el-input
          v-model="passwordForm.confirmPassword"
          type="password"
          :placeholder="$t('passwordModify.placeholders.confirmPassword')"
          show-password
        />
      </el-form-item>

      <el-form-item class="form-submit">
        <!-- 移除重置按钮，只保留提交按钮 -->
        <el-button type="primary" @click="submitForm">{{
          $t('passwordModify.buttons.submit')
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { editPassword } from '@/api/common/user'
const { t } = useI18n() // 表单引用
const passwordFormRef = ref<InstanceType<typeof ElForm>>(); // 表单数据
const passwordForm = reactive({
  oldPassword: '', // 原始密码
  newPassword: '', // 新密码
  confirmPassword: '', // 确认密码
})

// 密码强度等级（0-3：无/弱/中/强）
const strengthLevel = ref(0)
// 密码强度文本
const strengthText = computed(() => {
  const texts = [
    t('passwordModify.passwordStrength.levels.0'),
    t('passwordModify.passwordStrength.levels.1'),
    t('passwordModify.passwordStrength.levels.2'),
    t('passwordModify.passwordStrength.levels.3'),
  ]
  return texts[strengthLevel.value]
})

// 获取强度对应的样式类
const getStrengthClass = () => {
  const classes = ['strength-none', 'strength-weak', 'strength-medium', 'strength-strong']
  return classes[strengthLevel.value]
}

// 获取强度提示文案
const getStrengthTips = () => {
  const tips = [
    t('passwordModify.passwordStrength.tips.0'),
    t('passwordModify.passwordStrength.tips.1'),
    t('passwordModify.passwordStrength.tips.2'),
    t('passwordModify.passwordStrength.tips.3'),
  ]
  return tips[strengthLevel.value]
}

// 校验规则
const passwordRules = {
  oldPassword: [
    { required: true, message: t('passwordModify.validateRules.requiredOldPwd'), trigger: 'blur' },
    { min: 8, max: 20, message: t('passwordModify.validateRules.passwordLength'), trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: t('passwordModify.validateRules.requiredNewPwd'), trigger: 'blur' },
    { min: 8, max: 20, message: t('passwordModify.validateRules.passwordLength'), trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        // 校验密码复杂度（至少包含字母和数字）
        const hasLetter = /[a-zA-Z]/.test(value)
        const hasNumber = /\d/.test(value)
        if (value && !(hasLetter && hasNumber)) {
          callback(new Error(t('passwordModify.validateRules.passwordComplexity')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: t('passwordModify.validateRules.requiredConfirmPwd'), trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error(t('passwordModify.validateRules.passwordNotMatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 检查密码强度
const checkPasswordStrength = (value: string) => {
  if (!value) {
    strengthLevel.value = 0
    return
  }

  let level = 0
  // 规则1：长度≥8
  if (value.length >= 8) level++
  // 规则2：包含字母
  if (/[a-zA-Z]/.test(value)) level++
  // 规则3：包含数字
  if (/\d/.test(value)) level++
  // 规则4：包含特殊字符（可选，增加强度）
  if (/[^a-zA-Z0-9]/.test(value)) level++

  // 限制等级为0-3
  strengthLevel.value = Math.min(level, 3)
}

// 提交表单
const submitForm = () => {
  if (!passwordFormRef.value) return

  passwordFormRef.value.validate((valid) => {
    if (valid) {
      editPassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword }).then((rsp) => {
        if(rsp.success) {
          // 这里替换为实际的接口请求逻辑
          ElMessage.success(t('passwordModify.messages.modifySuccess'))
          // 仅清空表单数据，不显示重置按钮
          passwordForm.oldPassword = ''
          passwordForm.newPassword = ''
          passwordForm.confirmPassword = ''
          strengthLevel.value = 0
        } else {
          ElMessage.error(rsp.description)
        }
      })
    } else {
      ElMessage.error(t('passwordModify.messages.validateError'))
      return false
    }
  })
}
</script>

<style scoped>
.password-modify-container {
  max-width: 500px;
  border-radius: 8px;
}

.password-form {
  padding: 20px;
}

/* 优化后的密码强度样式 */
.password-strength-wrapper {
  width: 500px;
  margin-top: 12px;
  padding: 10px;
  border-radius: 6px;
  /* 适配主题背景色 */
  background: var(--el-bg-color-page);
  transition: all 0.3s ease;
}

.strength-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.strength-label {
  font-size: 13px;
  /* 适配主题文字色 */
  color: var(--el-text-color-regular);
}

.strength-text {
  font-size: 13px;
  font-weight: 500;
  transition: color 0.3s ease;
}

/* 强度容器 */
.strength-bar-container {
  height: 8px;
  width: 100%;
  border-radius: 4px;
  /* 适配主题背景色 */
  background: var(--el-fill-color-light);
  overflow: hidden;
  margin-bottom: 6px;
}

/* 强度进度条 */
.strength-bar {
  height: 100%;
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
}

/* 适配 Element Plus 主题色的强度样式 */
.strength-none {
  background-color: var(--el-border-color);
}

.strength-weak {
  background-color: var(--el-color-danger);
}

.strength-medium {
  background-color: var(--el-color-warning);
}

.strength-strong {
  background-color: var(--el-color-success);
}

/* 强度提示文案 */
.strength-tips {
  font-size: 12px;
  /* 适配主题次要文字色 */
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

.form-submit {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 暗色主题下的样式优化（增强对比度） */
:deep(.el-theme-dark) .password-strength-wrapper {
  box-shadow: 0 0 0 1px var(--el-border-color-lighter) inset;
}

:deep(.el-theme-dark) .strength-bar-container {
  background: var(--el-fill-color-dark);
}
</style>
