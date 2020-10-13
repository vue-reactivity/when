import { Ref } from '@vue/reactivity'
import { WatchOptions, watch } from '@vue-reactivity/watch'

export function promiseTimeout(ms: number, throwOnTimeout = false): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout)
      setTimeout(reject, ms)
    else
      setTimeout(resolve, ms)
  })
}

export function invoke<T>(fn: () => T): T {
  return fn()
}

interface WhenToMatchOptions {
  flush?: WatchOptions['flush']
  timeout?: number
  throwOnTimeout?: boolean
}

export function when<T>(r: Ref<T>) {
  let isNot = false

  function toMatch(
    condition: (v: T) => boolean,
    { flush = 'sync', timeout, throwOnTimeout }: WhenToMatchOptions = {},
  ): Promise<void> {
    let stop: Function | null = null
    const watcher = new Promise<void>((resolve) => {
      stop = watch(r, (v) => {
        const mathResult = condition(v)
        const isMatch = isNot ? !mathResult : mathResult
        if (isMatch) {
          stop?.()
          resolve()
        }
      }, {
        flush,
        immediate: true,
      })
    })

    const promises = [watcher]
    if (timeout) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout)
          .finally(() => { stop?.() }),
      )
    }

    return Promise.race(promises)
  }

  function toBe(value: T, options?: WhenToMatchOptions) {
    return toMatch(v => v === value, options)
  }

  function toBeTruthy(options?: WhenToMatchOptions) {
    return toMatch(v => Boolean(v), options)
  }

  function toNotNull(options?: WhenToMatchOptions) {
    return toMatch(v => v != null, options)
  }

  function changed(options?: WhenToMatchOptions) {
    return changedTimes(1, options)
  }

  function changedTimes(n = 1, options?: WhenToMatchOptions) {
    let count = -1 // skip the immediate check
    return toMatch(() => {
      count += 1
      return count >= n
    }, options)
  }

  return {
    toMatch,
    toBe,
    toBeTruthy,
    toNotNull,
    changed,
    changedTimes,
    get not() {
      isNot = !isNot
      return this
    },
  }
}
