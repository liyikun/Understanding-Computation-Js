class Number {
    constructor(value) {
        this.value = value
    }
    evaluate(envirment) {
        return this.value
    }
}

class Boolean {
    constructor(value) {
        this.value = value
    }
    evaluate(envirment) {
        return this.value
    }
}

class Variable {
    constructor(name) {
        this.name = name;
    }
    evaluate(envirment) {
        return envirment[this.name]
    }
}

class Add {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    evaluate(envirment) {
        return new Number(this.left.evaluate(envirment) + this.right.evaluate(envirment))
    }
}

class Multiply {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    evaluate(envirment) {
        return new Number(this.left.evaluate(envirment) * this.right.evaluate(envirment))
    }
}

class LessThan {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    evaluate(envirment) {
        return new Boolean(this.left.evaluate(envirment) < this.right.evaluate(envirment))
    }
}

console.log(new Number(23).evaluate({}))

console.log(new Variable('x').evaluate({'x': new Number(23)}))

console.log(new LessThan(
        new Add(new Variable('x'), new Number(2)),
        new Variable('y')
    ).evaluate({x: new Number(2),y: new Number(5)}))