#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

// 删除目录下的所有子项
function removeAllChildren(targetDir) {
  if (!fs.existsSync(targetDir)) return;
  for (const item of fs.readdirSync(targetDir)) {
    const itemPath = path.join(targetDir, item);
    fs.rmSync(itemPath, { recursive: true, force: true });
  }
}

function cleanBuildOutput() {
  // 从 .dev/ 目录向上一级到项目根目录
  const projectRoot = path.resolve('..'); 
  const auroraDir = path.join(projectRoot, 'htdocs', 'luci-static', 'aurora');
  const resourcesDir = path.join(projectRoot, 'htdocs', 'luci-static', 'resources');

  console.log('🧹 开始清理构建产物...');

  // 清理 aurora 目录（保留 public）
  if (fs.existsSync(auroraDir)) {
    for (const item of fs.readdirSync(auroraDir)) {
      if (item !== 'public') {
        const itemPath = path.join(auroraDir, item);
        console.log(`   删除: ${itemPath}`);
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else {
        console.log(`   保留: ${path.join(auroraDir, 'public')}`);
      }
    }
  }

  // 保留 resources 目录，仅清空其内容
  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
  } else {
    console.log(`   清空: ${resourcesDir}/*`);
    removeAllChildren(resourcesDir);
  }

  console.log('✅ 清理完成！');
}

cleanBuildOutput();
