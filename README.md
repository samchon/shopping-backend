# Backend
## 1. Outline
Example backend server of Shopping Mall for education.

`@samchon/shopping-backend` is an example backend project of [NestJS](https://nestjs.com) and [Prisma](https://prisma.io) stack. It has been developed to educate how to adapt functional programming in the NestJS development. Also, `@samchon/shopping-backend` guides how to utilize those 3rd party libraries in production, and demonostrates how they are powerful for the productivity.

  - [typia](https://github.com/samchon/typia): Superfast runtime validator
  - [nestia](https://github.com/samchon/nestia): NestJS helper libaries like SDK generation
  - [prisma-markdown](https://github.com/samchon/prisma-markdown): Markdown generator of Prisma, including ERD and descriptions




## 2. Installation
### 2.1. NodeJS
This backend server has implemented through TypeScript and it runs on the NodeJS. Therefore, to mount this backend server on your local machine, you've to install the NodeJS.

  - https://nodejs.org/en/

### 2.2. PostgreSQL
> ```bash
> bash postgres.sh
>```
>
> If you've installed Docker, then run the script above.

Otherwise, visit below PostgreSQL official site and install it manually.

https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

After that, run the `npm run schema <root-account> <password>` command. 

Database schema for BBS backend system would be automatically constructed.

```bash
npm run schema postgres root
```

### 2.3. Repository
From now on, you can start the backend server development, right now. 

Just download this project through the git clone command and install dependencies by the npm install command. After those preparations, you can start the development by typing the `npm run dev` command.

```bash
# CLONE REPOSITORY
git clone https://github.com/samchon/shopping-backend
cd shopping-backend

# INSTALL DEPENDENCIES
npm install

# START DEVELOPMENT
npm run dev
```




## 3. Development
### 3.1. Definition
![ERD](https://private-user-images.githubusercontent.com/13158709/285461559-9fa92ed4-1f9a-4fd9-bceb-dd4b20d45537.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDUwNjk5NzIsIm5iZiI6MTcwNTA2OTY3MiwicGF0aCI6Ii8xMzE1ODcwOS8yODU0NjE1NTktOWZhOTJlZDQtMWY5YS00ZmQ5LWJjZWItZGQ0YjIwZDQ1NTM3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAxMTIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMTEyVDE0Mjc1MlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTAyMjM0ZTliYjYyM2M0ZTVmNGM0MDk4OTlhZDg2ZTZhMGM0YmI2NzViMjY3NjgzZjJmZGM0MWE3Y2I4NzQ4NmImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.mBsBpuQ_xQwMVKKHNCdJ_XJRmn_dRosTz5a_SeYzvHs)

If you want to add a new feature or update ordinary thing in the API level, you should write the code down to the matched *API controller*, who is stored in the [src/controllers](src/controllers) directory as the [Main Program](#34-main-program). 

However, [@samchon](https://github.com/samchon) does not recommend to writing code down into the [Main Program](#34-main-program) first, without any consideration. Instead, [@samchon](https://github.com/samchon) recommends to declare the definition first and implement the [Main Program](#34-main-program) later.

Therefore, if you want to add a new feature in the API level, define the matched data entity in the [prisma/schema.prisma](prisma/schema.prisma) file and [src/api/structures](src/api/structures) directories. After the data entity definition, declare function header in the matched API controller class in the [src/controllers](src/controllers). Note that, it's only the declaration, type only, not meaning to implement the function body.

After those declarations, build the client [SDK](#32-software-development-kit) through the `npm run build:api` command and implement the [Test Automation Program](#33-test-automation-program) using the [SDK](#32-software-development-kit) with use case scenarios. Development of the [Main Program](#34-main-program) should be started after those preparations are all being ready. Of course, the [Main Program](#34-main-program) can be verified with the pre-developed [Test Automation Program](#33-test-automation-program) in everytime.

  - Declare data entity
  - Declare API function header
  - Build the client [SDK](#32-software-development-kit)
  - Implement the [Test Automation Program](#33-test-automation-program)
  - Develop the [Main Program](#34-main-program)
  - Validate the [Main Program](#34-main-program) through the [Test Automation Program](#33-test-automation-program)
  - Deploy to the Dev and Real servers.

### 3.2. Software Development Kit
[`@samchon/shopping-backend`](https://github.com/samchon/shopping-backend) provides SDK (Software Development Kit) for convenience.

For the client developers who are connecting to this backend server, [`@samchon/shopping-backend`](https://github.com/samchon/shopping-backend) provides not only API documents like the Swagger, but also provides the API interaction library, one of the typical SDK (Software Development Kit) for the convenience.

With the SDK, client developers never need to re-define the duplicated API interfaces, by reading Swagger Documents. Just utilize the provided interfaces and asynchronous functions defined in the SDK. It would be much convenient than any other Rest API solutions.

Furthermore, the SDK supports mockup simulator. If client developer configures `simulate` option to be `true`, the SDK library will not send HTTP request to the backend server, but simulate the API by itself. With this mockup simulator feature, frontend developers can directly start the interaction development, even when the [main program development](#34-main-program) is on a progress.

To build the SDK in local, just type the `npm run build:sdk` command. The SDK would be generated by [`nestia`](https://github.com/samchon/nestia), by analyzing source code of the [controller](src/controllers) classes in the compilation level, automatically. Otherwise you want to publish the SDK .ibrary, run the `npm run package:api` command instead.

```bash
# BUILD SDK IN LOCAL
npm run build:sdk

# BUILD SDK AND PUBLISH IT TO THE NPM
npm run package:api
```

When the SDK has been published, client programmers can interact with this backend server very easily. Just let them to install the SDK and call the SDK functions with the `await` symbol like below.

![nestia-sdk-demo](https://user-images.githubusercontent.com/13158709/215004990-368c589d-7101-404e-b81b-fbc936382f05.gif)

```typescript
import api from "@samchon/bbs-api";

import { IBbsCitizen } from "@samchon/bbs-api/lib/structures/bbs/actors/IBbsCitizen";
import { IBbsQuestionArticle } from "@samchon/bbs-api/lib/structures/bbs/articles/IBbsQuestionArticle";
import { IBbsSection } from "@samchon/bbs-api/lib/api/structures/bbs/systematic/IBbsSection";

async function main(): Promise<void>
{
    //----
    // PREPARATIONS
    //----
    // CONNECTION INFO
    const connection: api.IConnection = {
        host: "http://127.0.0.1:37001",
        simulate: true, // TURN ON MOCKUP SIMULATOR
    };

    // ISSUE A CUSTOMER ACCOUNT
    const customer: IBbsCustomer = await api.functional.bbs.customers.authenticate.issue
    (
        connection,
        {
            href: window.location.href,
            referrer: window.document.referrer
        }
    );

    // ACTIVATE THE CUSTOMER
    customer.citizen = await api.functional.bbs.customers.authenticate.activate
    (
        connection,
        {
            name: "Jeongho Nam",
            mobile: "821036270016"
        }
    );

    //----
    // WRITE A QUESTION ARTICLE
    //----
    // FIND TARGET SECTION
    const sectionList: IBbsSection[] = await api.functional.bbs.customers.systematic.sections.index
    (
        connection
    );
    const section: IBbsSection = sectionList.find(section => section.type === "qna")!;

    // PREPARE INPUT DATA
    const input: IBbsQuestionArticle.IStore = {
        title: "Some Question Title",
        body: "Some Question Body Content...",
        files: []
    };

    // DO WRITE
    const question: IBbsQuestionArticle = await api.functional.bbs.customers.articles.qna.store
    (
        connection, 
        section.code,
        input
    );
    console.log(question);
}
```

### 3.3. Test Automation Program
> TDD (Test Driven Development)

After the [Definition](#31-definition) and client [SDK](#32-software-development-kit) generation, you've to design the use-case scenario and implement a test automation program who represents the use-case scenario and guarantees the [Main Program](#34-main-program).

To add a new test function in the Test Automation Program, create a new TS file under the [test/features](test/features) directory following the below category and implement the test scenario function with representative function name and `export` symbol. I think many all of the ordinary files wrote in the [test/features](test/features) directory would be good sample for you. Therefore, I will not describe how the make the test function detaily.

Anyway, you've to remind that, the Test Automation Program resets the DB schema whenever being run. Therefore, you've to be careful if import data has been stored in the local (or dev) DB server. To avoid the resetting the DB, configure the `skipReset` option like below.

Also, the Test Automation Program runs all of the test functions placed into the [test/features](test/features) directory. However, those full testing may consume too much time. Therefore, if you want to reduce the testing time by specializing some test functions, use the `include` option like below.

  - supported options
    - `include`: test only restricted functions who is containing the special keyword.
    - `exclude`: exclude some functions who is containing the special keyword.
    - `reset`: do not reset the DB

```bash
# test without db reset
npm run test -- --reset false

# include or exclude some features
npm run test -- --include something
npm run test -- --include cart order issue
npm run test -- --include cart order issue --exclude index deposit
```

### 3.4. Main Program
After [Definition](#31-definition), client [SDK](#32-software-development-kit) building and [Test Automation Program](#33-test-automation-program) are all prepared, finally you can develop the Main Program. Also, when you complete the Main Program implementation, it would better to validate the implementation through the pre-built [SDK](#32-software-development-kit) and [Test Automation Program](#33-test-automation-program).

However, do not commit a mistake that writing source codes only in the [controller](src/controllers) classes. The API Controller must have a role that only intermediation. The main source code should be write down separately following the directory categorizing. For example, source code about DB I/O should be written into the [src/providers](src/providers) directory.




## 4. Appendix
### 4.1. NPM Run Commands
List of the run commands defined in the [package.json](package.json) are like below:

  - Test
    - **`test`**: **Run [Test Automation Program](#33-test-automation-program)**
  - Build
    - `build`: Build every below programs
    - `build:sdk`: Build SDK library, but only for local
    - `build:test`: Build [Test Automation Program](#33-test-automation-program)
    - `build:main`: Build main program
    - **`dev`**: **Incremental builder of the [Test Automation Program](#33-test-automation-program)**
    - `eslint`: EsLint validator runner
    - `pretter`: Adjust prettier to every source codes
    - `webpack`: Run webpack bundler
  - Deploy
    - `package:api`: Build and deploy the SDK library to the NPM
    - `schema`: Create DB, users and schemas on local database
    - `start`: Start the backend server
  - Webpack
    - `webpack`: Run webpack bundler
    - `webpack:start`: Start the backend server built by webpack
    - `webpack:test`: Run test program to the webpack built

### 4.2. Directories
  - [.vscode/launch.json](.vscode/launch.json): Configuration for debugging
  - [packages/api/](packages/api): Client [SDK](#32-software-development-kit) library for the client developers
  - [**docs/**](docs/): Documents like ERD (Entity Relationship Diagram)
  - [**prisma/schema.prisma**](prisma/schema.prisma): Prisma Schema File
  - [src/](src/): TypeScript Source directory
    - [src/api/](src/api/): Client SDK that would be published to the `@ORGANIZATION/PROJECT-api`
      - [**src/api/functional/**](src/api/functional/): API functions generated by the [`nestia`](https://github.com/samchon/nestia)
      - [**src/api/structures/**](src/api/structures/): DTO structures
    - [src/controllers/](src/controllers/): Controller classes of the Main Program
    - [src/providers/](src/providers/): Service providers (bridge between DB and controllers)
    - [src/executable/](src/executable/): Executable programs
  - [**test/**](test/): Test Automation Program
