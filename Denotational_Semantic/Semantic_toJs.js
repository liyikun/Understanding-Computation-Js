class Number {
    constructor(value) {
        this.value = value;
    }
    to_Js() {
        return `e => ${this.value}`
    }
}

class Boolean {
    constructor(value) {
        this.value = value;
    }
    to_Js() {
        return `e => ${this.value}`
    }
}



let proc1 = eval(new Number(5).to_Js())

let proc2 = eval(new Boolean(false).to_Js())

class Variable {
    constructor(name){
        this.name = name
    };
    to_Js(){
        return `e => e['${this.name}']`
    }
}

let expression = new Variable('x')

let procv = eval(expression.to_Js());

const env = {x: 7};
// console.log(procv.call(null, env))

class Add {
    constructor(left,right) {
        this.left = left;
        this.right = right;
    }
    to_Js() {
        return `e => (${this.left.to_Js()}).call(null,e) + (${this.right.to_Js()}).call(null,e)`
    }
}

class Multiply {
    constructor(left,right) {
        this.left = left;
        this.right = right;
    }
    to_Js() {
        return `e => (${this.left.to_Js()}).call(null,e) * (${this.right.to_Js()}).call(null,e)`
    }
}

class LessThan {
    constructor(left,right) {
        this.left = left;
        this.right = right;
    }
    to_Js() {
        return `e => (${this.left.to_Js()}).call(null,e) < (${this.right.to_Js()}).call(null,e)`
    }
}

// console.log(new Add(new Variable('x'), new Number(1)).to_Js())

// console.log(new LessThan(new Add(new Variable('x'),new Number(1)), new Number(3)).to_Js())

const senv = {x: 3}

let procadd = eval(new Add(new Variable('x'), new Number(1)).to_Js())
//console.log(procadd.call(null,senv))

let procless = eval(new LessThan(new Add(new Variable('x'),new Number(1)), new Number(3)).to_Js())

//console.log(procless.call(null,senv))


class Assign {
    constructor(name,expression){
        this.name = name;
        this.expression = expression;
    }
    to_Js() {
        return `e => Object.assign(e,{${this.name}:(${this.expression.to_Js()}).call(null,e)})`
    }
}

const textstatement = new Assign(
    'y', 
    new Add(
        new Variable('x'), 
        new Number(1)))
// console.log(textstatement.to_Js())
// let procassign = eval(textstatement.to_Js())
// console.log(procassign.call(null,{x: 3}))


class DoNoting {
    to_Js() {
        return `e => e`
    }
}

class If {
    constructor(condition,consequence,alternative) {
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
    }
    to_Js() {
        return `e => {if((${this.condition.to_Js()}).call(null,e))`+
        `{
            return (${this.consequence.to_Js()}).call(null,e)
        }` +
        `else {
            return (${this.alternative.to_Js()}).call(null,e)
        }}`
    }
}

class Sequence {
    constructor(first,second){
        this.first = first;
        this.second = second;
    }
    to_Js() {
        return `e => (${this.second.to_Js()}).call(null,(${this.first.to_Js()}).call(null,e))`
    }
}

class While {
    constructor(condition,body) {
        this.condition = condition;
        this.body = body;
    }
    to_Js() {
        return `e => {
            while((${this.condition.to_Js()}).call(null,e)) {
                e = (${this.body.to_Js()}).call(null, e);
            };
            return e;
        };
        `    
    }
}

const whilestatement = new While(
    new LessThan(new Variable('x'),new Number(5)),
    new Assign('x', new Multiply(new Variable('x'),new Number(3)))
)

//console.log(statement.to_Js())


let procwhile = eval(whilestatement.to_Js())

// console.log(procwhile.call(null,{x: 1}))

const ifstatement = new If(
    new LessThan(new Variable('x'),new Number(5)),
    new Assign('x', new Add(new Variable('x'),new Number(5))),
    new Assign('x', new Multiply(new Variable('x'),new Number(3)))
)

const ifstatement2 = new If(
    new LessThan(new Variable('x'),new Number(5)),
    new Assign('x', new Add(new Variable('x'),new Number(5))),
    new DoNoting()
)


let procif1 = eval(ifstatement.to_Js())
let procif2 = eval(ifstatement2.to_Js())
// console.log(procif1.call(null,{x:3}))

// console.log(procif1.call(null,{x:6}))

// console.log(procif2.call(null,{x:3}))

// console.log(procif2.call(null,{x:6}))


const sequencestatement = new Sequence(
    new Assign('x', new Add(new Variable('x'),new Number(5))),
    new Assign('x', new Multiply(new Variable('x'),new Number(3)))
)

let procseq = eval(sequencestatement.to_Js())

// console.log(procseq.call(null, {x: 1}))