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
        return `${this.left } + ${this.right}`
    }
    inspect() {
        return `Add`
    }
    reducible() {
        return true
    }
    reduce (environment) {
        if(this.left.reducible()){
            return new Add(this.left.reduce(environment), this.right)
        } else if (this.right.reducible()) {
            return new Add(this.left, this.right.reduce(environment))
        } else {
            return new D_Number(this.left.value + this.right.value)
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
            return new Add(this.left.reduce(environment), this.right)
        } else if (this.right.reducible()) {
            return new Add(this.left, this.right.reduce(environment))
        } else {
            return new D_Number(this.left.value * this.right.value)
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
    reduce () {
        if(this.left.reducible()){
            return new LessThan(this.left.reduce(environment), this.right)
        } else if (this.right.reducible()) {
            return new LessThan(this.left, this.right.reduce(environment))
        } else {
            return new Boolean(this.left.value < this.right.value)
        }
    }
}

class Machine {
    constructor(expression, environment) {
        this.expression = expression;
        this.environment = environment;
    }
    step() {
        this.expression = this.expression.reduce(this.environment);
    }
    run() {
        while(this.expression.reducible()) {
            console.log(this.expression.toString())
            this.step()
        }
        console.log(this.expression.toString())
    }
}

new Machine(
    new Add(new Variable("x"), new Variable("y")),
    { 'x': new D_Number(3), 'y': new D_Number(4)}  
).run()