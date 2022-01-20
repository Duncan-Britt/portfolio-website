'use_strict';

// const formatDate = new Intl.DateTimeFormat('en-US', {
//   year: '2-digit', month: 'numeric'
// }).format;

// const articles = [
//   { title: "Javascript Execution Context: this",
//     date: new Date(2021, 11),
//     content: [
//       { type: "h", text: "Why this?"},
//       { type: "p", text: "Suppose you want to reference the calling object within a method definition. This can be achieved using the keyword this. It sounds simple, but there are some crucial details which may be unintuitive for the uninitiated. We’ll start by exploring the fact that JavaScript has first class functions. This means that functions may be assigned to a variable, passed as an argument, or returned by a function invocation. To understand the implications with regards to this, let’s take a brief detour and talk about methods."},
//       { type: "h", text: "Methods in JavaScript"},
//       { type: "p", text: "In a class-based Object Oriented language, we might think of (instance) methods as functions which are defined by a class and are associated with/accessible to instances of the class. This definition is problematic in JavaScript for two reasons. Despite the class syntax introduced in ES6, JavaScript doesn’t have true classes. JavaScript functions are first class. Let’s focus on the second point. When a function is assigned to a property of an object, we can call it one of the object’s methods. But the same function which is assigned to a property of an object may also be assigned to a variable, or another object’s property."},
//       { type: "code", text: `
// const foo = function() {
//   console.log('Hellow, World!');
// }
//
// const object = { bar: foo };
//
// foo();        // logs Hello, World!
// object.bar(); // logs Hello, World!
//       `},
//       { type: "p", text: "Rather than thinking in terms of functions vs methods, in JavaScript, it makes more sense to think in terms of function invocation- via foo(); vs method invocation- à la object.bar(). Method invocation in JavaScript is when a function is called on an object. Another way of saying this is that it is invoked with an explicit receiver- whereas function invocation is when a function is invoked with an implicit receiver. The implicit receiver of a (function) invocation is the global object. In a browser, this is the window object."}
//     ],
//   },
//   { title: "Mechanics Of Object Orient JavaScript",
//     date: new Date(2021, 11),
//     content: [
//       { type: "h", text: "Execution Context"},
//       { type: "p", text: "Suppose you want to reference the calling object within a method definition. This can be achieved using the keyword this. It sounds simple, but there are some crucial details which may be unintuitive for the uninitiated. We’ll start by exploring the fact that JavaScript has first class functions. This means that functions may be assigned to a variable, passed as an argument, or returned by a function invocation. To understand the implications with regards to this, let’s take a brief detour and talk about methods."},
//     ],
//   },
//   { title: "The Internet",
//     date: new Date(2021, 11),
//     content: [
//       { type: "h", text: "Some Title"},
//       { type: "p", text: "Suppose you want to reference the calling object within a method definition. This can be achieved using the keyword this. It sounds simple, but there are some crucial details which may be unintuitive for the uninitiated. We’ll start by exploring the fact that JavaScript has first class functions. This means that functions may be assigned to a variable, passed as an argument, or returned by a function invocation. To understand the implications with regards to this, let’s take a brief detour and talk about methods."},
//     ],
//   },
// ];
//
// // articles[0] = {
// //   title: "JavaScript Execution Context: this",
// //   date: new Date(2021, 11, 5),
// //   content: new Content(),
// // };
//
//
//
// // files.forEach(file => {
// //   articles.push(Article.create(file))
// // })
