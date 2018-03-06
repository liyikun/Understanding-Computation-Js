class D_Number {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return this.value.toString()
    }
    inspect() {
        return `D_Number`
    }
    reducible() {
        return false
    }
}

class Variable {
    constructor(name) {
        this.name = name
    }
    toString() {
        return this.name.toString()
    }
    inspect() {
        return `Variable`
    }
    reducible() {
        return true
    }
    reduce(environment) {
        return environment[this.name]
    }
}

class Add {
    constructor(left, right) {
        this.left = left;
        this.right = right
    }
    toString() {
        return `${this.left} + ${this.right}`
    }
    inspect() {
        return `Add`
    }
    reducible() {
        return true
    }
    reduce(environment) {
        if (this.left.reducible()) {
            return new Add(this.left.reduce(environment), this.right)
        } else if (this.right.reducible()) {
            return new Add(this.left, this.right.reduce(environment))
        } else {
            return new D_Number(this.left.value + this.right.value)
        }
    }
}

class DoNothing {
    constructor() {

    }
    toString() {
        return 'do-nothing'
    }
    inspect() {
        return 'DoNothing'
    }
    equal(statement) {

    }
    reducible() {
        return false
    }
}

class Assign {
    constructor(name, expression) {
        this.name = name;
        this.expression = expression;
    }
    inspect() {
        return 'Assign'
    }
    toString() {
        return `${this.name} = ${this.expression}`
    }
    reducible() {
        return true
    }
    reduce(environment) {
        if (this.expression.reducible()) {
            return [new Assign(this.name, this.expression.reduce(environment)), environment]
        } else {
            const obj = Object.assign(environment)
            obj[`${this.name}`] = this.expression;
            return [new DoNothing(), obj]
        }
    }
}

class Boolean {
    constructor(value) {
        this.value = value
    }
    toString() {
        return this.value.toString()
    }
    inspect() {
        return `Boolean`
    }
    reducible() {
        return false
    }
}


class If {
    constructor(condition, consequence, alternative) {
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative || new DoNothing();
    }
    toString() {
        return `if (${this.condition}) { ${this.consequence} } else { ${this.alternative} }`
    }
    inspect() {
        return 'IF'
    }
    reducible() {
        return true
    }
    reduce(environment) {
        if(this.condition.reducible()) {
            return [new If(this.condition.reduce(environment),this.consequence,this.alternative), environment]
        } else {
            switch(this.condition.toString()) {
                case "true":
                    return [this.consequence, environment]
                case "false":
                    return [this.alternative, environment]   
            }
        }
    }
}

class LessThan {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    toString() {
        return `${this.left} < ${this.right}`
    }
    inspect() {
        return `LessThan`
    }
    reducible() {
        return true
    }
    reduce (environment) {
        if(this.left.reducible()){
            return new LessThan(this.left.reduce(environment), this.right)
        } else if (this.right.reducible()) {
            return new LessThan(this.left, this.right.reduce(environment))
        } else {
            return new Boolean(this.left.value < this.right.value)
        }
    }
}

class Multiply {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    toString() {
        return `${this.left} * ${this.right}`
    }
    inspect() {
        return `Multiply`
    }
    reducible() {
        return true
    }
    reduce (environment) {
        if(this.left.reducible()){
            return new Multiply(this.left.reduce(environment), this.right)
        } else if (this.right.reducible()) {
            return new Multiply(this.left, this.right.reduce(environment))
        } else {
            return new D_Number(this.left.value * this.right.value)
        }
    }
}


class Machine {
    constructor(statement, environment) {
        this.statement = statement;
        this.environment = environment;
    }
    step() {
        [this.statement, this.environment] = this.statement.reduce(this.environment)
    }
    run() {
        while (this.statement.reducible()) {
            console.log('#' + this.statement.toString())
            printObj(this.environment)
            //console.log(this.environment)
            this.step()
        }
        console.log('#' + this.statement.toString())
        printObj(this.environment)
    }
}

function printObj(obj) {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            console.log(i + ":" +obj[i].toString())
        }
    }
}

// new Machine(
//     new Assign('x', new Add(new Variable("x"), new D_Number(1))),
//     { x: new D_Number(2) }
// ).run()


// new Machine(
//     new If(new Variable('x'),
//     new Assign('y',new D_Number(1)),
//     new Assign('y',new D_Number(2))
//     ),{
//         'x': new Boolean(false)
//     }
// ).run()

// new Machine(
//     new If(new Variable('x'),
//         new Assign('y', new D_Number(100))
//     ),{
//         'x': new Boolean(true)
//     }
// ).run()


class Sequence{
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
    toString() {
        return `${this.first.toString()}; ${this.second.toString()}`
    }
    inspect() {
        return 'sequence'
    }
    reducible() {
        return true
    }
    reduce(environment) {
        switch(this.first.inspect()) {
            case "DoNothing":
                return [this.second, environment]
            default:
                const [reduced_first,reduced_environment] = this.first.reduce(environment)    
                return [new Sequence(reduced_first, this.second), reduced_environment]
        }   
    }
}

// new Machine(
//     new Sequence(
//         new Assign('x', new Add(new D_Number(1), new D_Number(2))),
//         new Assign('y', new Add(new D_Number(3), new Variable('x')))
//     ),
//     {}
// ).run()

class While {
    constructor(condition,body) {
        this.condition = condition;
        this.body = body
    }
    inspect() {
        return 'while'
    }
    toString() {
        return `while(${this.condition.toString()}) { ${this.body.toString()}}`
    }
    reducible() {
        return true
    }
    reduce(environment) {
        return [new If(this.condition, new Sequence(this.body, this)), environment]
    }
}

new Machine(
    new While(
        new LessThan(new Variable('x'), new D_Number(5)),
        new Assign('x', new Multiply(new Variable('x'),new D_Number(3)))
    ),
    { 'x': new D_Number(1)}
).run()