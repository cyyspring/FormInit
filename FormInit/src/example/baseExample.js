import ObjectBase from '../core/ObjectBase'
import SerializeUtils from '../core/SerializeUtils'

// 指定字段映射对应类

class Info {
    infoName = 'infoName'
}

class Person extends ObjectBase {
    name = 'json'
    @SerializeUtils.jsonType(Info)
    info = []
}

class A extends ObjectBase {
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
