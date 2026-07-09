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
