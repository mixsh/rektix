function _xilik(domScope, props) {
    this.values = {}
    this.props = props != undefined ? props : {}
    this.domScope = domScope

    this.load()
}
    
_xilik.prototype.getValue = function(element) {
    const type = element.dataset.type || element.type
    switch(type) {
        case 'number': return parseInt(element.value)
        default: return element.value
    }
}

_xilik.prototype.bindElement = function(element) {
    const id = element.id

    element.oninput = () => {
        this.props[id] = this.getValue(element)
        this.updateUI()
    }

    Object.defineProperty(this.props, id, {
        enumerable: true,

        get: () => this.values[id],
        set: newVal => {
            this.values[id] = newVal
            element.value = this.values[id] ? this.values[id] : ''
        }
    })

    this.props[id] = this.getValue(element)
}

_xilik.prototype.bindElements = function() {
    let tags = ['input', 'select', 'textarea']

    for (const tag of tags) {
        let elements = this.domScope.getElementsByTagName(tag)
    
        for (const element of elements)
            this.bindElement(element)
    }
}

_xilik.prototype.updateUI = function() {
    console.log('updateUI', this.props)
    let conditionalWrappers = this.domScope.querySelectorAll('[data-x-if]')

    for (const wrapper of conditionalWrappers) {
        const expression = wrapper.dataset.xIf
        wrapper.style.display = this.evalExpression(expression) ? '' : 'none'
    }
}

_xilik.prototype.load = function() {
    this.bindElements()
    this.updateUI()
}

_xilik.prototype.evalExpression = function(_expression) {
    let ret; with (this.props) eval(`ret = ${_expression}`); return ret
}

const xilik = (domScope=document, props) => new _xilik(domScope, props)