export async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
  }
  // 方案B：兼容旧浏览器 / 开发环境 / 不安全域名
  else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

export function putValueIfValid(target: object, key: string, value: any) {
  if (value === null || value === undefined) {
    return false
  }
  target[key] = value
  return true
}

export const safeParseJson = (str: string | null | undefined): Record<string, string> => {
  if (!str) return {}
  try {
    return JSON.parse(str)
  } catch {
    return {}
  }
}

export const jsonToQueryString = (obj) => {
  const params = new URLSearchParams();
  for (const key in obj) {
    let value = obj[key];
    if (typeof value === "object" && value !== null) {
      value = JSON.stringify(value);
    }
    params.append(key, value);
  }
  return params.toString();
}

export const queryStringToJson = (queryString: string) => {
  if (!queryString) return {};
  try {
    const params = new URLSearchParams(queryString);
    const json = {};

    for (const [key, value] of params.entries()) {
      try {
        // 尝试把被 stringify 过的对象还原
        json[key] = JSON.parse(value);
      } catch {
        // 解析失败就直接用原始字符串
        json[key] = value;
      }
    }
    return json;
  } catch (err) {
    console.error('解析查询字符串失败', err);
    return {};
  }
}

export const getClassFieldName = (className: string) => {
  if (!className) return '';
  const arrs = className.split('.')
  const simpleName = arrs[arrs.length - 1]
  return simpleName.substring(0, 1).toLowerCase() + simpleName.substring(1)
}

export const isObjectEqual = (obj1, obj2) => {
  // 先判断是不是对象
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false
  }

  // 拿到所有 key
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  // key 数量不一样 → 直接不相等
  if (keys1.length !== keys2.length) return false

  // 逐个对比属性值
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

export const parseComponent = (queryString: string) => {
  if(!queryString) return undefined
  return queryString.split('?')[0]
}

export const parseComponentParam = (queryString: string) => {
  if(!queryString) return undefined
  const arrs = queryString.split('?')
  if (arrs.length === 2 && arrs[1]) {
    return queryStringToJson(arrs[1])
  }
  return undefined
}

export const execDefaultValueScript = (scriptText, ctx) => {
  const fn = new Function("ctx", scriptText)
  return fn(ctx)
}

/**
 * 判断是否为普通对象（排除 null、数组、函数、Date 等）
 */
function isPlainObject(val: unknown): val is Record<string, any> {
  return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * 递归合并两个对象，自动忽略 source 中值为 null 和 undefined 的属性
 * @param target 目标对象（如 Vue 的 ref.value 或 reactive 对象）
 * @param source 来源对象（如传入的 layoutParams）
 * @returns 合并后的 target
 */
export function mergeWithoutNull<T extends Record<string, any>>(
  target: T,
  source: Record<string, any> | null | undefined
): T {
  // 如果 source 为空，直接返回目标对象
  if (!source || !isPlainObject(source)) {
    return target;
  }

  // 确保 target 是有效对象
  if (!target || !isPlainObject(target)) {
    return target;
  }

  for (const [key, sourceVal] of Object.entries(source)) {
    // 1. 核心需求：忽略 null 和 undefined
    if (sourceVal === null || sourceVal === undefined) {
      continue;
    }

    // 2. 如果当前值是纯对象，递归深度合并
    if (isPlainObject(sourceVal)) {
      // 如果目标对象不存在该 key 或不是对象，先初始化一个空对象
      if (!isPlainObject(target[key])) {
        target[key] = {} as any;
      }
      mergeWithoutNull(target[key], sourceVal);
    }
    // 3. 数组处理：直接替换浅拷贝（符合大部分布局参数预期）
    else if (Array.isArray(sourceVal)) {
      target[key] = [...sourceVal] as any;
    }
    // 4. 基本类型（string, number, boolean 等）：直接覆盖赋值
    else {
      target[key] = sourceVal;
    }
  }

  return target;
}
