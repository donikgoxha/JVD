import { useEffect, useRef, useState } from 'react'

const EMBED_SCRIPT = 'https://app.cal.com/embed/embed.js'

/**
 * Official Cal.com loader snippet, transcribed into a module.
 * It defines window.Cal as a queueing stub and injects embed.js exactly once —
 * every Cal(...) call made before the script finishes is replayed afterwards.
 */
function loadCalOnce() {
  if (typeof window === 'undefined') return null
  ;(function (C, A, L) {
    let p = function (a, ar) {
      a.q.push(ar)
    }
    let d = C.document
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal
        let ar = arguments
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api = function () {
            p(api, arguments)
          }
          const namespace = ar[1]
          api.q = api.q || []
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api
            p(cal.ns[namespace], ar)
            p(cal, ['initNamespace', namespace])
          } else {
            p(cal, ar)
          }
          return
        }
        p(cal, ar)
      }
  })(window, EMBED_SCRIPT, 'init')
  return window.Cal
}

/**
 * Mounts a Cal.com inline booking calendar.
 *
 * @param {object}   options
 * @param {string}   options.calLink   e.g. "jvd-dental/jeton-selimi-goce-delchev"
 * @param {string}   options.namespace unique per calendar instance
 * @param {object}   [options.config]  prefill / query params passed to Cal
 * @param {boolean}  [options.enabled] set false to skip mounting
 * @returns {{ containerRef: React.RefObject<HTMLDivElement>, status: 'idle'|'loading'|'ready'|'error' }}
 */
export function useCalEmbed({ calLink, namespace, config = {}, enabled = true }) {
  const containerRef = useRef(null)
  const [status, setStatus] = useState('idle')

  // Serialise config so the effect only re-runs when values actually change.
  const configKey = JSON.stringify(config)

  useEffect(() => {
    if (!enabled || !calLink || !containerRef.current) return

    const el = containerRef.current
    let cancelled = false
    setStatus('loading')

    const Cal = loadCalOnce()
    if (!Cal) {
      setStatus('error')
      return
    }

    // Fresh container: Cal renders an iframe into it and does not replace a
    // previous one, so we clear it ourselves when the selection changes.
    el.innerHTML = ''

    Cal('init', namespace, { origin: 'https://app.cal.com' })

    Cal.ns[namespace]('inline', {
      elementOrSelector: el,
      calLink,
      layout: 'month_view',
      config: { layout: 'month_view', ...JSON.parse(configKey) },
    })

    Cal.ns[namespace]('ui', {
      hideEventTypeDetails: false,
      layout: 'month_view',
      cssVarsPerTheme: {
        light: {
          'cal-brand': '#1d7791',
          'cal-bg': '#ffffff',
          'cal-border-booker': '#e2e8f0',
        },
      },
    })

    // Cal fires "linkReady" once the iframe has painted.
    const onReady = () => {
      if (!cancelled) setStatus('ready')
    }
    const onFailed = () => {
      if (!cancelled) setStatus('error')
    }
    Cal.ns[namespace]('on', { action: 'linkReady', callback: onReady })
    Cal.ns[namespace]('on', { action: 'linkFailed', callback: onFailed })

    // Safety net: if nothing paints in 12s, show the fallback link.
    const timer = setTimeout(() => {
      setStatus((s) => (s === 'ready' ? s : 'error'))
    }, 12000)

    return () => {
      cancelled = true
      clearTimeout(timer)
      Cal.ns[namespace]?.('off', { action: 'linkReady', callback: onReady })
      Cal.ns[namespace]?.('off', { action: 'linkFailed', callback: onFailed })
      el.innerHTML = ''
    }
  }, [calLink, namespace, configKey, enabled])

  return { containerRef, status }
}
