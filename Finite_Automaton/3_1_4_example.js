

class FARule {
    constructor(state, character, next_state) {
        this.state = state;
        this.character = character;
        this.next_state = next_state;
    }
    appliesto(state, character) {
        return this.state == state && this.character == character
    }
    follow() {
        return this.next_state
    }
    inspect() {
        return `<FARULE ${this.state.inspect} -- ${this.character} --> ${this.next_state.inspect}>`
    }
}

class DFARulebook {
    constructor(rules) {
        this.rules = rules
    }
    next_state(state, character) {
        return this.rule_for(state, character).follow()
    }
    rule_for(state, character) {
        return this.rules.find((rule) => {
            return rule.appliesto(state, character)
        })    
    }
}

const rulebook = new DFARulebook([
    new FARule(1, 'a', 2),new FARule(1, 'b', 1),new FARule(2, 'a', 2),new FARule(2, 'b', 3),new FARule(3, 'a', 3),new FARule(3, 'b', 3)
])

console.log(rulebook.next_state(1, 'a'))

console.log(rulebook.next_state(1, 'b'))

console.log(rulebook.next_state(2, 'b'))