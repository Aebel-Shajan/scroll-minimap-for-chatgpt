import { useEffect, useRef, useState } from 'react'

export function useShadowContainer() {
  const markerRef = useRef<HTMLDivElement | null>(null)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!markerRef.current) return

    let node: Node | null = markerRef.current
    while (node) {
      if (node instanceof ShadowRoot) {
        setContainer(node as unknown as HTMLElement)
        break
      } else if (node instanceof HTMLElement && node.shadowRoot) {
        setContainer(node.shadowRoot as unknown as HTMLElement)
        break
      }
      node = node.parentNode
    }
  }, [])

  return { container, markerRef }
}
