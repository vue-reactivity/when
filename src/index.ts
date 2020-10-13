import { Ref } from '@vue/reactivity'
import { WatchOptions, watch } from '@vue-reactivity/watch'

export function promiseTimeout(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(reject, ms)
  })
}

export function invoke<T>(fn: () => T): T {
  return fn()
}

interface WhenToMatchOptions {
  flush?: WatchOptions['flush']
  timeout?: number
}

export function when<T>(r: Ref<T>) {
  function toMatch(
    condition: (v: T) => boolean,
    { /* flush = 'post', */ timeout }: WhenToMatchOptions = {},
  ): Promise<void> {
    let stop: Function | null = null
    const watcher = new Promise<void>((resolve) => {
      stop = watch(r, (v) => {
        if (condition(v)) {
          stop?.()
          resolve()
        }
      }, {
        // flush,
        immediate: true,
      })
    })

    const promises = [watcher]
    if (timeout) {
      promises.push(
        promiseTimeout(timeout)
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
    return toMatch(() => true, options)
  }

  function changedTimes(n = 1, options?: WhenToMatchOptions) {
    let count = 0
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
  }
}
