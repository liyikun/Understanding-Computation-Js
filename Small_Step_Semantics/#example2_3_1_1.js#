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
    reduce () {
        if(this.left.reducible()){
            return new Add(this.left.reduce(), this.right)
        } else if (this.right.reducible()) {
            return new Add(this.left, this.right.reduce())
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
    reduce () {
        if(this.left.reducible()){
            return new Multiply(this.left.reduce(), this.right)
        } else if (this.right.reducible()) {
            return new Multiply(this.left, this.right.reduce())
        } else {
            return new D_Number(this.left.value * this.right.value)
        }
    }
}

var  expression = new Add(
    new Multiply(new D_Number(1),new D_Number(2)),
    new Multiply(new D_Number(3), new D_Number(4))
)
// console.log(expression.reducible())
// expression = expression.reduce();
// console.log(expression.toString())
// console.log(expression.reducible())
// expression = expression.reduce();
// console.log(expression.toString())
// console.log(expression.reducible())
// expression = expression.reduce();
// console.log(expression.toString())
// console.log(expression.reducible())

class Machine {
    constructor(expression) {
        this.expression = expression;
    }
    step() {
        this.expression = this.expression.reduce()
    }
    run() {
        while (this.expression.reducible()) {
            console.log(this.expression.toString())
            this.step()        
        }
        console.log(this.expression.toString())
    }
}

// new Machine(
//     new Add(
//         new Multiply(new D_Number(1),new D_Number(2)),
//         new Multiply(new D_Number(3), new D_Number(4))
//     )
// ).run()

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
            return new LessThan(this.left.reduce(), this.right)
        } else if (this.right.reducible()) {
            return new LessThan(this.left, this.right.reduce())
        } else {
            return new Boolean(this.left.value < this.right.value)
        }
    }
}

new Machine(
    new LessThan(new D_Number(5), new Add(
        new D_Number(2),
        new D_Number(2)
    ))
).run()

