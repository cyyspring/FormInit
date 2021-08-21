/**
    @class 进行装饰器 和序列化的工具类，可以基于此类进继承扩展
 */
export default class SerializeUtils {
    // 字段映射的装饰器的存储{ 当前构造函数：{当前构造函数字段：映射的构造函数 } }
    static jsonTypeWeakMap = new WeakMap()

    // 字段重新映射{ 当前构造函数：{当前构造函数字段：映射的构造函数:{isOutput :Boolean} } }
    static jsonFieldWeakMap = new WeakMap()

    /**
     * 描述 字段类型映射的装饰器
     * @date 2021-08-18
     * @param {Object} cls 定义类s
     * @returns {Function}
     *
     * @example
     * 当数据api格式{personLs:[{name:11},{name:11}]},将数组中的对象提取出成类
     * class A {
     *   @jsonType(映射类)
     *   personLs = []
     * }
     */
    static jsonType(cls) {
        return (target, name, descriptor) => {
            // 存储格式{ 当前构造函数：{当前构造函数字段：映射的构造函数 } }
            if (!SerializeUtils.jsonTypeWeakMap.has(target.constructor)) SerializeUtils.jsonTypeWeakMap.set(target.constructor, {})
            const obj = SerializeUtils.jsonTypeWeakMap.get(target.constructor)
            obj[name] = cls
            return descriptor
        }
    }

    /**
     * 描述  字段类型重命名的装饰器
     * @date 2021-08-19
     * @param {string} rename -- 新对象对应key
     * @param {Boolean} isOutput  输出字段是否重置翻译
     * @returns {any}
     */
    static jsonField(rename, isOutput = true) {
        return (target, name, descriptor) => {
            // 检差映射名字是否已经在当前对象存在
            if (Reflect.has(target, rename)) throw new Error('Field already exists')
            // 存储格式{ 当前构造函数：{当前构造函数字段：映射的构造函数:{isOutput:Boolean} } }
            if (!SerializeUtils.jsonFieldWeakMap.has(target.constructor)) SerializeUtils.jsonFieldWeakMap.set(target.constructor, {})
            const obj = SerializeUtils.jsonFieldWeakMap.get(target.constructor)
            obj[name] = { rename, isOutput }
            return descriptor
        }
    }

    /**
     * 描述
     * @date 2021-08-20
     * @param {Object} obj 转换对象
     * @param {String} oldKey 转换对象当前key
     * @returns {Object} {key:string,isOutput:Boolean}返回对应映射key
     */
    static oldKeyToNewKey(obj, oldKey) {
        let Cls, fieldsObj
        Cls = obj.constructor
        fieldsObj = SerializeUtils.jsonFieldWeakMap.get(Cls)
        return { newKey: fieldsObj?.[oldKey]?.rename || oldKey, isOutput: fieldsObj?.[oldKey]?.isOutput ?? true }
    }

    /**
     * 描述 对象合并
     * @date 2021-08-18
     * @param {Object} target 合并的目标对象
     * @param {any} copy 被合并的对象
     * @param { Object } [deep=true] 是否深递归
     * @returns {any}
     *
     * @example
     * const a = {name:12,age:456}
     * const b = {name:1299,age:45633,zz:456}
     * SerializeUtils.objExtend(a,b)
     * a:{name:1299,age:45633}
     * b:{name:1299,age:45633,zz:456}
     */
    static objExtend(target, copy, deep = true) {
        let targetVal, copyVal, Cls, fieldsObj, rsArr, arrItem, shallowCopy, oldKey

        for (let key in target) {
            oldKey = key
            let { newKey, isOutput } = SerializeUtils.oldKeyToNewKey(target, key)
            targetVal = target[key]
            copyVal = copy[newKey]
            if (!Reflect.has(copy, newKey)) continue

            // 浅copy
            if (!deep) {
                if (typeof copyVal === 'object' && copyVal !== null) {
                    shallowCopy = Array.isArray(copyVal) ? [...copyVal] : { ...copyVal }
                } else {
                    shallowCopy = copyVal
                }
                target[key] = shallowCopy
                continue
            }

            // 深copy
            if (typeof copyVal === 'object' && copyVal !== null) {
                if (Array.isArray(copyVal)) {
                    rsArr = []
                    // 处理映射类字段 当使用jsonType映射的字段实例化自己的对应类
                    Cls = target.constructor
                    fieldsObj = SerializeUtils.jsonTypeWeakMap.get(Cls)
                    // fieldsObj && fieldsObj[key]
                    if (fieldsObj?.[key]) arrItem = new fieldsObj[key]()
                    copyVal.forEach((it, itKey) => {
                        if (!fieldsObj?.[key]) arrItem = targetVal[itKey]
                        typeof it !== 'object' || (it = SerializeUtils.objExtend(arrItem, it, deep))
                        rsArr.push(it)
                    })
                    target[key] = rsArr
                } else {
                    target[key] = SerializeUtils.objExtend(targetVal, copyVal, deep)
                }
            } else {
                target[key] = copyVal
            }
        }
        return target
    }

    /**
     * 描述 去除特殊标记字段
     * @date 2021-08-19
     * @param {Object} obj 去除对象
     * @param {string} startSymbol 特殊符号标记对象
     * @returns {any}
     *
     * @example
     * const a = {name:12,_age:456}
     * SerializeUtils.formatter(a,'_')
     * a:{name:1299}
     *
     * class A{
     *    @SerializeUtils.jsonField('newnew')
     *    obj1 = {ls:[1,3]}
     * }
     * const a = new A()
     * a:{newnew:[1,3]}
     */
    static formatter(obj, startSymbol) {
        if (obj === null) return null
        let clone = {}
        for (let key in obj) {
            if (key.startsWith(startSymbol)) continue
            let { newKey, isOutput } = SerializeUtils.oldKeyToNewKey(obj, key)
            if (!isOutput) newKey = key
            clone[newKey] = typeof obj[key] === 'object' ? SerializeUtils.formatter(obj[key], startSymbol) : obj[key]
        }
        if (Array.isArray(obj)) {
            clone.length = obj.length
            return Array.from(clone)
        }
        return clone
    }
}
