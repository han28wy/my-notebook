### 对node的理解
是一个JavaScript的yung语言运行环境，也就是说，node.js是运行在服务端的JavaScript，它为JavaScript提供了一些服务，比如文件管理，网络，数据库等。

执行npm run dev后，触发webpack构建过程，首先读取webpack.config.js配置文件，然后分析模块依赖，这个要从entry开始，最后形成一个模块的依赖图。然后根据这个依赖图，使用loader和plugin对模块进行处理。最后打包成对应文件。
这些加载器和插件都是基于Node.js开发的，所以用require引入这些。


### 运行脚本命令 去传递参数
1 命令行 —— package.json 里配置
```"zip": "node zip.js $npm_config_arg1"
```
2 脚本里接收参数 —— zip.js
```const arg1 = process.env.npm_config_arg1;
```
3 运行命令
```npm run zip --arg1=1111
```

### 一个node.js文件，批量执行不同环境的打包并且压缩成不同名称的zip文件
```
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');
const fs = require('fs');

// 执行 npm 脚本打包
function runBuildScript(scriptName) {
  try {
    console.log(`正在执行 ${scriptName}`);
    execSync(`npm run ${scriptName}`, { stdio: 'inherit' });
    console.log(`打包脚本 ${scriptName} 执行成功`);
  } catch (error) {
    console.error(`打包脚本 ${scriptName} 执行失败:`, error);
    process.exit(1);
  }
}

// 压缩文件夹为 ZIP 文件并重命名
function compressAndRenameFolder(folderPath, zipName) {
  const zipPath = `./${zipName}.zip`;
  // 创建一个新的压缩文件实例
  const zip = new AdmZip();
  // 将文件夹添加到压缩文件
  zip.addLocalFolder(folderPath);
  // 保存压缩文件
  zip.writeZip(zipPath, (err) => {
    if (err) {
      console.error('压缩文件保存失败:', err);
      process.exit(1);
    } else {
      console.log('压缩文件保存成功');
    }
  });
  // 重命名压缩文件
  fs.renameSync(zipPath, `./${zipName}.zip`);
  console.log(`压缩文件已重命名为 ${zipName}.zip`);
}
// 使用 npm 脚本打包并压缩
function buildAndZip(scriptName, zipName) {
  runBuildScript(scriptName);
  compressAndRenameFolder('./dist', zipName);
}
// 执行 npm 脚本打包并压缩
buildAndZip('build:sit', 'name1');
buildAndZip('build', 'name2');
```
### 可以改造npm script命令，比如npm run build && node compress.js 先打包后压缩
```
const AdmZip = require('adm-zip');
const fs = require('fs');
const folderPath = './oldName';
const zipPath = './newName.zip';
// 创建一个新的压缩文件实例
const zip = new AdmZip();
// 将文件夹添加到压缩文件
zip.addLocalFolder(folderPath);
// 保存压缩文件
zip.writeZip(zipPath, (err) => {
  if (err) {
    console.error('压缩文件保存失败:', err);
  } else {
    console.log('压缩文件保存成功');
  }
});
// 重命名压缩文件
fs.renameSync(zipPath, './newName.zip');
console.log('压缩文件已重命名为 newName.zip');
```
 