

## @app-proto/datasources

> 提供本地数据源解析能力：自动解析某个目录下所有满足".js|.json|.hjson"格式文件的数据信息。


### Usage

```
yarn add @app-proto/datasources

const $ds = require('@app-proto/datasources')(__datasources__path__)

# async
const data = await $ds('__file_path__', {})

```
