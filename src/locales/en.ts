// en.ts
export default {
  title: 'LGAG',
  subTitle: 'LGAG',
  add: 'Add',
  ok: 'Confirm',
  save: 'Save',
  close: 'Close',
  cancel: 'Cancel',
  search: 'Search',
  deleteWarn: 'Are you sure to delete this record?',
  warning: 'Warning',
  platform: 'Platform Settings',
  platformCommon: {
    title: 'Platform General',
    favoriteSettings: 'Preference Settings',
    personalInformation: 'Personal Information',
    passwordSettings: 'Password Settings',
    appearanceSettings: 'Appearance Settings',
    languageSettings: 'Language Settings',
  },
  platformGroup: {
    syncSchema: 'Sync Generate',
  },
  baseCommon: 'Common Functions',
  resourceGroups: 'Resource Groups',
  resources: 'Platform Resources',
  schemaDefines: 'Form Settings',
  exit: 'Exit',
  help: 'Help & Support',
  description: 'Description',
  theme: 'Theme',
  layout: 'Layout',
  skin: 'Skin',
  fullscreenTooltip: 'Full Screen',
  columnVisibleSet: 'Customize Column Display',
  exitFullscreenTooltip: 'Exit Full Screen',
  error404: 'The accessed page does not exist',
  errorAuthorizeFailed: 'You do not have permission to access this page. Please contact the administrator if needed.',
  errorLoadComponent: 'Please check if the front-end component path configuration is correct',
  goBackHome: 'Back to Home',
  goBackLastPage: 'Back to Previous Page',
  operationSuccess: 'Operation Successful',
  operationFailed: 'Operation Failed',
  appearanceSettingsTheme: 'Theme Settings',
  appearanceSettingsFont: 'Font Settings',
  appearanceSettingsLayout: 'Layout Settings',
  appearanceSettingsFavorite: 'Personalization Settings',
  appearanceTheme: {
    themeGreen: 'Particle Green',
    themeBlue: 'Tech Blue',
    themeDark: 'Cool Black',
    themeLight: 'Bright Style',
  },
  appearanceFontSize: {
    small: 'Small',
    default: 'Medium',
    defaultWarn: 'Recommended for displays with resolution above 1400',
    large: 'Large',
    largeWarn: 'Recommended for displays with resolution above 1600',
  },
  appearanceLayout: {
    tagView: 'Tab View Navigation Mode',
    breadCrumbView: 'Breadcrumb Navigation Mode',
  },
  appearanceLanguage: {
    showLanguage: 'Display Language',
    zh: 'Chinese (Simplified)',
    en: 'English',
    changeWarn: 'Refresh browser to apply language changes?',
  },
  appearanceFavorite: {
    popupMode: 'Form Popup Mode',
    dialog: 'Dialog',
    drawer: 'Drawer',
    drawerDirection: 'Drawer Direction',
    drawerDirectionRtl: 'Right',
    drawerDirectionLtr: 'Left',
    drawerDirectionTtb: 'Top',
    drawerDirectionBtt: 'Bottom',
    closeOnClickModal: 'Form Close Method',
    closeOnClickModalEnable: 'Close on click outside',
    closeOnClickModalDisabled: 'Do not close on click outside',
  },
  passwordModify: {
    oldPasswordLabel: "Original Password",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm Password",
    placeholders: {
      oldPassword: "Please enter original password",
      newPassword: "Please enter new password (8-20 characters, including letters and numbers)",
      confirmPassword: "Please re-enter new password"
    },
    buttons: {
      submit: "Submit Modification"
    },
    passwordStrength: {
      label: "Password Strength: ",
      levels: {
        "0": "None",
        "1": "Weak",
        "2": "Medium",
        "3": "Strong"
      },
      tips: {
        "0": "Please enter password",
        "1": "Password strength is too low, please increase length or complexity",
        "2": "Password strength is medium, add special characters to improve strength",
        "3": "Password strength is excellent, high security"
      }
    },
    validateRules: {
      requiredOldPwd: "Please enter original password",
      requiredNewPwd: "Please enter new password",
      requiredConfirmPwd: "Please confirm new password",
      passwordLength: "Password length must be 8 to 20 characters",
      passwordComplexity: "Password must contain letters and numbers",
      passwordNotMatch: "The two passwords entered do not match"
    },
    messages: {
      modifySuccess: "Password modified successfully!",
      validateError: "Validation failed, please check your input!"
    }
  },
  pager: {
    total: 'Total',
    row: 'items',
  },
  table: {
    loadingTableColumnsError: 'Failed to load table metadata',
    loadingTableDataError: 'Failed to load data',
    loading: 'Loading',
    emptyText: 'No data available',
    operation: 'Operations',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    role: 'Role',
    save: 'Save',
    startDate: 'Start Date',
    endDate: 'End Date',
    rangeSeparator: 'to'
  },
  validate: {
    minLength: 'Minimum Length',
    maxLength: 'Maximum Length',
    min: 'Minimum',
    max: 'Maximum',
    required: 'Required',
    email: 'Invalid email format',
    noChinese: 'Chinese characters are not allowed'
  },
  user: {
    basic: 'Basic Information',
    realName: 'Full Name'
  }
} as const
