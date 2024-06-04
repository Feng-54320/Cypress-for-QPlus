//写文件任务
const fs = require('fs');  
const path = require('path');  
  
module.exports = (on, config) => {  
  on('task', {  
    writeFile(options) {  
      const { text, filePath } = options;  
      const fullPath = path.resolve(filePath);  
  
      // 确保目录存在  
      if (!fs.existsSync(path.dirname(fullPath))) {  
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });  
      }  
  
      // 写入文件  
      fs.writeFileSync(fullPath, text);  
  
      return null; // 或者返回写入状态等  
    }  
  });  
};