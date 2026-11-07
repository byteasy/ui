// types/formContext.ts
import type { InjectionKey } from 'vue';

// 1. 定义提供给子孙组件的方法类型
export interface FormContextType {
  handleSubmit: () => Promise<unknown>;
  updateFieldValue: (field: string, value: any) => void;
  resetForm: () => void;
}

// 2. 导出具有强类型约束的 key
export const BeRenderLayoutFormKey: InjectionKey<FormContextType> = Symbol('BeRenderLayoutFormKey');
