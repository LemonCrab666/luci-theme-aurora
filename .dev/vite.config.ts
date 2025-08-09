import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件目录
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = resolve(__dirname, '..')

export default defineConfig({
  plugins: [
    // @ts-ignore - TailwindCSS v4插件类型兼容性问题
    tailwindcss(),
  ],
  build: {
    outDir: resolve(projectRoot, 'htdocs/luci-static'),
    emptyOutDir: false, // 不清空目录，避免删除其他文件
    // CSS 使用 lightningcss 压缩以获得更高压缩率
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: {
        // 主要入口  
        main: resolve(__dirname, 'src/scripts/main.js'),
        style: resolve(__dirname, 'src/styles/main.css'),
        // 登录页面专用入口
        login: resolve(__dirname, 'src/scripts/login.js'),
        // 移动端样式单独打包
        mobile: resolve(__dirname, 'src/styles/mobile.css')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // 为JS文件添加design主题后缀，避免与LuCI原有文件重名
          return 'resources/[name]-design.js'
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || ''
          
          // CSS 文件
          if (info.endsWith('.css')) {
            return 'design/[name].[ext]'
          }
          
          // 图片资源
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(info)) {
            return 'design/images/[name].[ext]'
          }
          
          // 字体资源
          if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
            return 'design/fonts/[name].[ext]'
          }
          
          // 其他资源
          return 'design/[name].[ext]'
        },
        chunkFileNames: 'resources/chunks/[name]-[hash].js',
        // 手动代码分割
        manualChunks: (id) => {
          // 将工具函数单独打包
          if (id.includes('/utils.js')) {
            return 'utils'
          }
          // 将菜单系统单独打包
          if (id.includes('/menu.js')) {
            return 'menu'
          }
          // 将认证系统单独打包
          if (id.includes('/auth.js')) {
            return 'auth'
          }
        }
      }
    },
    assetsInlineLimit: (filePath, content) => {
      // logo文件不内联
      if (filePath.includes('logo')) {
        return false;
      }
      // 其他小于4KB的资源内联
      return content.length < 4096;
    },
    // JS 使用 terser 进行更彻底的压缩（需要安装 terser）
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        ecma: 2018,
        // 可选：移除无用的函数调用
        pure_funcs: ['console.info', 'console.debug', 'console.trace']
      },
      mangle: {
        toplevel: true,
        safari10: false
      },
      format: {
        comments: false
      }
    },
    sourcemap: false,
    target: 'es2018', // 支持较旧的浏览器
    cssCodeSplit: true, // CSS代码分割
    cssTarget: 'es2018'
  },
  server: {
    port: 3000,
    open: false,
    cors: true,
    host: true // 允许外部访问
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@scripts': resolve(__dirname, 'src/scripts'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  // 优化依赖处理
  optimizeDeps: {
    include: [],
    exclude: []
  },
  // 静态资源处理
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp']
})