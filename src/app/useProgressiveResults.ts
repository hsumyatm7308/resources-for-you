import { useCallback, useEffect, useRef, useState } from "react"

const BATCH_DELAY_MS = 300

export function useProgressiveResults<T>(items: T[], batchSize = 6) {
  const [visibleCount, setVisibleCount] = useState(batchSize)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const hasMore = visibleCount < items.length

  const clearTimer = useCallback(() => {
    if (timerRef.current === undefined) return
    window.clearTimeout(timerRef.current)
    timerRef.current = undefined
  }, [])

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || timerRef.current !== undefined) return

    setIsLoadingMore(true)
    timerRef.current = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + batchSize, items.length))
      setIsLoadingMore(false)
      timerRef.current = undefined
    }, BATCH_DELAY_MS)
  }, [batchSize, hasMore, isLoadingMore, items.length])

  useEffect(() => {
    clearTimer()
    setVisibleCount(batchSize)
    setIsLoadingMore(false)
  }, [batchSize, clearTimer, items])

  useEffect(() => clearTimer, [clearTimer])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (
      !sentinel ||
      !hasMore ||
      isLoadingMore ||
      typeof IntersectionObserver === "undefined"
    ) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore()
      },
      { rootMargin: "0px 0px 240px 0px" },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, loadMore])

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore,
    isLoadingMore,
    sentinelRef,
    loadMore,
  }
}
