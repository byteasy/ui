// src/types/table.ts
import type {Component} from 'vue'

/**
 * 树形结构配置项
 */
export interface TreePropsConfig {
  hasChildren?: string
  children?: string
  checkStrictly?: boolean

  [key: string]: any
}

/**
 * 通用标准表格属性模型 (BeTable Props)
 */
export interface BeTableProps {
  /**
   * 后端实体类名 / 元数据唯一标识（必填）
   * @example 'com.byteasy.entity.SysUser'
   */
  className: string

  /**
   * 查询列表数据的 OpenAPI 方法名或接口 URL（必填）
   */
  apiQuery: string

  /**
   * 保存/新增/修改接口
   */
  apiSave?: string

  /**
   * 单条删除接口
   */
  apiDelete?: string

  /**
   * 批量删除接口
   */
  apiBatchDelete?: string

  /**
   * 下载 Excel 导入模板接口
   */
  apiDownloadImportTemplate?: string

  /**
   * Excel 导入解析预览接口
   */
  apiImportPreview?: string

  /**
   * Excel 批量导入确认保存接口
   */
  apiImportBatchSave?: string

  /**
   * 数据导出接口
   */
  apiExport?: string

  /**
   * 行数据的主展示字段名，用于弹窗标题或确认删除提示（默认通常为 'name' 或 'id'）
   */
  titleColumnName?: string

  /**
   * 表单抽屉/弹窗宽度（支持像素数字或百分比字符串，如 600 或 '50%'）
   */
  formWidth?: string | number

  /**
   * 操作列固定宽度（默认通常为 160）
   */
  operationColumnWidth?: number

  /**
   * 是否显示分页器
   * @default true
   */
  paginationVisible?: boolean

  /**
   * 是否显示顶部查询表单栏
   * @default true
   */
  queryFormVisible?: boolean

  /**
   * 表单弹窗模式（true 为 Dialog 对话框，false 为 Drawer 抽屉）
   */
  dialogModel?: boolean

  /**
   * 行数据的唯一标识字段名
   * @default 'id'
   */
  rowKey?: string

  /**
   * 树形表格是否默认展开所有子节点
   * @default false
   */
  defaultExpandAll?: boolean

  /**
   * 树形表格属性配置映射
   */
  treeProps?: TreePropsConfig

  /**
   * 多语言展示语种标识（如 'zh_CN', 'en_US'）
   */
  showLang?: string

  /**
   * 是否为纯查询/查看模式（开启后隐藏增删改操作）
   * @default false
   */
  queryMode?: boolean

  /**
   * 是否开启多选（Checkbox 选择列）
   * @default false
   */
  multiple?: boolean

  /**
   * 表格底部是否显示合计行
   * @default false
   */
  showSummary?: boolean

  /**
   * 自定义新增/编辑表单组件（支持组件对象或异步组件）
   */
  formComponent?: Component | null

  /**
   * 自定义 Excel 导入组件
   */
  excelImportComponent?: Component | null

  /**
   * 自定义 Excel 导出组件
   */
  excelExportComponent?: Component | null

  /**
   * 表格行双击事件回调
   */
  rowDbClick?: (row: any) => void

  /**
   * 表格数据加载并渲染完成后的钩子函数
   */
  dataRenderFinish?: (tableData: any) => void

  /**
   * 拓展上下文对象（传递给枚举列、自定义列等）
   */
  context?: any
}

// src/enums/tableActionEnum.ts

/**
 * 表格工具栏/更多操作下拉菜单的动作指令枚举
 */
export enum TableToolbarActionEnum {
  /** 切换视图模式 */
  SWITCH_VIEW = 'switchView',

  /** 自定义列配置 */
  COLUMN_DEFINE = 'columnDefine',

  /** 下载 Excel 导入模板 */
  DOWNLOAD_EXCEL_TEMPLATE = 'downLoadExcelTemplate',

  /** Excel 数据导入 */
  EXCEL_IMPORT = 'excelImport',

  /** Excel 数据导出 */
  EXCEL_EXPORT = 'excelExport',

  /** 刷新数据 */
  REFRESH = 'refresh',

  /** 添加 */
  ADD = 'add',

  /** 批量添加 */
  BATCH_ADD = "batchAdd",

  /** 批量编辑 */
  TABLE_EDITOR_BATCH_EDIT = 'tableEditorBatchEdit',

  /** 批量保存 */
  TABLE_EDITOR_BATCH_SAVE = 'tableEditorBatchSave',

  TABLE_EDITOR_CANCEL = 'tableEditorCancel',

  /** 增加行 */
  TABLE_EDITOR_ADD_ROW = 'tableEditorAddRow',

  /** 批量删除  */
  TABLE_EDITOR_BATCH_REMOVE = 'tableEditorBatchRemove',

  /** 批量删除 */
  BATCH_DELETE = 'batchDelete',

  /** 打印数据 */
  PRINT = 'print',
}

/**
 * 表格行内标准操作动作指令枚举 (Row Actions)
 */
export enum TableRowActionEnum {
  /** 查看详情 */
  VIEW = 'view',

  /** 编辑行数据 */
  EDIT = 'edit',

  /** 删除单行 */
  DELETE = 'delete',

  /** 从明细表打开关联弹窗 */
  DETAIL_TABLE = 'detailTable',
}

/**
 * 联合类型（供外部需要纯字面量类型校验时使用）
 */
export type TableMoreActionType = `${TableToolbarActionEnum}`
export type TableRowActionType = `${TableRowActionEnum}`

export interface BeColumn {
  className: string
  name: string
  fieldName: string
  displayName: string
  description: string
  type: string // 若值固定（如 STRING/Number），可改为 "STRING" | "NUMBER" 限定
  typeClassName: string
  isShow: 'YES' | 'NO' // 枚举值用联合类型限定
  isSort: 'YES' | 'NO'
  isOverflow: 'YES' | 'NO'
  isSearch: 'YES' | 'NO'
  isFixed: 'YES' | 'NO'
  isRequire: 'YES' | 'NO'
  isForm: 'YES' | 'NO'
  isPrimary: 'YES' | 'NO'
  isI18n: 'YES' | 'NO'
  align: 'LEFT' | 'CENTER' | 'RIGHT'
  width: number
  showOrder: number
  minLength: number
  maxLength: number
  min: number
  max: number
  groupId: number
  textareaRows: number
  externalClassAutoFill: boolean
  precision: number
  multiple: 'YES' | 'NO'
  relationType: 'EXTERNAL_KEY' | 'DETAIL_TABLE' | null | undefined
  externalClass: string | null | undefined
  externalClassPrimaryField: string | null | undefined
  externalClassDisplayField: string | null | undefined
  innerPrimaryField: string | null | undefined
  extrasParams: string
  fieldComponent: string
}
