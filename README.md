<p align='center'>
<img src='https://github.com/vue-reactivity/art/blob/master/svg/package-when.svg?raw=true' height='250'>
</p>

<p align='center'>
Promised one time watch for <a href="https://github.com/vuejs/vue-next/tree/master/packages/reactivity"><code>@vue/reactivity</code></a>
</p>

<p align='center'>
  <a href="https://www.npmjs.com/package/@vue-reactivity/when"><img src="https://img.shields.io/npm/v/@vue-reactivity/when?color=43b883&label=" alt="npm"></a>
  <a href="https://bundlephobia.com/result?p=@vue-reactivity/when"><img src="https://img.shields.io/bundlephobia/minzip/@vue-reactivity/when?color=364a5e&label=" alt="npm bundle size"></a>
</p>

## Install

<pre>
npm i @vue-reactivity/<b>when</b>
</pre>

For Vue applications, try [`when` in VueUse](https://vueuse.js.org/?path=/story/utilities--when) instead.

### Usage

#### Wait for some async data to be ready

```js
import { when } from '@vue-reactivity/when'

const { state, ready } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

;(async() => {
  await when(ready).toBe(true)

  console.log(state) // state is now ready!
})()
```

#### Wait for custom conditions

> You can use `invoke` to call the async function.

```js
import { when, invoke } from '@vue-reactivity/when'

const { count } = useMyCounter()

invoke(async() => {
  await when(count).toMatch(v => v > 7)

  alert('Counter is now larger than 7!')
})
```

## License

MIT
