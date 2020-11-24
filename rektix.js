class Rektix {
    constructor(domScope=document, propScope=window) {
        this.values = {}
        this.propScope = propScope
        
        this.bindTag(domScope, 'input')
        this.bindTag(domScope, 'select')
    }
    
    getValue(element) {
        const type = element.dataset.type || element.type
        switch(type) {
            case 'number': return parseInt(element.value)
            default: return element.value
        }
    }

    bind(element) {
        const id = element.id

        Object.defineProperty(this.propScope, id, {
            get: () => this.values[id],
            set: newVal => element.value = this.values[id] = newVal
        })

        element.onchange = () => this.propScope[id] = this.getValue(element)

        this.propScope[id] = this.getValue(element)
    }

    bindTag(domScope, tag) {
        let elements = domScope.getElementsByTagName(tag)
    
        for (const element of elements)
            this.bind(element)
    }
}