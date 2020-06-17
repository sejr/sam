---
title: Thoughts on the Updated Proposal for Generics in Go
tags: golang, programming languages
---

> **This post discusses a proposed feature in the [Go](https://golang.org/) programming language.** If you haven't used Go before, or want a refresher, I recommend going through [A Tour of Go](https://tour.golang.org/welcome/1) before proceeding.

The Go team has shared the next iteration of their design for generics! You might want to read their [announcement](https://blog.golang.org/generics-next-step) or the [updated design draft](https://go.googlesource.com/proposal/+/refs/heads/master/design/go2draft-type-parameters.md) first, but I plan on showing and discussing some of their examples in this post. My goal is to provide an overview of _why_ Go needs generics, and provide some feedback on the design choices they have made thus far.

For context: I have used Go extensively, both in my day job and in side projects. There was a bit of a learning curve at first, mostly due to its opinionated design choices (or _Go-isms_, such as code formatting, naming conventions, and package structure). I have grown to love these features of the language, and I generally embrace "the Go way" as much as possible. I've also spent plenty of time helping engineers coming from other languages (mostly Java) _correctly_ build scalable systems with Go.

Further, and moreso the reason I felt compelled to write this article, I'm a huge fan of [Rust](https://www.rust-lang.org/). You are probably already familiar with Rust if you're taking the time to read an article about programming language design, but if you aren't: it is a modern systems-level language that is fast and safe. It is similar to Go in those respects, but different in many other ways. One such difference is that Rust supports generics.

Generally speaking, I think that Rust has one of the best type systems available today, and I was very happy to see that it informed the design of generics in Go. It is likely that this process will also inform the design of programming languages that come after Go, so I think it's important to have these thoughts documented.

**TLDR: I'm mostly satisfied with the proposal at this point.** For the most part, it is what I would expect from a generics system in Go. There are a handful of issues left for the team to address, which I'll go over, but I don't know that the proposal could be modified much further without fundamentally changing what Go _is_.

That said, let's dig in.

---

# Background

To illustrate why generics are necessary, let's take a look at the implementation of a `Map` function. The map operation is often used in functional programming to _safely_ transform data, along with `Filter` and `Reduce`.

The arguments to the _map_ operation are (1) an array of values, and (2) a function that you want to apply to each value in the array. The result of the operation is a _new_ array containing the results from applying that function to each value.

Let's look at a simple example.

```go
package main

import (
	"fmt"
)

// Add5 adds 5 to a number.
func Add5(a int) int {
	return a + 5
}

// MapInt applies a func to each value in an `int` slice.
func MapInt(vals []int, f func(int) int) []int {
	result := []int{}
	for _, v := range vals {
		result = append(result, f(v))
	}

	return result
}

func main() {
	vals := []int{1, 2, 3}
	result := MapInt(vals, Add5)

	fmt.Println(vals)   // [1 2 3]
	fmt.Println(result) // [6 7 8]
}

```

[Run this example in the Go playground.](https://play.golang.org/p/qd5eABMCV6t)

The first thing you will notice is that this `Map` implementation is limited: it only takes `int` slices as input, and can only process operations that transform an `int` into another `int`. What if we wanted to convert the `int` into a `string`, or some other type?

Today, if you want to do this kind of programming in Go, you can use one of two approaches:

1. Implement (or _generate_) these functions for every transformation you want to use.
2. Abuse the `interface{}` type by employing [type assertion](https://tour.golang.org/methods/15).

**Both of these solutions are bad.** Code generation can be appropriate for certain use cases (e.g. an API client), but not this one. As for type assertion, I'd prefer to live in a world where it was never necessary. I think generics bring us closer to that world.

## Code generation

A lot of people still hear the phrase "code generation" and shudder. _What about DRY?_ For the uninitiated, DRY stands for "don't repeat yourself" and it is a principle held by many programmers (typically after being bashed into their heads in school).

The main idea is that if you find yourself writing the same code multiple times, it should probably be extracted into an _abstraction_, such as a function, that makes your life easier.

Consider the implementation of `MapInt`; it would actually work pretty well if we defined some other conversion functions:

```go
// MapIntString transforms an `[]int` into a `[]string`.
func MapIntString(vals []int, f func(int) string) []string {
	result := []string{}
	for _, v := range vals {
		result = append(result, f(v))
	}

	return result
}

// MapStringInt transforms a `[]string` into an `[]int`.
func MapStringInt(vals []string, f func(string) int) []int {
	result := []int{}
	for _, v := range vals {
		result = append(result, f(v))
	}

	return result
}
```

The only thing that changes between these functions is the contract itself, and the `result` type. It becomes a copy and paste job to add support for additional types, or you could use a program to create them for you automagically.

I think the prevalence of Go has actually contributed to the viability of this approach; the Go CLI actually has support for [generating code](https://blog.golang.org/generate), though I've never heard of anyone actively using it.

## Abusing type assertion

**Type assertion** allows us to arbitrarily convert values from one type to another. When doing this, we are essentially telling the compiler that we know what we are doing. In Go, assertion can only be done on values with type `interface{}`; if the value doesn't conform to the asserted type, your program will panic.

The "complimentary" operation is known as **type erasure**, where type information is intentionally removed from a value so that it can later be ~~abused~~ asserted somewhere else.

Let's look at some examples of these operations in Go.

###

```go
package main

import (
	"fmt"
)

func main() {
	// Turn this `string` into an `interface{}` (type erasure).
	xinterface := interface{}("Hello!")

	// Turn this `interface{}` into a `string` (type assertion).
	xstring := xinterface.(string)

	fmt.Println(xstring)
	fmt.Println(xinterface)

	// INVALID: This assertion will cause the program to panic.
	xint := xinterface.(int)

	fmt.Println(xint)
}
```

[Run this example in the Go playground.](https://play.golang.org/p/lxIzgFjS_0p)

Executing that code produces a panic:

```
Hello!
Hello!
panic: interface conversion: interface {} is string, not int

goroutine 1 [running]:
main.main()
	/tmp/sandbox272217420/prog.go:18 +0x113

Program exited: status 2.
```

You will notice, however, that the Go compiler knows that `xinterface` is actually a `string` behind the scenes. If you're very careful, type assertion can be used to accomplish generic transformations. The caveat is that your code is now plagued by these `interface{}` types.

Let's see how we could implement a generic `Map` function by abusing interfaces.

```go
package main

import (
	"fmt"
)

func Map(vals []interface{}, f func(interface{}) interface{}) []interface{} {
	result := []interface{}{}
	for _, v := range vals {
		result = append(result, f(v))
	}

	return result
}

func FruitToInt(fruit interface{}) interface{} {
	switch fruit.(string) {
	case "apple":
		return interface{}(1)
	case "orange":
		return interface{}(2)
	case "banana":
		return interface{}(3)
	default:
		return interface{}(0)
	}
}

func main() {
	fruits := []interface{}{"apple", "orange", "pear", "banana", "grape"}
	results := Map(fruits, FruitToInt)

	fmt.Println(fruits)  // [apple orange pear banana grape]
	fmt.Println(results) // [1 2 0 3 0]
}
```

[Run this example in the Go playground.](https://play.golang.org/p/R7qSyggObxM)

This is basically the Go equivalent of "porting a JavaScript library to TypeScript" by annotating everything with `any`. It works, but you are losing the benefit of the language's type system.

**Strong type systems need generics\* to safely process complex information.** Hopefully you agree, or at least understand why people are interested in exploring alternatives.

_\* With appropriate constraints. We'll get to that._

> Reminder that we're about to dip into code that _doesn't_ actually work outside of a [special version of the Go playground](https://go2goplay.golang.org/). Everything below this notice is subject to change and/or break in the future.

# Generics in Go

To support generics in Go, both `type` and `func` declarations will be able to receive **type parameters** that indicate which type(s) they are dealing with.

To bring things full circle, let's take a look at the generic `Map` implementation that the Go team provided in their [design draft](https://go.googlesource.com/proposal/+/refs/heads/master/design/go2draft-type-parameters.md).

```go
// Package slices implements various slice algorithms.
package slices

// Map turns a []T1 to a []T2 using a mapping function.
// This function has two type parameters, T1 and T2.
// There are no constraints on the type parameters,
// so this works with slices of any type.
func Map(type T1, T2)(s []T1, f func(T1) T2) []T2 {
	r := make([]T2, len(s))
	for i, v := range s {
		r[i] = f(v)
	}
	return r
}
```

## Constraints

Constraints allow you to refine the behavior

# Outstanding Issues

The design draft discusses a variety of challenges that come with adding support for generics.

## The `Optional` Problem

It wouldn't be a problem if Go had proper enum support. Jesus FUCK

```go
package main

type (
    Optional(T) enum {
        Some(T)
        None
    }
)

func main() {
    // Not allowed, in the same way that a `const` requires a value.
    var x Optional(int)

    // An optional `int` type!
    y := Optional(int).None
}
```

As a bonus, you'd revolutionize error handling

```go
package main

type (
    Result(T, E error) enum {
        Success(T)
        Error(E)
    }
)

func main() {

}
```

## Instantiating Functions

```go
var PrintInts = Print(int)
```

This looks like you're calling a function `Print`.
