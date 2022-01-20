01/19/2022
<div>
<a class="portfolio_link" href="#splice_writeup">Splice: A templating language for the front end</a><time datetime="2022-01-19">01/19/2022</time>
<article id="splice_writeup" loading="lazy">
<br>
<a target="_blank" rel="noopener noreferrer" href="https://duncan-britt.github.io/splice-docs">Docs</a>
<a target="_blank" rel="noopener noreferrer" href="https://github.com/Duncan-Britt/Splice-Lang">Repo</a>
<br>
<br>

## Overview

Splice supports nesting, partial templates, iterators, conditionals, variable assignment, local scope, comments, escape characters, and escapes HTML by default. In its minified form, it is only _ KB, uncompressed, and has no dependencies.

I've written extensively about *how to use* Splice, and that writing is available on the [documentation website](https://duncan-britt.github.io/splice-docs). To avoid excessive redundancy, I would like to use this space to talk about the implementation of the language, design process/choices, and open issues.
=

<br>

## Abstract Syntax Tree (AST)

The AST for Splice begins not with a single root node, but with a collection of its children - the root node is imaginary. There are three types of nodes in the AST:
- text
- binding
- operator

Text nodes and binding nodes are leaf nodes, whereas operator nodes have a body property which is a subtree. I think of the body as just a special kind of argument that always comes last. For example, the syntax tree for the following splice template:

<textarea data-lang="">
<p>Hello, (: username :)! Here are your todos:</p>
<ul>
  (:~ each todos as 'todo {
    <li>
      <h2>(: todo.name :)</h2>
      <p>(: todo.description :)</p>
    </li>
  }:)
</ul>
</textarea>
<br>

would look something like this:

<figure>

![diagram](images/ast.svg)

</figure>
<figcaption>An example Splice AST</figcaption>
<br>

## The front end: Lexer & Parser

The job of the 'front end' is to is to take the former and turn it into the latter.

<br>

## Open issues

It would be good to enable pre-compilation of the templates to enable faster performance. My idea is to have an executable that will parse the template(s) within an html file and compile the syntax tree into javascript code, and then write it to a file. The resulting js file would contain a function which contains the syntax tree written as object/array/string literals. That way there is no parsing client-side, only compilation to html.

I would also like to work on improving the error messages for the language and writing more extensive tests.

<br>

</article>
</div>
