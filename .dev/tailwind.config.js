/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx,vue}',
    './ucode/template/themes/**/*.ut',
    './htdocs/**/*.{html,js}',
    // 包含 LuCI 相关的模板文件
    '../**/*.ut'
  ],
  // 暗色模式配置
  darkMode: ['class', '[data-darkmode="true"]']
}
