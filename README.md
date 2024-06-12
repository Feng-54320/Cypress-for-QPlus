## Cypress-for-QPlus
### 1. 编码规范
- **文件名**：文件的命名如模块或页面使用小写字母和下划线。每个代码文件的命名需要反应清楚该文件在测试框架中的层级和功能，如页面层以”xxx_page.cy.js”命名，例：login_page.cy.js；用例层以”test_xxx.cy.js”命名，例：”test_login.cy.js”。其中配置文件的命名需要反应出该配置文件的用途以及环境，例：框架的配置文件 ”cypress.config.js”；连接某一数据库的环境配置文件 ”oracle_env.json”。
- **类**：使用首字母大写的**大驼峰**命名方式，类名要反应出该类所封装的功能或者工具。例：“class LoginPage”，“class Utils”，”class QAsserts”。
- **变量和函数**：函数和变量名使用**小驼峰**命名，尽量不使用缩写，要见名知意，设计函数时，需要把常用的公共功能封装进Utils类中，例如 “findElement()”。某页面的常用功能提取封装进页面类中，例如 ”typeUsername”。变量名的设计需要反应变量的作用，例如 ”let qplusEnv”，”let oracleEnv”。
- **注释**：函数必须进行头部注释，简要说明功能。类需要添加文档注释，说明类的属性和成员函数的功能，用例必须用单行注释说明步骤。
- **缩进**：每**2个空格**为一个缩进，所有函数体与函数声明保持一个缩进。
- **断言设计**：对原生的断言做二次封装时，断言的函数名需要反应断言的具体功能，并以小驼峰方式命名，例如断言备库状态：”assertDBStatus”；断言页面上存在某文本：”assertText”。
- 代码需提交 pr，review 通过之后，⽅可合⼊ master



### 2. 框架
```
Cypress for Qplus/
├── e2e/
│   ├── testcases/       # 用例层
│   │   ├── test_login.cy.js
│   │   ├── test_create_bakdb.cy.js
│   │   ├── test_add_user.cy.js
│   │   ├── test_resource_manage.cy.js
│   │   └── …
│   │
│   ├── pages/           # 页面层
│   │   ├── oracle_page
│   │   │   ├── dbbackup_page
│   │   │   │   ├── bak_oracle_info_page.cy.js
│   │   │   │   ├── manual_commands_page.cy.js
│   │   │   │   ├── src_oracle_info_page.cy.js
│   │   │   │   └── …
│   │   │   ├── recovery_page
│   │   │   │   ├── xxx.cy.js
│   │   │   │   └── …
│   │   │
│   │   ├── mysql_page
│   │   └── …
│   │
│   ├── fixtures/        # 数据层
│   │   ├── data         # 用例数据
│   │   │   ├── user.json
│   │   │   └── …
│   │   ├── env          # 环境配置
│   │   │   ├── oracle_env.json
│   │   │   ├── qplus_url.json
│   │   │   └── …
│   │   ├── locator      # 元素定位
│   │   │   ├── oracle
│   │   │   │   ├── dbbackup
│   │   │   │   │   ├── xxx_elements.json
│   │   │   │   │   └── …
│   │   │   │   ├── recovery
│   │   │   │   │   ├── xxx_elements.json
│   │   │   │   │   └── …
│   │   │   ├── mysql
│   │   │   │   ├── dbbackup
│   │   │   │   │   ├── xxx_elements.json
│   │   │   │   │   └── …
│   │ 
│   ├── support/         # 公共函数
│   │   ├── commands.js  # 自定义命令
│   │   ├── utils.js     # 封装自定义工具函数等
│   │   └── qasserts.js  # 封装自定义断言以及公共验证函数
│   │
│   ├── task/            # js脚本
│   │   ├── oracle
│   │   │   ├── ssh2_xxx.js
│   │   │   └── …
│   │   ├── mysql
│   │   │   ├── ssh2_xxx.js
│   │   │   └── …
│   │
│   ├── plugins/         # 插件配置
│   │   ├── index.js
│   │   └── …
│   │
│   ├── screenshot/      # 测试截图
│   └── … (自动生成)
│   │
├── README.md            # 项目自述文档
```

### 3. 用例设计规范
#### 测试用例
1. 每个测试用例应该有一个简洁且描述性的名称，清楚地表明测试的目的
2. 测试用例分为三个部分：
    - 设置测试数据和环境
    - 执行操作
    - 进行断言（Assert）
3. 测试用例设计：计每个测试用例时，确保用例涵盖以下几个方面
    - 前置条件：登录操作、必要的初始化操作等。
    - 执行步骤：创建备库操作、执行数据库查询等操作
    - 断言：验证主库、备库的数据的存在、完整性和数据正确性等
4. 场景覆盖
    - 全场景闭环：从全业务出发，覆盖用户在全业务里的关键使用场景。 
    - 功能模块场景闭环：从模块功能出发，覆盖模块上相关的关键使用场景。 

#### 断言
Cypress提供了多种断言方法（如.should和.expect），确保使用适合当前检查的断言方法，推荐：
1. **使用自定义命令**
    - 将常用的操作提取为自定义命令，以提高代码的复用性和可读性
2. **分组和注释**
    - 为逻辑上相关的断言分组，并添加注释解释每组断言的目的
3. **确保断言的可读性**
    - 断言表达式应尽量简洁明了，避免过度嵌套或复杂的逻辑。
4. **处理异步操作**
    - 对于需要处理异步操作的断言，确保异步操作完成后再进行断言。
5. **定期重构测试代码**
    - 定期重构测试代码，确保断言和测试逻辑保持清晰和高效。进行代码评审，确保遵循团队的编码规范和最佳实践。

### 4. 环境配置
1. 安装cypress
- windows环境下需要安装 nodejs 18.x、20.x、22.x 及更高版本。
- 安装文档参考：https://docs.cypress.io/guides/getting-started/installing-cypress
> 安装完nodejs后执行: <br>
> npm install cypress --save-dev

2. 安装依赖包
> npm install ssh2 <br>
> npm install oracledb