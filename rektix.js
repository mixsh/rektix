let virtualDom = {}

function read(id) {
    let config = virtualDom[id]
    return config ? config.value : undefined
}

function write(id, value) {
    let config = virtualDom[id]

    if (config) {
        config.value = value
        config.dirty = true
    }

    throw `wrap: element with id ${id} not found`
}

function wrap(id, value) {
    let element = document.getElementById(id)

    if (element == null) {
        throw `wrap: element with id ${id} not found`
    }
    
    // add to virtual dom
    virtualDom[id] = {
        id,
        value,
        element,
        dirty: false,
    }

    element.value = value
    
    // bind change event
    element.onchange = () => {
        virtualDom[id].value = element.value
        virtualDom[id].dirty = true
    }
}

function loop() {
    let interval = 100

    setInterval(() => {
        for (const id in virtualDom) {
            let vDomElement = virtualDom[id]

            if (vDomElement.dirty) {
                vDomElement.element.value = vDomElement.value
                vDomElement.dirty = false
            }
        }

    }, interval)
}

function sync(data) {
    for (const id in data) {
        wrap(id, data[id])
    }

    loop()
}