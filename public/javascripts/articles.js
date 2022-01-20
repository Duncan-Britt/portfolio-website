const articles = [{"dateStr":"11/05/2021","html":"<div>\n<a class=\"article_link\" href=\"#js_exec_ctx\">JavaScript Execution Context: this</a><time datetime=\"2021-11-05\">11/05/2021</time>\n<article id=\"js_exec_ctx\" loading=\"lazy\">\n\n\n<h4 id=\"why-this\">Why this?</h4>\n<p>Suppose you want to reference the calling object within a method definition. This can be achieved using the keyword <strong><code>this</code></strong>. It sounds simple, but there are some crucial details which may be unintuitive for the uninitiated. We’ll start by exploring the fact that JavaScript has first class functions. This means that functions may be assigned to a variable, passed as an argument, or returned by a function invocation. To understand the implications with regards to <code>this</code>, let’s take a brief detour and talk about methods.</p>\n<h4 id=\"methods-in-javascript\">Methods in JavaScript</h4>\n<p>In a class-based Object Oriented language, we might think of (instance) methods as functions which are defined by a class and are associated with/accessible to instances of the class. This definition is problematic in JavaScript for two reasons.</p>\n<ol>\n<li><p>Despite the class syntax introduced in ES6, JavaScript doesn’t have true classes.</p>\n</li>\n<li><p>JavaScript functions are first class.</p>\n</li>\n</ol>\n<p>Let’s focus on the second point. When a function is assigned to a property of an object, we can call it one of the object’s methods. But the same function which is assigned to a property of an object may also be assigned to a variable, or another object’s property.</p>\n<textarea>\nconst foo = function() {\n  console.log('Hello, World!');\n}\n\nconst object = { bar: foo };\n\nfoo();        // prints Hello, World!\nobject.bar(); // prints Hello, World!\n</textarea>\n<p><img src=\"images/1.svg\" alt=\"diagram\"></p>\n<p>Rather than thinking in terms of functions vs methods, in JavaScript, it makes more sense to think in terms of <em>function invocation</em>- via <strong><code>foo();</code></strong> vs <em>method invocation</em>- à la <strong><code>object.bar()</code></strong>. Method invocation in JavaScript is when a function is called on an object. Another way of saying this is that it is invoked with an explicit receiver- whereas function invocation is when a function is invoked with an implicit receiver. The implicit receiver of a (function) invocation is the global object. In a browser, this is the <strong><code>window</code></strong> object.</p>\n<p>Normally, within a function/method definition, <strong><code>this</code></strong> references the receiver of an invocation thereof. Even so, the consequences might seem strange. Consider the following code snippet:</p>\n<textarea>\nconst doubler = {\n  multiplier: 2,\n\n  double: function(n) {\n    return n * this.multiplier; // n * undefined => NaN\n  },\n\n  doubleAll: function(numbers) {\n    return numbers.map(this.double);\n  },\n};\n\ndoubler.doubleAll([1, 2, 3]); // returns [NaN, NaN, NaN]\n</textarea>\n<br>\n\n<p>It might be tempting to think the code should return <code>[2, 4, 6]</code>. The trouble is that within the body of <strong><code>map</code></strong> our <strong><code>double</code></strong> function is referenced by a parameter and is invoked with an implicit receiver. To illustrate this, imagine that JavaScript’s <strong><code>Array.prototype.map</code></strong> method is implemented thusly:</p>\n<textarea>\nArray.prototype.map = function(funcParam) {\n  newArray = [];\n\n  this.forEach(item => {\n    newArray.push(funcParam(item)); // function invocation\n  });               // ^^^ funcParam invoked with an implicit receiver\n\n  return newArray;\n};\n</textarea>\n<br>\n\n<p>It is irrelevant that <strong><code>double</code></strong> is a property of the <strong><code>doubler</code></strong> object. It’s not where the function is defined that determines its <em>this binding</em>, but rather, the context in which it is invoked. The term <strong>implicit execution context</strong> is used to refer to the receiver of an invocation.</p>\n<ul>\n<li><p><strong><code>this</code></strong> references the execution context of a function/method invocation.</p>\n</li>\n<li><p>The implicit execution context of an invocation is the receiver, whether explicit (as in method invocation) or implicit (as in function invocation).</p>\n</li>\n</ul>\n<h4 id=\"context-loss\">Context Loss</h4>\n<p>In the last example, the fact that this within double doesn’t reference doubler when invoked is called context loss. There are a variety of strategies to deal with context loss. </p>\n<h4 id=\"this-argument\"><strong><code>this</code></strong> Argument</h4>\n<p>Conveniently, many of JavaScript’s built array methods allow you to pass in an object which will serve as the execution context for the function which is passed in. Using this strategy in our previous example would look like this: </p>\n<textarea>\nconst doubler = {\n  multiplier: 2,\n\n  double: function(n) {\n    return n * this.multiplier;\n  },\n\n  doubleAll: function(numbers) {\n    return numbers.map(this.double, this); // <= this argument\n  },\n};\n\ndoubler.doubleAll([1, 2, 3]); // returns [2, 4, 6]\n</textarea>\n\n<h4 id=\"arrow-functions\">Arrow Functions</h4>\n<p>Alternatively, we could wrap the double function in an arrow function. This works because, unlike other JavaScript functions, the this binding of an arrow function is determined lexically, on the basis of where it is defined, not how it is invoked.</p>\n<textarea>\nconst doubler = {\n  multiplier: 2,\n\n  double: function(n) {\n    return n * this.multiplier;\n  },\n\n  doubleAll: function(numbers) {\n    return numbers.map(n => this.double(n)); // <= arrow function\n  },\n};\n\ndoubler.doubleAll([1, 2, 3]); // returns [2, 4, 6]\n</textarea>\n<br />\n\n<p>Since our arrow function is defined within the body of <strong>doubleAll</strong>, <strong>this</strong> within the arrow function references the execution context of the invocation of <strong>doubleAll</strong>.</p>\n<h4 id=\"variable-assignment---self\">Variable Assignment - self</h4>\n<p>Another idiom for dealing with context loss is to assign <strong>this</strong> to a local variable, oft called <strong>self</strong>, and replace references to <strong>this</strong> with <strong>self</strong>.</p>\n<textarea>\nconst doubler = {\n  multiplier: 2,\n\n  double: function(n) {\n    return n * this.multiplier;\n  },\n\n  doubleAll: function(numbers) {\n    const self = this;\n    return numbers.map(function(n) {\n      return self.double(n);\n    });\n  },\n};\n\ndoubler.doubleAll([1, 2, 3]); // returns [2, 4, 6]\n</textarea>\n<br />\n\n<p>This works because the object referenced by self is not context dependent. <strong>self</strong> is simply a local variable, accessible to nested functions via closure.</p>\n<h4 id=\"bind\">bind</h4>\n<p>We could use the <strong>bind</strong> method to return a new function whose execution context is permanently and irreversibly hard bound to the first argument of bind.</p>\n<textarea>\nconst doubler = {\n  multiplier: 2,\n\n  double: function(n) {\n    return n * this.multiplier;\n  },\n\n  doubleAll: function(numbers) {\n    const self = this;\n    return numbers.map(this.double.bind(this));\n  },\n};\n\ndoubler.doubleAll([1, 2, 3]); // returns [2, 4, 6]\n</textarea>\n\n<h4 id=\"call--apply\">call &amp; apply</h4>\n<p>This example problem doesn’t lend itself to the final idiom for dealing with context loss that I will show you, so I’ll offer a different example. The <strong>call</strong> and <strong>apply</strong> methods can each be used to to invoke a function with its execution context set to the first argument to the invocation thereof. Behold:</p>\n<textarea>\nfunction xyzzy() {\n  return this.a;\n}\n\nfoo = { a: 5 };\n\nxyzzy.call(foo); // returns 5\n</textarea>\n\n</article>\n</div>"},{"dateStr":"11/14/2021","html":"<div>\n<a class=\"article_link\" href=\"#oojs\">Mechanics Of Object Orient JavaScript</a><time datetime=\"2021-11-14\">11/14/2021</time>\n<article id=\"oojs\" loading=\"lazy\">\n\n<p>Hopefully this will help you understand how you can implement object oriented design in JavaScript and why it works the way it does.</p>\n<h4 id=\"prerequisites---execution-context-this\">Prerequisites - Execution Context, this</h4>\n<p>If you’re not already familiar with execution context in JavaScript, it is a topic worthy of a separate and lengthy article in and of itself. I recommend <a href=\"https://web.archive.org/web/20180209163541/https://dmitripavlutin.com/gentle-explanation-of-this-in-javascript/\">this one</a>. A brief review:</p>\n<p>The execution context of an invocation is what is referenced by the key word <strong><code>this</code></strong> within a function definition. The implicit execution context of an invocation is the receiver- whether an implicit receiver (as in function invocation) or an explicit receiver (as in method invocation).</p>\n<p>As we shall see, <code>this</code> is useful because it allows programmers to reference the calling object and its properties from within the definition of a method which is shared among many objects.</p>\n<h4 id=\"functions-are-objects\">Functions are objects</h4>\n<p>In Javascript, functions are a type of object. As such, they contain properties like any object can. Every function has a <strong><code>prototype</code></strong> property which, by default, references an object. This prototype object contains a <strong><code>constructor</code></strong> property which, by default, references the function.</p>\n<p><img src=\"images/2.svg\" alt=\"diagram\"></p>\n<p>To demonstrate this with code, try the following in your browser’s console:</p>\n<textarea>\nfunction aFunction() {\n  // ...\n}\n\naFunction.prototype; // {constructor: ƒ}\naFunction.prototype.constructor === aFunction; // true\n</textarea>\n\n<h4 id=\"prototypes\">Prototypes</h4>\n<p>In JavaScript, every object has an object prototype referenced by its <strong><code>[[Prototype]]</code></strong> property. This property can be accessed by the <strong><code>\\_\\_proto\\_\\_</code></strong> accessor method. (It’s pronounced “dunder proto” due to its leading and trailing double underscores). It’s important to note the distinction between a function’s prototype property and the <code>[[Prototype]]</code> property which belongs to all objects (including functions).</p>\n<p><em>Before going further, I should mention that accessing an object’s</em> <code>[[Prototype]]</code> <em>directly via the</em> <code>\\_\\_proto\\_\\_</code> <em>accessor is deprecated. JavaScript provides the methods</em> <code>Object.getPrototypeOf</code> <em>and</em> <code>Object.setPrototypeOf</code> <em>to access an object’s</em> <code>[[Prototype]]</code>. <em>However, I will continue to use</em> <code>\\_\\_proto\\_\\_</code> <em>for explanatory purposes. If you want to test my code in your browser and you find that</em> <code>\\_\\_proto\\_\\_</code> <em>doesn’t work, you can substitute</em> <code>foo.\\_\\_proto\\_\\_</code> <em>with</em> <code>Object.getPrototypeOf(foo)</code> <em>and it should work.</em></p>\n<p>When creating an object via an object literal, its <code>[[Prototype]]</code> property refers to the same object referenced by <code>Object.prototype</code>, which serves as the base <code>[[Prototype]]</code> for all objects. This base prototype object has its own <code>[[Prototype]]</code> property which stores <code>null</code>.</p>\n<figure>\n\n<p><img src=\"images/3.svg\" alt=\"diagram\"></p>\n</figure>\n<figcaption>Note that <code>Object</code> is a JavaScript function.</figcaption>\n\n<textarea>\n( {} ).__proto__ === Object.prototype; // true;\nObject.prototype.__proto__ === null; // true;\n</textarea>\n<br />\n\n<p>Functions being objects, they also have their own <code>[[Prototype]]</code> which I have omitted from the above diagram since its not central to the point of this article. However, for those who are curious, here’s something to chew on:</p>\n<p><img src=\"images/4.svg\" alt=\"diagram\"></p>\n<h4 id=\"behavior-delegation-and-the-prototype-chain\">Behavior Delegation and the Prototype Chain</h4>\n<p>The <em>prototype chain</em> of an object refers to the series of objects referenced by each others&#39; <code>[[Prototype]]</code> properties.</p>\n<figure>\n\n<p><img src=\"images/5.svg\" alt=\"diagram\"></p>\n</figure>\n<figcaption>A parent is the <code>\\[\\[Prototype\\]\\]</code> of its child.</figcaption>\n\n<p>When you attempt to access a property of an object, if JavaScript doesn’t find the property within the object, it will search the object’s prototype chain until it either finds the property or reaches the end of the chain, in which case it returns <code>undefined</code>. This is why you can sometimes invoke a method on an object which hasn’t been assigned to a property of that object. All JavaScript objects by default have access to the properties of the object referenced by <code>Object.prototype</code> since it is at the end of their prototype chain.</p>\n<textarea>\n({}).notAProperty; // undefined\n({}).hasOwnProperty('foo'); // false\n({}).toString(); // '[object Object]'\n</textarea>\n<br/>\n\n<p>Type <code>Object.prototype</code> into your browser’s console to view the available methods.</p>\n<figure>\n\n<p><img src=\"images/6.svg\" alt=\"diagram\"></p>\n</figure>\n\n<p>When an object uses methods which are not assigned to one of its own properties, but are referenced further along the prototype chain, we can call it <em>behavior delegation</em> since the requested invocation is passed along, or delegated, to an object further along the chain. Sometimes this is referred to as <em>prototypal inheritance</em>.</p>\n<h4 id=\"constructor-functions\">Constructor functions</h4>\n<p>A constructor function is merely a function whose intended purpose is to instantiate objects. Purely by convention, the name of a constructor function is capitalized to distinguish it from other functions. From the perspective of JavaScript, constructor functions are no different from any other functions and are treated the exact same way (despite that the syntax highlighting in your text editor might lead you to believe otherwise).</p>\n<h4 id=\"the-new-keyword\">The new keyword</h4>\n<p>When a function invocation is prefixed with the <strong><code>new</code></strong> keyword, the execution context for the invocation is set to a new object, sometimes referred to as an <em>instance</em>, which is returned by the expression. <em>(Note: It is only returned by the expression if an object isn’t explicitly returned within the function definition.)</em> Therefore, within the definition of a constructor function, <strong><code>this</code></strong> can be used to assign instance properties to values. <em>If you forget to use new when invoking your constructor function, you’ll assign values to properties of the global object. Don’t do that.</em></p>\n<textarea>\nfunction Constructor(val) {\n  this.foo = val;\n}\n\nconst instance = new Constructor('bar');\ninstance.__proto__ === Constructor.prototype; // true\n\nconst instance2 = new Constructor('baz');\ninstatnce2.__proto__ === Constructor.prototype; // true\n\ninstance.foo; // 'bar'\ninstance2.foo; // 'baz'\n</textarea>\n<br/>\n\n<p>Visualized:</p>\n<figure>\n\n<p><img src=\"images/7.svg\" alt=\"diagram\"></p>\n</figure>\n\n<p>Notice that the <code>[[Prototype]]</code> of the instances is the same object referenced by <code>Constructor.prototype</code>. We can define functions as properties of the prototype to create shared methods accessible to all instances.</p>\n<textarea>\nConstructor.prototype.xyz = function() {\n  return this;\n}\n\ninstance.xyz();                 //  {foo: 'bar'}\ninstance2.xyz();                // {foo: 'baz'}\ninstance.hasOwnProperty('xyz'); // false;\n</textarea>\n\n<figure>\n\n<p><img src=\"images/8.svg\" alt=\"diagram\"></p>\n</figure>\n<br />\n\n<h4 id=\"inheritance\">Inheritance</h4>\n<p>Supposing we want to create a subtype of object that inherits from <code>Constructor</code>. Our first naive attempt might look something like this:</p>\n<textarea>\nfunction ChildConstructor(val, ownValue) {\n  Constructor.call(this, val);\n  this.qux = ownValue;\n}\n\nconst childInstance = new ChildConstructor('xyzzy', 5);\n\nchildInstance.xyz(); // Uncaught TypeError:\n                     // childInstance.xyz is not a function\n</textarea>                    \n<br />\n\n<p>The problem with this is that the <code>[[Prototype]]</code> property of <code>ChildConstructor.prototype</code> points to <code>Object.prototype</code>.</p>\n<textarea>\nchildConstructor.prototype.__proto__ === Object.prototype;\n// true\n</textarea>\n<br />\n\n<p><img src=\"images/9.svg\" alt=\"diagram\">\n<br /></p>\n<p>Therefore, no property by the name of <code>xyz</code> can be found on the child instance’s prototype chain. In order to have access to <code>xyz</code>, we need to put <code>Constructor.prototype</code> on the child instance’s prototype chain by setting <code>ChildConstructor.prototype</code>’s <code>[[Prototype]]</code> to be <code>Constructor.prototype</code>.  What a mouthful! Our next naive attempt might look something like this:</p>\n<textarea>\n\nfunction ChildConstructor(val, ownValue) {\n  Constructor.call(this, val);\n  this.qux = ownValue;\n}\n\nChildConstructor.prototype.__proto__ = Constructor.prototype;\n\nconst childInstance = new ChildConstructor('xyzzy', 5);\n\nchildInstance.xyz(); // {foo: 'xyzzy', qux: 5}\n\n</textarea>\n<br />\n\n<p>This works, however, it is recommended that you avoid altering the <code>[[Prototype]]</code> of an object for performance reasons. <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf\">This article</a> on MDN offers a better explanation. Alternatively, you can reassign the child constructor’s prototype property to a new object whose <code>[[Prototype]]</code> is already the desired object, using <code>Object.create</code>.</p>\n<textarea>\nfunction ChildConstructor(val, ownValue) {\n  Constructor.call(this, val);\n  this.qux = ownValue;\n}\n\nChildConstructor.prototype = Object.create(Constructor.prototype);\nChildConstructor.prototype.constructor = ChildConstructor;\n\nChildConstructor.prototype.childFunction = function() {\n  return this.foo;\n}\n\nconst childInstance = new ChildConstructor('xyzzy', 5);\n\nchildInstance.xyz();                                    \n// {foo: 'xyzzy', qux: 5}\nchildInstance.childFunction();                          \n// 'xyzzzy';\nchildInstance.qux;                                      \n// 5\nchildInstance.__proto__ === ChildConstructor.prototype;\n// true\nchildInstance.constructor === ChildConstructor;         \n// true\n\n</textarea>\n<br />\n\n<p><code>Object.create</code>, when called, creates and returns a new object whose <code>[[Prototype]]</code> is the argument to the invocation of <code>Object.create</code>. But this new object doesn’t have its own <code>constructor</code> property. Notice that we assign <code>ChildConstructor</code> to <code>ChildConstructor.prototype.constructor</code>. Otherwise the expression <code>childInstance.constructor</code> would return <code>Constructor</code> instead of <code>ChildConstructor</code>.</p>\n<p><img src=\"images/10.svg\" alt=\"diagram\"></p>\n<h4 id=\"objects-linking-to-other-objects-oloo\">Objects Linking to Other Objects (OLOO)</h4>\n<p>To quickly build a mental model of the OLOO pattern of object creation, compare the above diagram to the following:</p>\n<p><img src=\"images/11.svg\" alt=\"diagram\">\n<br /></p>\n<p>The purpose of <code>Object.create</code> is worth reiterating:  </p>\n<p><code>Object.create</code><em>, when called, creates and returns a new object whose</em> <code>[[Prototype]]</code> <em>is the argument to the invocation of</em> <code>Object.create</code>.</p>\n<p>We can use an object literal to create a prototype. Then we’ll use <code>Object.create</code> to make objects which link to that object. We can use an initializer method to set the values of instance properties on our newly created object.</p>\n<textarea>\nconst Prototype = {\n  addA: function(n) {\n    return this.a + n;\n  }\n\n  init: function(n) {\n    this.a = a;\n    return this;\n  }\n}\n\nconst instance = Object.create(Prototype).init(20);\n\ninstance.a;                       // 20\ninstance.addA(10);                // 30\ninstance.__proto__ === Prototype; // true\n</textarea>\n<br />\n\n<p><img src=\"images/12.svg\" alt=\"diagram\">\n<br /></p>\n<p>The process for making a subtype is fairly straightforward.\n<br /></p>\n<textarea>\nconst ChildPrototype = Object.create(Prototype);\nChildPrototype.init.call = function(a, b) {\n  Prototype.init.call(this, a);\n  this.b = b;\n  return this;\n};\n\nconst childInstance = Object.create(ChildPrototype).init(5, 7);\nchildInstance;         // {a: 5, b: 7}\nchildInstance.addA(3); // 8\nchildInstance.__proto__ === ChildPrototype; // true\nchildInstance.hasOwnPrototype('addA');      // false\n</textarea>\n<br />\n\n<p><img src=\"images/13.svg\" alt=\"diagram\">\n<br /></p>\n</article>\n</div>"}]