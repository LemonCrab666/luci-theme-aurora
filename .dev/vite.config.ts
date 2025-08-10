import { defineConfig, Plugin, ResolvedConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve, join, relative, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFile, mkdir, writeFile, readdir } from 'fs/promises'
import { minify as terserMinify } from 'terser'

// 获取当前文件目录
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = resolve(__dirname, '..')

// 递归扫描文件
async function walkDirectory(dir: string, extensions?: string[]): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walkDirectory(fullPath, extensions))
    } else if (entry.isFile()) {
      if (!extensions || extensions.some(ext => fullPath.endsWith(ext))) {
        files.push(fullPath)
      }
    }
  }
  return files
}

// LuCI JS 压缩插件
function createLuciJsCompressPlugin(srcDir: string, outRelativeDir: string): Plugin {
  let outDir: string
  let rootDir: string
  let jsFiles: string[] = []
  
  return {
    name: 'luci-js-compress',
    apply: 'build',
    
    configResolved(config: ResolvedConfig) {
      outDir = config.build.outDir
    },
    
    async buildStart() {
      rootDir = resolve(__dirname, srcDir)
      jsFiles = await walkDirectory(rootDir, ['.js'])
    },
    
    async generateBundle() {
      for (const absolutePath of jsFiles) {
        try {
          const sourceCode = await readFile(absolutePath, 'utf-8')
          
          // Terser 压缩，保留 LuCI 语法
          const compressed = await terserMinify(sourceCode, {
            parse: { bare_returns: true },
            compress: false,
            mangle: false,
            format: { comments: false, beautify: false }
          })
          
          const relativePath = relative(rootDir, absolutePath).replace(/\\/g, '/')
          const outputPath = join(outDir, outRelativeDir, relativePath)
          
          await mkdir(dirname(outputPath), { recursive: true })
          await writeFile(outputPath, compressed.code || sourceCode, 'utf-8')
        } catch (error: any) {
          console.error(`LuCI JS compress failed for ${absolutePath}:`, error?.message)
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    // @ts-ignore - TailwindCSS v4插件类型兼容性问题
    tailwindcss(),
    createLuciJsCompressPlugin('src/resource', 'resources')
  ],
  
  // 静态资源目录，直接复制到输出目录
  publicDir: resolve(__dirname, 'src/assets'),
  
  build: {
    outDir: resolve(projectRoot, 'htdocs/luci-static'),
    emptyOutDir: false,
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: {
        // CSS 入口改为 media，保持层级：media/main.css -> design/main.css
        style: resolve(__dirname, 'src/media/main.css'),
        // 移动端样式单独打包：media/mobile.css -> design/mobile.css
        mobile: resolve(__dirname, 'src/media/mobile.css')
      },
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || ''
          // CSS 放到 design/ 目录，保持文件名
          if (info.endsWith('.css')) {
            return 'design/[name].[ext]'
          }
          return 'design/[name].[ext]'
        }
      }
    },
    sourcemap: false,
    target: 'es2018',
    cssCodeSplit: true,
    cssTarget: 'es2018'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@media': resolve(__dirname, 'src/media'),
      '@resource': resolve(__dirname, 'src/resource'),
      '@assets': resolve(__dirname, 'src/assets/design')
    }
  }
})