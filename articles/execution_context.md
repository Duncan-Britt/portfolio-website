11/05/2021
<div>
<a class="article_link" href="#js_exec_ctx">JavaScript Execution Context: this</a><time datetime="2021-11-05">11/05/2021</time>
<article id="js_exec_ctx" loading="lazy">


#### Why this?

Suppose you want to reference the calling object within a method definition. This can be achieved using the keyword **`this`**. It sounds simple, but there are some crucial details which may be unintuitive for the uninitiated. We’ll start by exploring the fact that JavaScript has first class functions. This means that functions may be assigned to a variable, passed as an argument, or returned by a function invocation. To understand the implications with regards to `this`, let’s take a brief detour and talk about methods.

#### Methods in JavaScript

In a class-based Object Oriented language, we might think of (instance) methods as functions which are defined by a class and are associated with/accessible to instances of the class. This definition is problematic in JavaScript for two reasons.

1. Despite the class syntax introduced in ES6, JavaScript doesn’t have true classes.

2. JavaScript functions are first class.

Let’s focus on the second point. When a function is assigned to a property of an object, we can call it one of the object’s methods. But the same function which is assigned to a property of an object may also be assigned to a variable, or another object’s property.

<textarea>
const foo = function() {
  console.log('Hello, World!');
}

const object = { bar: foo };

foo();        // prints Hello, World!
object.bar(); // prints Hello, World!
</textarea>
![diagram](images/1.svg)

Rather than thinking in terms of functions vs methods, in JavaScript, it makes more sense to think in terms of *function invocation*- via **`foo();`** vs *method invocation*- à la **`object.bar()`**. Method invocation in JavaScript is when a function is called on an object. Another way of saying this is that it is invoked with an *explicit receiver*- whereas function invocation is when a function is invoked with an *implicit receiver*. The implicit receiver of a (function) invocation is the global object. In a browser, this is the **`window`** object.

Normally, within a function/method definition, **`this`** references the receiver of an invocation thereof. Even so, the consequences might seem strange. Consider the following code snippet:

<textarea>
const doubler = {
  multiplier: 2,

  double: function(n) {
    return n * this.multiplier; // n * undefined => NaN
  },

  doubleAll: function(numbers) {
    return numbers.map(this.double);
  },
};

doubler.doubleAll([1, 2, 3]); // returns [NaN, NaN, NaN]
</textarea>
<br>

It might be tempting to think the code should return `[2, 4, 6]`. The trouble is that within the body of **`map`** our **`double`** function is referenced by a parameter and is invoked with an implicit receiver. To illustrate this, imagine that JavaScript’s **`Array.prototype.map`** method is implemented thusly:

<textarea>
Array.prototype.map = function(funcParam) {
  newArray = [];

  this.forEach(item => {
    newArray.push(funcParam(item)); // function invocation
  });               // ^^^ funcParam invoked with an implicit receiver

  return newArray;
};
</textarea>
<br>

It is irrelevant that **`double`** is a property of the **`doubler`** object. It’s not where the function is defined that determines its *this binding*, but rather, the context in which it is invoked. The term **implicit execution context** is used to refer to the receiver of an invocation.

- **`this`** references the execution context of a function/method invocation.

- The implicit execution context of an invocation is the receiver, whether explicit (as in method invocation) or implicit (as in function invocation).

#### Context Loss

In the last example, the fact that `this` within `double` doesn’t reference doubler when invoked is called context loss. There are a variety of strategies to deal with context loss. 

#### **`this`** Argument

Conveniently, many of JavaScript’s built array methods allow you to pass in an object which will serve as the execution context for the function which is passed in. Using this strategy in our previous example would look like this: 

<textarea>
const doubler = {
  multiplier: 2,

  double: function(n) {
    return n * this.multiplier;
  },

  doubleAll: function(numbers) {
    return numbers.map(this.double, this); // <= this argument
  },
};

doubler.doubleAll([1, 2, 3]); // returns [2, 4, 6]
</textarea>

#### Arrow Functions

Alternatively, we could wrap the double function in an arrow function. This works because, unlike other JavaScript functions, the this binding of an arrow function is determined lexically, on the basis of where it is defined, not how it is invoked.

<textarea>
const doubler = {
  multiplier: 2,

  double: function(n) {
    return n * this.multiplier;
  },

  doubleAll: function(numbers) {
    return numbers.map(n => this.double(n)); // <= arrow function
  },
};

doubler.doubleAll([1, 2, 3]); // returns [2, 4, 6]
</textarea>
<br />

Since our arrow function is defined within the body of `doubleAll`, `this` within the arrow function references the execution context of the invocation of `doubleAll`.

#### Variable Assignment - self

Another idiom for dealing with context loss is to assign `this` to a local variable, such as `self`, and replace `this` with `self` within the callback function.

<textarea>
const doubler = {
  multiplier: 2,

  double: function(n) {
    return n * this.multiplier;
  },

  doubleAll: function(numbers) {
    const self = this;
    return numbers.map(function(n) {
      return self.double(n);
    });
  },
};

doubler.doubleAll([1, 2, 3]); // returns [2, 4, 6]
</textarea>
<br />

This works because the object referenced by `self` is not context dependent. `self` is simply a local variable, forever accessible to nested functions via closure.

#### `bind`

We could use the **bind** method to return a new function whose execution context is permanently and irreversibly hard bound to the first argument of bind.

<textarea>
const doubler = {
  multiplier: 2,

  double: function(n) {
    return n * this.multiplier;
  },

  doubleAll: function(numbers) {
    const self = this;
    return numbers.map(this.double.bind(this));
  },
};

doubler.doubleAll([1, 2, 3]); // returns [2, 4, 6]
</textarea>

#### `call` & `apply`

This example problem doesn’t lend itself to the final idiom for dealing with context loss that I will show you, so I’ll offer a different example. The **call** and **apply** methods can each be used to to invoke a function with its execution context set to the first argument to the invocation thereof. Behold:

<textarea>
function xyzzy() {
  return this.a;
}

foo = { a: 5 };

xyzzy.call(foo); // returns 5
</textarea>

</article>
</div>
