// en.ts
export default {
  title: 'System Operation Center',
  subTitle: 'LGAG',
  add: 'Add',
  ok: 'Confirm',
  save: 'Save',
  close: 'Close',
  cancel: 'Cancel',
  search: 'Query',
  deleteWarn: 'Are you sure to delete this record?',
  frame: 'System Settings',
  warning: 'Reminder',
  platform: 'Platform Settings',
  platformGroup: {
    syncSchema: 'Synchronize Generation',
  },
  baseCommon: 'Common Functions',
  resourceGroups: 'Menu Groups',
  schemaDefines: 'Form Settings',
  exit: 'Exit',
  help: 'Help & Support',
  description: '',
  theme: 'Appearance',
  layout: 'Layout',
  skin: 'Skin',
  fullscreenTooltip: 'Full Screen',
  columnVisibleSet: 'Custom Column Display',
  exitFullscreenTooltip: 'Exit Full Screen',
  error404: 'The accessed page does not exist',
  errorAuthorizeFailed: 'You do not have permission to access this page. Please contact the administrator if needed.',
  errorLoadComponent: 'Please check if the front-end component path configuration is correct',
  goBackHome: 'Return to Home',
  goBackLastPage: 'Return to Previous Page',
  operationSuccess: 'Operation succeeded',
  operationFailed: 'Operation failed',
  favoriteSettings: 'Preference Settings',
  personalInformation: 'Personal Information',
  passwordSettings: 'Password Settings',
  appearanceSettings: 'Display Settings',
  languageSettings: 'Language Settings',
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
    changeWarn: 'Refresh browser to apply language settings?',
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
    closeOnClickModal: 'Form Close Mode',
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
      passwordNotMatch: "Two password entries do not match"
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
    startDate: 'Start Time',
    endDate: 'End Time',
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
