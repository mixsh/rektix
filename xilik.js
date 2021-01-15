const xilik = (function() {
    function _xilik(props, domScope) {
        this.values = {}
        this.references = {}
        this.props = props != undefined ? props : {}
        this.domScope = domScope
    
        this.load()
    }

    _xilik.prototype.generateId = function() {
        return '_' + Math.random().toString(36).substr(2, 9);
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

    _xilik.prototype.updateConditionals = function() {
        let elements = this.domScope.querySelectorAll('[data-x-if]')
    
        for (const element of elements) {
            const expression = element.dataset.xIf
            element.style.display = this.evalExpression(expression) ? '' : 'none'
        }
    }

    _xilik.prototype.updateLoops = function() {
        let elements = this.domScope.querySelectorAll('[data-x-array]')
    
        for (const element of elements) {
            const arrayName = element.dataset.xArray
            const arrayItemName = element.dataset.xItem

            let id = element.dataset.xId

            if (!id) {
                id = this.generateId()
                this.references[id] = element
            }

            const array = this.props[arrayName]

            for (const item of array) {
                const clone = element.cloneNode(deep=true)

                const valueElements = clone.querySelectorAll('[data-x-value]')

                for (const valueElement of valueElements) {
                    if (valueElement.dataset.xValue === arrayItemName) {
                        valueElement.innerHTML = item
                    }
                }

                element.parentNode.insertBefore(clone, element)
            }

            element.style.display = 'none'
        }
    }
    
    _xilik.prototype.updateUI = function() {
        this.updateConditionals()
        this.updateLoops()
    }
    
    _xilik.prototype.load = function() {
        this.bindElements()
        this.updateUI()
    }
    
    _xilik.prototype.evalExpression = function(_expression) {
        let ret; with (this.props) eval(`ret = ${_expression}`); return ret
    }
    
    return (props, domScope=document) => new _xilik(props, domScope)
}())