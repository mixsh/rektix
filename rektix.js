function getValueByType(value, type) {
    if (type === Number) {
        return parseInt(value)
    }

    return value
}

function wrap(scope, id, config) {
    let element = document.getElementById(id)
    
    if (element == null) {
        throw `wrap: element with id ${id} not found`
    }

    Object.defineProperty (scope, id, {
        get: function () { 
            return scope[`_${id}`]
        },
        set: function (newVal) {
            scope[`_${id}`] = newVal
            element.value = newVal
        }
    })

    element.onchange = () => scope[id] = getValueByType(element.value, config.type)

    scope[id] = getValueByType(config.value, config.type)
}

function init(scope, data) {
    for (const id in data) {
        wrap(scope, id, data[id])
    }
}