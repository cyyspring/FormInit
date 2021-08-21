import ObjectBase from '../core/ObjectBase'
import SerializeUtils from '../core/SerializeUtils'

// 指定字段映射对应类

class Info {
    @SerializeUtils.jsonField('newInfoName')
    infoName = 'infoName'
}

class Person extends ObjectBase {
    name = 'json'

    @SerializeUtils.jsonType(Info)
    info = []
}

class A extends ObjectBase {
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

const a = new A().init(api)

console.log('api', JSON.stringify(api, null, 4))

console.log('a', JSON.stringify(a, null, 4))

console.log('a', JSON.stringify(a.formateObj(), null, 4))

console.log('a', JSON.stringify(new A().shallowInit(api), null, 4))
