---
title: Building a Static Website with NextJS and Vercel
tags: meta, javascript
---

Through my many attempts at creating and maintaining a personal blog, I have tried a variety of different technologies. Early attempts used [WordPress](https://wordpress.com/), then like many others I switched to [Jekyll](https://jekyllrb.com/) and [GitHub Pages](https://pages.github.com/) when I started hosting more of my software projects on GitHub.

Over the last few years, I've heard of various new entries in this space, such as [Hugo](https://gohugo.io/), [Ghost](https://ghost.org/), and of course [Gatsby](https://www.gatsbyjs.org/). The static nature of blogs has become an increasingly-attractive front-end solution for more complex web experiences, resulting in increased attention to these different platforms. Despite the immense popularity of the aforementioned technologies, I have consistently found myself coming back to [Vercel](https://vercel.com/), formerly ZEIT. They are the creators of [NextJS](https://nextjs.org/), which this site is built on.

In addition to this website, most of my side projects are also built with Next and Vercel, but they are not entirely static in nature. I'll discuss those decisions in the future. This post will focus on the architecture of website, for those who might be interested in building a blog with NextJS.

> The code for this entire website is [available on GitHub](https://github.com/sejr/sam). Feel free to fork it, or submit PRs to fix typos or other issues you come across.

With that, let's dig in.

# Front-end Development: Modern Problems and Modern Solutions

Before
