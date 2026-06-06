import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ShiftCard = React.forwardRef(({
  className,
  topContent,
  topAnimateContent,
  bottomContent,
  collapsedHeight = 64,
  expandedHeight = 148,
  children,
  ...props
}, ref) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {/* Background image layer */}
      {children}

      {/* Top overlay: badges + animated actions */}
      <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between z-10">
        <div className="pointer-events-none">{topContent}</div>
        <AnimatePresence>
          {isHovered && topAnimateContent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            >
              {topAnimateContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom expanding panel */}
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-white overflow-hidden"
        animate={{ height: isHovered ? expandedHeight : collapsedHeight }}
        transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
      >
        {typeof bottomContent === 'function' ? bottomContent(isHovered) : bottomContent}
      </motion.div>
    </motion.div>
  );
});

ShiftCard.displayName = 'ShiftCard';
export { ShiftCard };
export default ShiftCard;
