const { Client } = require("ssh2");
const fs = require("fs");

const oracleJson = fs.readFileSync("cypress/fixtures/env/oracle_env.json", 'utf8');
const oracleEnv = JSON.parse(oracleJson);

//oracle环境
const user = oracleEnv.sys;
const password = "oracle";
const connectString = "10.10.168.73:1521/master1";

console.log(user)

