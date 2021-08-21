import SerializeUtils from './SerializeUtils'

export default class FormBase {
    init(data) {
        return SerializeUtils.objExtend(this, data)
    }

    shallowInit(data) {
        return SerializeUtils.objExtend(this, data, false)
    }

    formateObj() {
        return SerializeUtils.formatter(this, '_')
    }
}
