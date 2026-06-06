import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { cn } from '@/lib/utils';

const TRANSITION = { type: 'spring', bounce: 0.1, duration: 0.4 };

const FloatingPanelContext = createContext(undefined);

function useFloatingPanel() {
  const ctx = useContext(FloatingPanelContext);
  if (!ctx) throw new Error('useFloatingPanel must be used within FloatingPanelRoot');
  return ctx;
}

export function FloatingPanelRoot({ children, className }) {
  const uniqueId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState(null);
  const [title, setTitle] = useState('');

  const openFloatingPanel = (rect) => { setTriggerRect(rect); setIsOpen(true); };
  const closeFloatingPanel = () => setIsOpen(false);

  return (
    <FloatingPanelContext.Provider value={{ isOpen, openFloatingPanel, closeFloatingPanel, uniqueId, triggerRect, title, setTitle }}>
      <MotionConfig transition={TRANSITION}>
        <div className={cn('relative', className)}>{children}</div>
      </MotionConfig>
    </FloatingPanelContext.Provider>
  );
}

export function FloatingPanelTrigger({ children, className, title }) {
  const { openFloatingPanel, uniqueId, setTitle } = useFloatingPanel();
  const ref = useRef(null);

  return (
    <motion.button
      ref={ref}
      type="button"
      layoutId={`floating-panel-trigger-${uniqueId}`}
      className={cn(
        'w-full flex items-center justify-between px-4 py-3.5 bg-gray-100 rounded-xl text-sm text-left transition-colors hover:bg-gray-200/70',
        className
      )}
      onClick={() => {
        if (ref.current) {
          openFloatingPanel(ref.current.getBoundingClientRect());
          setTitle(title);
        }
      }}
      whileTap={{ scale: 0.99 }}
    >
      <motion.span layoutId={`floating-panel-label-${uniqueId}`} className="text-sm">
        {children}
      </motion.span>
      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </motion.button>
  );
}

export function FloatingPanelContent({ children, className }) {
  const { isOpen, closeFloatingPanel, uniqueId, triggerRect, title } = useFloatingPanel();
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) closeFloatingPanel();
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeFloatingPanel();
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closeFloatingPanel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          layoutId={`floating-panel-${uniqueId}`}
          className={cn(
            'fixed z-[60] overflow-hidden border border-gray-100 bg-white shadow-xl shadow-black/8',
            className
          )}
          style={{
            borderRadius: 12,
            left: triggerRect ? triggerRect.left : '50%',
            top: triggerRect ? triggerRect.bottom + 6 : '50%',
            width: triggerRect ? triggerRect.width : 220,
            transformOrigin: 'top left',
          }}
          initial={{ opacity: 0, scale: 0.94, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 6 }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
        >
          {title && (
            <div className="px-4 py-2.5 border-b border-gray-50">
              <motion.span
                layoutId={`floating-panel-label-${uniqueId}`}
                className="text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                {title}
              </motion.span>
            </div>
          )}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FloatingPanelBody({ children, className }) {
  return (
    <motion.div
      className={cn('py-1.5', className)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPanelButton({ children, onClick, className, active }) {
  return (
    <motion.button
      type="button"
      className={cn(
        'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
        active
          ? 'text-gray-900 font-medium bg-gray-50'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
        className
      )}
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0 transition-opacity',
          active ? 'bg-gray-900 opacity-100' : 'opacity-0'
        )}
      />
      {children}
    </motion.button>
  );
}
