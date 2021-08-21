# FormInit
初始化表单提交，根据后台mvc 模型，尝试将前端数据模型抽离，将数据层作为单独维护
## 目前支持
1.将后台api 数据结构深浅copy 和类定义字段匹配形成对象
2.支持前后字段不匹配利用最小改动原则，不用前端大量重新更改前端变量名统一
## 使用
1.先执行`npm i`
2.因为使用了装饰器，需要使用babel打包，先执行`npm run babel`
3.使用案例执行`npm run baseExa` 和 `npm run jsonFile`

## 案例说明
1.当做基本api和类数据对应时候需要继承`FormBase`,当需要生命数组中对象类型映射时候使用`@SerializeUtils.jsonType`装饰器
~~~js

class Info {
    infoName = 'infoName'
}

class Person extends FormBase {
    name = 'json'
    @SerializeUtils.jsonType(Info)
    info = []
}

class A extends FormBase {
    name = '123'
    age = '456'
    ls = [1, 2, 3]
    ls1 = [{ name: 13 }]
    obj = new Person()

    @SerializeUtils.jsonType(Person)
    personLs = []
    obj1 = { ls: [1, 3] }
    _aaa = 'zzz'

    testDeepClone() {
        const { length } = this.personLs
        if (length) {
            this.personLs[0].name = 'clone'
        }
    }
}
// ----------测试数据------------
const api = {
    name: 'api',
    age: 'api',
    ls: [1],
    ls1: [{ name: 'api' }],
    obj: { name: 'api', age: 'api', info: [{ infoName: 'apiobj', name: 'api', age: 'api' }] },
    personLs: [
        { name: 'api', age: 'api', info: [{ infoName: 'api', name: 'api', age: 'api' }] },
        { name: 'api', age: 'api' },
    ],
}

const a = new A().init(api)
a.testDeepClone()

console.log('api', JSON.stringify(api, null, 4))

console.log('a', JSON.stringify(a, null, 4))
~~~

2.当后台字段更改，前端对其字段做对应映射关系时候使用`@SerializeUtils.jsonField` 装饰器
~~~js
// 指定字段映射对应类

class Info {
    @SerializeUtils.jsonField('newInfoName')
    infoName = 'infoName'
}

class Person extends FormBase {
    name = 'json'

    @SerializeUtils.jsonType(Info)
    info = []
}

class A extends FormBase {
    @SerializeUtils.jsonField('newName')
    name = '123'

    @SerializeUtils.jsonType(Person)
    personLs = []

    // 输出时候key 不变
    @SerializeUtils.jsonField('newFORMATTER', false)
    FORMATTER = '2'
    _zz = '转换后将不输出'
}

// ----------测试数据------------
const api = {
    newName: 'api',
    personLs: [{ name: 'api', info: [{ newInfoName: 'api', age: 15 }] }],
    newEXTEND: 'api',
    newFORMATTER: 'api',
}

~~~
