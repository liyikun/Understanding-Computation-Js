const _ = require("lodash")
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

class NFARuleBook {
    constructor(rules) {
        this.rules = rules;
    }
    next_states(states, character) {
        return new Set(_.flatMap(states, (state) => {
            return this.follow_rules_for(state, character)
        }))
    }
    follow_rules_for(state, character) {
        return this.rules_for(state, character).map(item => item.follow())   
    }
    rules_for(state, character) {
        return this.rules.filter((rule) => {
            return rule.appliesto(state, character)
        })
    }
}

const rulebook = new NFARuleBook([
    new FARule(1, 'a', 1),new FARule(1, 'b', 2)
    ,new FARule(2, 'a', 3),
    new FARule(3, 'a', 4),new FARule(2, 'b', 3),
    new FARule(1, 'b', 1),new FARule(3, 'b', 4)
])

// const list1 = new Set([1])
console.log(rulebook.next_states([1], 'b'))

debugger