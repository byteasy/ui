import i18n from '@/locales/index.ts'
import { safeParseJson } from "@/util/common.ts";
import {getLangText} from "@/locales/common.ts";

export function isEmail(value: string) {
  const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  return reg.test(value)
}

/**
 * @description 判断是否是手机号
 * @param value
 * @returns {boolean}
 */
export function isPhone(value: string) {
  const reg = /^((13[0-9])|(14[5-7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
  return reg.test(value)
}

/**
 * @description 判断是否是身份证号(第二代)
 * @param value
 * @returns {boolean}
 */
export function isIdCard(value: string) {
  const reg =
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return reg.test(value)
}

/**
 * @description 判断是否为固话
 * @param value
 * @returns {boolean}
 */
export function isTel(value: string) {
  const reg =
    /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})([- ])?)?([0-9]{7,8})(([- 转])*([0-9]{1,4}))?$/
  return reg.test(value)
}

/**
 * @description 判断是否为数字且最多两位小数
 * @param value
 * @returns {boolean}
 */
export function isNum(value: string) {
  const reg = /^\d+(\.\d{1,2})?$/
  return reg.test(value)
}

function isChinese(str: string) {
  const re = /^[\u4e00-\u9fa5]+$/
  return re.test(str)
}
/**
 * @description 手机号码校验
 * @param value
 * @returns {boolean}
 */
export function validatePhone(rule: any, value: any, callback: any) {
  if (value || rule.required) {
    if (!isPhone(value)) {
      callback(new Error('请输入正确的联系电话'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * @description 电子邮箱校验
 * @param value
 * @returns {boolean}
 */
export function validateEmail(rule: any, value: any, callback: any) {
  if (value || rule.required) {
    if (!isEmail(value)) {
      callback(new Error('请输入正确的电子邮箱'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 校验数字
export function validateNumber(rule: any, value: any, callback: any) {
  if (value || rule.required) {
    const v = value || ''
    const pattern = /^[0-9]{1,8}$/
    if (!pattern.test(v)) {
      callback(new Error('请输入1-8位数字'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * @description 数字校验保留小数后俩位
 * @param value
 * @returns {boolean}
 */
export function validateNum(rule: any, value: any, callback: any) {
  const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
  if (!reg.test(value)) {
    callback(new Error('请保留小数后俩位'))
  }
}

// 用户账号校验
export function validateCommonAccont(rule: any, value: any, callback: any) {
  const commonNoChars = '~!@#$%^&*()_+|}{":?><,./;' + '’[]\\=-` '
  const noChars = commonNoChars
  const v = value || ''
  for (let i = 0; i < noChars.length; i++) {
    const char = noChars[i]
    if (v.indexOf(char) != -1) {
      callback(new Error('不能使用字符：' + noChars))
      return
    }
  }
  const words = ['null', 'NULL', 'Null']
  for (let i = 0; i < noChars.length; i++) {
    const word = words[i]
    if (v.indexOf(word) != -1) {
      callback(new Error('不能包含： ' + word))
      return
    }
  }
  if (isChinese(value)) {
    callback(new Error('不能包含中文'))
    return
  }
  callback()
}

//域名校验
export function validateURL(rule: any, value: any, callback: any) {
  const strRegex =
    '^((https|http|ftp|rtsp|mms)?://)' +
    "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + // ftp的user@
    '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
    '|' + // 允许IP和DOMAIN（域名）
    "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
    '[a-z]{2,6})' + // first level domain- .com or .museum
    '(:[0-9]{1,4})?' + // 端口- :80
    '((/?)|' + // a slash isn't required if there is no file name
    "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"
  const re = new RegExp(strRegex)

  if (value && !re.test(value)) {
    callback(new Error('请输入正确地址'))
  }
  callback()
}

// 中等密码强度校验函数
export function validateUserPassword(password: string) {
  // 正则表达式：至少包含4类中的3类，且长度≥8
  const regex =
    /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$).{8,}$/
  return regex.test(password)
}

// 高等强度密码校验函数
// 规则：同时包含大写字母、小写字母、数字、特殊字符，长度≥10，无连续3个相同字符
export function validateHighStrengthPassword(password: string) {
  const regex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*(.)\1\1).{10,}$/
  return regex.test(password)
}

export function validateColumnRule(col: any, rule: any, value: any, locale, callback: any) {
  const { t } = i18n.global

  if (!value && col.isRequire === 'YES') {
    callback(new Error(getLangText(col.displayName, locale)  + ' ' + t('validate.required')))
    return
  }
  if (col.type === 'STRING') {
    if (col.minLength > 0) {
      if (!value || value.length < col.minLength) {
        callback(new Error(getLangText(col.displayName, locale)  + ' ' + t('validate.minLength')   + ' ' + col.minLength))
        return
      }
    }
    if (col.isI18n === 'YES') {
      const json = safeParseJson(value)
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          const i18nValue = json[key as keyof typeof json];
          if (i18nValue !== null && i18nValue !== undefined && i18nValue.length > col.maxLength) {
            callback(new Error(getLangText(col.displayName, locale)  + ' ' + t('validate.maxLength')   + ' ' + col.maxLength))
            return
          }
        }
      }
    } else {
      if (value !== null && value !== undefined && value.length > col.maxLength) {
        callback(new Error(getLangText(col.displayName, locale)  + ' ' + t('validate.maxLength')   + ' ' + col.maxLength))
        return
      }
    }
  }
  if (
    col.type === 'BYTE' ||
    col.type === 'SHORT' ||
    col.type === 'INT' ||
    col.type === 'LONG' ||
    col.type === 'FLOAT' ||
    col.type === 'DOUBLE'
  ) {
    if (parseInt(value) < col.min) {
      callback(new Error(getLangText(col.displayName, locale) + ' ' +  t('validate.min')   + ' ' + col.min))
      return
    }
    if (parseInt(value) > col.max) {
      callback(new Error(getLangText(col.displayName, locale)  + ' ' + t('validate.max')   + ' ' + col.max))
      return
    }

    /**
     * TODO 支持各种常用pattern校验
     */
  }
  callback()
}
