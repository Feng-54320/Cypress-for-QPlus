const { Client } = require('ssh2'); // 引入ssh2库的Client类  

// 创建一个SSH客户端实例  
const conn = new Client();

// 当SSH连接准备好后触发  
conn.on('ready', () => {
  console.log('Client :: ready'); // 打印连接成功信息  

  // 在服务器上执行命令以创建一个新文件  
  conn.exec('touch /root/feng/fengfile.txt', (err, stream) => {
    if (err) throw err; // 如果执行命令出错，则抛出错误  

    // 当命令执行完毕后触发  
    stream.on('close', (code, signal) => {
      if (code !== 0) {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal); // 如果命令执行失败，打印退出码和信号  
        return;
      }
      console.log('File created successfully'); // 打印文件创建成功信息  

      // 在服务器上执行命令以将文件复制到另一个目录  
      conn.exec('cp /root/feng/fengfile.txt /root/feng/feng01', (err2, stream2) => {
        if (err2) throw err2; // 如果复制命令出错，则抛出错误  

        // 当复制命令执行完毕后触发  
        stream2.on('close', (code2, signal2) => {
          if (code2 !== 0) {
            console.log('Stream 2 :: close :: code: ' + code2 + ', signal: ' + signal2); // 如果复制命令执行失败，打印退出码和信号  
            return;
          }
          console.log('File copied successfully'); // 打印文件复制成功信息  

          // 关闭SSH连接  
          conn.end();
        })
          .on('data', (data) => {
            console.log(`STDOUT: ${data}`); // 打印命令的标准输出  
          })
          .stderr.on('data', (data) => {
            console.error(`STDERR: ${data}`); // 打印命令的标准错误输出  
          });
      });
    })
      .on('data', (data) => {
        console.log(`STDOUT: ${data}`); // 打印创建文件命令的标准输出  
      })
      .stderr.on('data', (data) => {
        console.error(`STDERR: ${data}`); // 打印创建文件命令的标准错误输出  
      });
  });
})
  .connect({
    host: '10.10.168.45', // 服务器IP地址  
    port: 22, // SSH端口，默认为22  
    username: 'root', // 用户名  
    password: 'letsg0' // 密码（或者使用privateKey选项进行密钥认证）  
  });

// 如果连接过程中出现错误，则打印错误信息  
conn.on('error', (err) => {
  console.log('Error connecting:', err);
});

// 设置一个超时，示例：5秒后断开连接（你可以根据实际需要调整这个时间）  
setTimeout(() => {
  conn.end();
}, 5000);

// 注意：在实际应用中，你可能不需要这个超时，因为当所有操作都完成后，你通常会主动调用conn.end()来关闭连接