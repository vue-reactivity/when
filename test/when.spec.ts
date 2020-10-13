import test from 'ava'
import { ref } from '@vue/reactivity'
import { invoke, when } from '../src'

test('should work', (t) => {
  const r = ref(0)

  invoke(async() => {
    t.is(r.value, 0)
    await when(r).toBe(1)
    t.is(r.value, 1)
  })

  setTimeout(() => {
    r.value = 1
  }, 100)
})

test('should work for changedTimes', (t) => {
  const r = ref(0)

  invoke(async() => {
    t.is(r.value, 0)
    await when(r).changedTimes(3)
    t.is(r.value, 3)
  })

  setTimeout(() => {
    r.value = 1
    r.value = 2
    r.value = 3
  }, 100)
})

test('should support `not`', (t) => {
  const r = ref(0)

  invoke(async() => {
    t.is(r.value, 0)
    await when(r).not.toBe(0)
    t.is(r.value, 1)
  })

  setTimeout(() => {
    r.value = 1
  }, 100)
})
