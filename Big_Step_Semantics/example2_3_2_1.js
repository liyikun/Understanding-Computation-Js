function printlnStatement(statement) {
    console.log(JSON.stringify(statement))
}

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
        const variable = envirment[`${this.name}`];
        return variable.evaluate && variable.evaluate(envirment) || variable
    }
}

class Add {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    evaluate(envirment) {
        return new Number(this.left.evaluate(envirment) + this.right.evaluate(envirment)).evaluate(envirment)
    }
}

class Multiply {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    evaluate(envirment) {
        return new Number(this.left.evaluate(envirment) * this.right.evaluate(envirment)).evaluate(envirment)
    }
}

class LessThan {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    evaluate(envirment) {
        return new Boolean(this.left.evaluate(envirment) < this.right.evaluate(envirment)).evaluate(envirment)
    }
}

// console.log(new Number(23).evaluate({}))

// console.log(new Variable('x').evaluate({'x': new Number(23)}))

// console.log(new LessThan(
//         new Add(new Variable('x'), new Number(2)),
//         new Variable('y')
//      ).evaluate({x: new Number(2),y: new Number(5)}))


class Assign {
    constructor(name, expression) {
        this.name = name
        this.expression = expression;
    }
    evaluate(envirment) {
        const obj = {};
        obj[`${this.name}`] = this.expression.evaluate && this.expression.evaluate(envirment) || this.expression
        return Object.assign(envirment, obj)
    }
}

class DoNothing {
    evaluate(envirment) {
        return envirment
    }
}

class If {
    constructor(condition, consequence, alternative) {
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
    }
    evaluate(envirment) {
        switch(this.condition.evaluate(envirment)){
            case (new Boolean(true).evaluate(envirment)):
                return this.consequence.evaluate(envirment)
            case (new Boolean(false).evaluate(envirment)):
                return this.alternative.evaluate(envirment)
        }
    }
}

class Sequence {
    constructor(first,second) {
        this.first = first;
        this.second = second;
    }
    evaluate(envirment) {
        return this.second.evaluate(this.first.evaluate(envirment))
    }
}

// const statement = new Sequence(
//     new Assign('x', new Add(new Number(1),new Number(3))),
//     new Assign('y', new Add(new Variable('x'), new Number(3)))
// )

// console.log(JSON.stringify(statement.evaluate({})))


class While {
    constructor(condition,body) {
        this.condition = condition;
        this.body = body
    }
    evaluate(envirment) {
        switch(this.condition.evaluate(envirment)) {
            case new Boolean(true).evaluate(envirment):
                return this.evaluate(this.body.evaluate(envirment))
            case new Boolean(false).evaluate(envirment):
                return envirment    
        }
            
    }
}

const statement2 = new While(
    new LessThan(new Variable('x'),new Number(5)),
    new Assign('x', new Multiply(new Variable('x'), new Number(3)))
)

printlnStatement(statement2.evaluate({'x': new Number(1)}))