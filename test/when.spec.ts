import test from 'ava'
import { ref } from '@vue/reactivity'
import { when } from '../src'

test('should work', (t) => {
  const r = ref(0)

  ;(async() => {
    t.is(r.value, 0)

    await when(r).toBe(1)

    t.is(r.value, 1)
  })()

  setTimeout(() => {
    r.value = 1
  }, 100)
})
