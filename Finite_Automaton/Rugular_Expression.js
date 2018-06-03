const _ = require("lodash")


//base 翻到下面 120
Object.defineProperty(Object.prototype, 'tap', {
    value: function (intercept) {
        intercept.call(this);
        return this;
    },
    enumerable: false
});


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
        if (more_states.subset(states_set)) {
            return states_set
        } else {
            return this.follow_free_moves([...states_set, ...more_states])
        }
    }
}

const rulebook = new NFARuleBook([
    new FARule(1, 'a', 1), new FARule(1, 'b', 2)
    , new FARule(2, 'a', 3),
    new FARule(3, 'a', 4), new FARule(2, 'b', 3),
    new FARule(1, 'b', 1), new FARule(3, 'b', 4)
])

class NFA {
    constructor(current_state, accept_state, rulebook) {
        this.current_state = [...rulebook.follow_free_moves(current_state).values()];
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
        for (let character of string) {
            this.read_character(character)
        }
    }
}

class NfaDesign {
    constructor(start_state, accept_state, rulebook) {
        this.start_state = start_state;
        this.accept_state = accept_state;
        this.rulebook = rulebook;
    }
    accept(string) {
        return this.to_nfa().tap(function () {
            this.read_string(string)
        }).accepting()
    }
    to_nfa() {
        return new NFA(this.start_state, this.accept_state, this.rulebook)
    }
}

//base结束




//start





class Pattern {
    bracket(outer_precedence) {
        if (this.prcedence() < outer_precedence) {
            return '(' + this.to_s() + ')'
        } else {
            return this.to_s()
        }
    }
    inspect() {
        return 'Pattern'
    }
    matches(string) {
        return this.to_nfa_design().accept(string)
    }

}

class Empty extends Pattern {
    to_s() {
        return ''
    }
    prcedence() {
        return 3
    }
    to_nfa_design() {
        let start_state = [''];
        let accept_state = [''];
        let rulebook = new NFARuleBook([])

        return new NfaDesign(start_state, accept_state, rulebook)
    }
}

//test
// const nfa_design = new Empty().to_nfa_design()
// console.log(
//     nfa_design.accept(''),
//     nfa_design.accept('a'),
//     nfa_design.accept('b')
// )

class Literal extends Pattern {
    constructor(character) {
        super()
        this.character = character
    }
    to_s() {
        return this.character
    }
    prcedence() {
        return 3
    }
    to_nfa_design() {
        let start_state = '';
        let accept_state = ''
        let rule = new FARule(start_state, [this.character], accept_state);
        let rulebook = new NFARuleBook([rule])
        return new NfaDesign([start_state], [accept_state], rulebook)
    }
}

//test

// const nfa_design2 = new Literal('a').to_nfa_design();

// console.log(
//     nfa_design2.accept('a'),
//     nfa_design2.accept('b'),
//     nfa_design2.accept('ab')
// )


class Concatenate extends Pattern {
    constructor(first, second) {
        super()
        this.first = first;
        this.second = second;
    }
    to_s() {
        return [this.first, this.second].map((pattern) => {
            return pattern.bracket(this.prcedence())
        }).join()
    }
    prcedence() {
        return 1
    }
    to_nfa_design() {
        let first_nfa_design = this.first.to_nfa_design();
        let second_nfa_design = this.second.to_nfa_design();
        let start_state = first_nfa_design.start_state;
        let accept_state = second_nfa_design.accept_state;
        let rules = [...first_nfa_design.rulebook.rules,...second_nfa_design.rulebook.rules]
        let extra_rules = first_nfa_design.accept_state.map(state => {
           return  new FARule(state, null, second_nfa_design.start_state)
        }) 
        let rulebook = new NFARuleBook([...rules, ...extra_rules])
        debugger
        return new NfaDesign(start_state, accept_state, rulebook)
    }
}

//test

const pattern3 = new Concatenate(new Literal('a'), new Literal('b'))
console.log(
    pattern3.matches('a'),
    pattern3.matches('ab'),
    pattern3.matches('b')
)


class Choose extends Pattern {
    constructor(first, second) {
        super()
        this.first = first;
        this.second = second;
    }
    to_s() {
        return [this.first, this.second].map((pattern) => {
            return pattern.bracket(this.prcedence)
        }).join('|')
    }
    prcedence() {
        return 0
    }
}

class Repeat extends Pattern {
    constructor(pattern) {
        super()
        this.pattern = pattern;
    }
    to_s() {
        return this.pattern.bracket(this.prcedence()) + "*"
    }
    prcedence() {
        return 2
    }
}


const pattern = new Repeat(new Choose(
    new Concatenate(new Literal('a'), new Literal('b')),
    new Literal('a')
))


console.log(pattern.to_s())

//test
















