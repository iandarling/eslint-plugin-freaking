# eslint-plugin-freaking

An ESLint plugin to add some freaking rules.

## Current Rules

### freaking/no-freaking-tadpoles
* See [The Tadpole Operators](https://blogs.msdn.microsoft.com/oldnewthing/20150525-00/?p=45044) for details of how this operator works.
* This rule disallows use of the tadpole operators, and suggests suitable alternative code instead.
* This rule has no configuration options.

Example - given the code:

```
var a = 0;
var b = -~a;
```

The plugin will report:

`No Freaking Tadpoles, prefer "a+1" instead`

## Installation

`npm install eslint-plugin-freaking --save-dev`

Add the `freaking` plugin to your eslintrc file and enable the rule `freaking/no-freaking-tadpoles`.


