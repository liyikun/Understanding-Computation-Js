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

new Machine(
    new Assign('x', new Add(new Variable("x"), new D_Number(1))),
    { x: new D_Number(2) }
).run()