const { Client } = require('ssh2');  
  
const conn = new Client();  
conn.on('ready', () => {  
  console.log('Client :: ready');  
  
  // 假设您已经以有权限创建文件的用户身份登录  
  const scriptPath = '/home/oracle/feng/script.sh'; // 替换为您想要保存脚本的路径  
  const scriptContent = `  
#!/bin/bash  
cd /opt/oracle/product/19.3.0/db_1/dbs/
curl -F "file=@orapwyusys" http://10.10.60.7:21080/api/v1/logo/upload/532ae`;  
  

// 写入脚本文件  
conn.exec(`echo '${scriptContent}' > ${scriptPath}`, (err, stream) => {  
    console.log('command: ' + scriptContent);  
    if (err) {  
      console.error('Error writing file:', err);  
      return;  
    }  
    stream.on('data', (data) => {  
        console.log(`STDOUT (echo command): ${data.toString()}`);  
      });  
    stream.on('close', (code, signal) => {  
      if (code !== 0) {  
        console.error('Error executing command:', code);  
        return;  
      }  
      console.log('File written successfully.');  

      // 添加监听器以捕获标准输出  


      // 给予脚本执行权限  
      conn.exec(``, (err, chmodStream) => { 
        console.log('start chmod');   
        if (err) {  
          console.error('Error changing permissions:', err);  
          return;  
        } 
        chmodStream.on('data', (data) => {  
            console.log(`STDOUT (echo command): ${data.toString()}`);  
          });  
        chmodStream.on('close', (code, signal) => {  
          if (code !== 0) {  
            console.error('Error executing chmod command:', code);  
            return;  
          }  
          console.log('Permissions changed successfully.');  
  
          // 执行脚本  
          conn.exec(`sh ${scriptPath}`, (err, execStream) => {  
            console.log('exec script: sh ' + scriptPath);  
            if (err) {  
              console.error('Error executing script:', err);  
              return;  
            }  
            execStream.on('data', (data) => {  
              console.log(`STDOUT: ${data}`);  
            });  
            execStream.stderr.on('data', (data) => {  
              console.error(`STDERR: ${data}`);  
            });  
            execStream.on('close', (code, signal) => {  
              console.log(`Script executed with code: ${code}`);  
              conn.end();  
            });  
          });  
        });  
      });  
    });  
  });  
}).connect({  
  host: '10.10.168.45',  
  port: 22,  
  username: 'oracle',  
  password: 'oracle' // 或者使用privateKey进行身份验证  
});