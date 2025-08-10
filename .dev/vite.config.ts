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
    emptyOutDir: false,
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: {
        // JS 主要入口改为 resource
        main: resolve(__dirname, 'src/resource/main.js'),
        // 登录页面脚本保持层级：resource/view/design/login.js -> resources/view/design/login-design.js
        'view/design/login': resolve(__dirname, 'src/resource/view/design/login.js'),
        // CSS 入口改为 media，保持层级：media/main.css -> design/main.css
        style: resolve(__dirname, 'src/media/main.css'),
        // 移动端样式单独打包：media/mobile.css -> design/mobile.css
        mobile: resolve(__dirname, 'src/media/mobile.css')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // JS 输出到 resources，保持入口名（包含子路径）并加 -design 后缀
          // 例如 'view/design/login' -> resources/view/design/login-design.js
          const name = chunkInfo.name || 'index'
          if (name.includes('/')) {
            return `resources/${name}-design.js`
          }
          return 'resources/[name]-design.js'
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || ''
          // CSS 放到 design/ 目录，保持文件名
          if (info.endsWith('.css')) {
            return 'design/[name].[ext]'
          }
          // 图片资源
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(info)) {
            return 'design/[name].[ext]'
          }
          // 字体资源
          if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
            return 'design/[name].[ext]'
          }
          return 'design/[name].[ext]'
        },
        chunkFileNames: 'resources/[name]-design-[hash].js',
        manualChunks: (id) => {
          if (id.includes('/utils.js')) return 'utils'
          if (id.includes('/menu.js')) return 'menu'
          if (id.includes('/auth.js')) return 'auth'
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
      '@media': resolve(__dirname, 'src/media'),
      '@resource': resolve(__dirname, 'src/resource'),
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