import { createContext, useContext, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const ExpandableScreenContext = createContext(null)

function useExpandableScreen() {
  const context = useContext(ExpandableScreenContext)
  if (!context) {
    throw new Error("useExpandableScreen must be used within an ExpandableScreen")
  }
  return context
}

export function ExpandableScreen({
  children,
  defaultExpanded = false,
  onExpandChange,
  layoutId = "expandable-card",
  triggerRadius = "100px",
  contentRadius = "24px",
  animationDuration = 0.5,
  lockScroll = true,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const expand = () => {
    setIsExpanded(true)
    onExpandChange?.(true)
  }

  const collapse = () => {
    setIsExpanded(false)
    onExpandChange?.(false)
  }

  useEffect(() => {
    if (lockScroll) {
      document.body.style.overflow = isExpanded ? "hidden" : "unset"
    }
  }, [isExpanded, lockScroll])

  return (
    <ExpandableScreenContext.Provider
      value={{ isExpanded, expand, collapse, layoutId, triggerRadius, contentRadius, animationDuration }}
    >
      {children}
    </ExpandableScreenContext.Provider>
  )
}

export function ExpandableScreenTrigger({ children, className = "" }) {
  const { isExpanded, expand, layoutId, triggerRadius } = useExpandableScreen()

  return (
    <AnimatePresence initial={false}>
      {!isExpanded && (
        <motion.div tabIndex={-1} style={{ outline: 'none' }} className={`inline-block relative ${className}`}>
          <motion.div
            style={{ borderRadius: triggerRadius, outline: 'none', border: 'none', background: 'transparent' }}
            layout
            layoutId={layoutId}
            className="absolute inset-0 transform-gpu will-change-transform"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout={false}
            onClick={expand}
            style={{ outline: 'none' }}
            className="relative cursor-pointer"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ExpandableScreenContent({
  children,
  className = "",
  showCloseButton = true,
  closeButtonClassName = "",
}) {
  const { isExpanded, collapse, layoutId, contentRadius, animationDuration } = useExpandableScreen()

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-2">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-white/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration, ease: [0.32, 0.72, 0, 1] }}
          />

          {/* Expanding panel */}
          <motion.div
            layoutId={layoutId}
            transition={{ duration: animationDuration, ease: [0.32, 0.72, 0, 1] }}
            style={{ borderRadius: contentRadius }}
            className={`relative flex h-full w-full overflow-y-auto transform-gpu will-change-transform ${className}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: animationDuration * 0.6, duration: 0.3 }}
              className="relative z-20 w-full"
            >
              {children}
            </motion.div>

            {showCloseButton && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animationDuration * 0.7, duration: 0.2 }}
                onClick={collapse}
                className={`absolute right-6 top-6 z-30 flex h-10 w-10 items-center justify-center transition-colors rounded-full ${
                  closeButtonClassName || "text-white bg-transparent hover:bg-white/10"
                }`}
                aria-label="Cerrar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function ExpandableScreenBackground({ trigger, content, className = "" }) {
  const { isExpanded } = useExpandableScreen()
  if (isExpanded && content) return <div className={className}>{content}</div>
  if (!isExpanded && trigger) return <div className={className}>{trigger}</div>
  return null
}

export { useExpandableScreen }
