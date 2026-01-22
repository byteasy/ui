// en.ts
export default {
  title: 'Byteasy',
  description: 'Byteasy aims to provide a one-stop tool platform for technical professionals, facilitating development and troubleshooting for developers and testers. It includes tools for HTTP/HTTPS, WebSocket, TCP, and UDP packet capture, network protocol analysis, middleware diagnostic and debugging tools, as well as commonly used development and testing utilities.',
  theme: 'Theme',
  layout: 'Layout',
  skin: 'Skin',
  error404: 'Page not found',
  backLastPage: 'Go back',
  operationSuccess: 'Success',
  pager: {
    total: 'Total',
    row: 'records'
  },
  validate: {
    minLength: 'Minimum length',
    maxLength: 'Maximum length',
    min: 'Minimum',
    max: 'Maximum',
    required: 'Required field',
    email: 'Invalid email format'
  },
  navMenu: {
    home: 'Home',
    market: 'Plugins',
    netTools: 'Network Tools',
    middleWare: 'Middleware',
  },
  netTools: {
    fiddler: 'HTTP Packet Capture',
    tcp: 'TCP Packet Capture'
  },
  fiddler: {
    time: 'Time',
    url: 'URL',
    protocol: 'Protocol',
    method: 'Method',
    status: 'Status',
    costTime: 'Duration',
    host: 'Host',
    port: 'Port',
    requestSize: 'Request Size',
    responseSize: 'Response Size',
    clientIp: 'Source Address',
    serverIp: 'Server Address',
    request: 'Request',
    response: 'Response'
  }
} as const // 使用 as const 获得更精确的类型
