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
