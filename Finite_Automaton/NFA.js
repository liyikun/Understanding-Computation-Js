const _ = require("lodash")

Set.prototype.subset = function (otherSet) {  
    if (this.size > otherSet.size) {  
        return false;  
    } else {  
        var values = this.values();  
        for (var i = 0; i < values.length; i++) {  
            if (!otherSet.has(values[i])) {  
                return false;  
            }  
        }  
        return true;  
    }  
}

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
    follow_free_moves(states) {
        let more_states = this.next_states(states, null)
        let states_set = new Set(states)
        if(more_states.subset(states_set)) {
            return states_set
        } else {
            return this.follow_free_moves([...states_set,...more_states])
        }
    }
}

const rulebook = new NFARuleBook([
    new FARule(1, 'a', 1), new FARule(1, 'b', 2)
    , new FARule(2, 'a', 3),
    new FARule(3, 'a', 4), new FARule(2, 'b', 3),
    new FARule(1, 'b', 1), new FARule(3, 'b', 4)
])

// const list1 = new Set([1])
console.log(rulebook.next_states([1], 'b'))


console.log(rulebook.next_states([1, 2], 'a'))

console.log(rulebook.next_states([1, 3], 'b'))



class NFA {
    constructor(current_state, accept_state, rulebook) {
        this.current_state = current_state;
        this.accept_state = accept_state;
        this.rulebook = rulebook;
    }
    accepting() {
        return this.current_state.filter(x => this.accept_state.includes(x)).length > 0
    }
    read_character(character) {
        return this.current_state = Array.from(this.rulebook.next_states(this.current_state, character))
    }
    read_string(string) {
        return string.forEach(character => {
            return this.read_character(character)
        })
    }
}

// const nfa1 = new NFA([1], [4], rulebook)
// console.log(nfa1.accepting())
// console.log(nfa1.read_character('b'))
// console.log(nfa1.accepting())
// console.log(nfa1.read_character('a'))
// console.log(nfa1.accepting())
// console.log(nfa1.read_character('b'))
// console.log(nfa1.accepting())



const rulebook2 = new NFARuleBook([
    new FARule(1, null, 2),new FARule(1, null, 4),
    new FARule(2, 'a', 3),new FARule(3, 'a', 2),
    new FARule(4, 'a', 5), new FARule(5, 'a', 6),
    new FARule(6, 'a', 4)
])

console.log(...rulebook2.next_states([1], null).values())

console.log(...rulebook2.follow_free_moves([1]).values())
