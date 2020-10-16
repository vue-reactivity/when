import test from 'ava'
import { reactive, ref } from '@vue/reactivity'
import { invoke, when } from '../src'

test('should work', async(t) => {
  const r = ref(0)

  setTimeout(() => {
    r.value = 1
  }, 100)

  await invoke(async() => {
    t.is(r.value, 0)
    await when(r).toBe(1)
    t.is(r.value, 1)
  })
})

test('should work for changedTimes', async(t) => {
  const r = ref(0)

  setTimeout(() => {
    r.value = 1
    r.value = 2
    r.value = 3
  }, 100)

  t.is(r.value, 0)
  await when(r).changedTimes(3)
  t.is(r.value, 3)
})

test('should work for toBeNaN', async(t) => {
  const r = ref(0)

  setTimeout(() => {
    r.value = NaN
  }, 100)

  t.is(r.value, 0)
  await when(r).toBeNaN()
  t.is(r.value, NaN)
})

test('should work for toBeUndefined', async(t) => {
  const r = ref<undefined | number>(0)

  setTimeout(() => {
    r.value = undefined
  }, 100)

  t.is(r.value, 0)
  await when(r).toBeUndefined()
  t.is(r.value, undefined)
})

test('should work for toContain with Array', async(t) => {
  const r = reactive(['foo'])

  setTimeout(() => {
    r.push('bar')
  }, 100)

  t.deepEqual(r, ['foo'])
  await when(r).toContain('bar')
  t.deepEqual(r, ['foo', 'bar'])
})

test('should work for toContain with Set', async(t) => {
  const r = reactive(new Set([0]))

  setTimeout(() => {
    r.add(1)
  }, 100)

  t.deepEqual(r, new Set([0]))
  await when(r).toContain(1)
  t.deepEqual(r, new Set([0, 1]))
})

test('should work for not', async(t) => {
  const r = ref(0)

  setTimeout(() => {
    r.value = 1
  }, 100)

  await invoke(async() => {
    t.is(r.value, 0)
    await when(r).not.toBe(0)
    t.is(r.value, 1)
  })
})
