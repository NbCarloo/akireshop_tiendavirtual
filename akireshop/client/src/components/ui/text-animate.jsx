import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const animationVariants = {
  whipIn: {
    container: { hidden: {}, visible: {} },
    child: {
      hidden: { opacity: 0, y: '0.35em' },
      visible: {
        opacity: 1,
        y: '0em',
        transition: { duration: 0.45, ease: [0.85, 0.1, 0.9, 1.2] },
      },
    },
  },
  shiftInUp: {
    container: {
      hidden: {},
      visible: (i = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i },
      }),
    },
    child: {
      hidden: { y: '100%', transition: { ease: [0.75, 0, 0.25, 1], duration: 0.6 } },
      visible: { y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    },
  },
  calmInUp: {
    container: {
      hidden: {},
      visible: (i = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i },
      }),
    },
    child: {
      hidden: { y: '200%', transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.85 } },
      visible: { y: 0, transition: { ease: [0.125, 0.92, 0.69, 0.975], duration: 0.75 } },
    },
  },
  fadeInUp: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    },
    child: {
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      hidden: { opacity: 0, y: 20 },
    },
  },
};

export function TextAnimate({ text, type = 'whipIn', className, ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { container, child } = animationVariants[type];

  if (type === 'whipIn') {
    return (
      <div ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
        {text.split(' ').map((word, wi) => (
          <motion.span
            key={wi}
            className="inline-block mr-[0.25em] whitespace-nowrap overflow-hidden"
            aria-hidden="true"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={container}
            transition={{ delayChildren: wi * 0.13, staggerChildren: 0.025 }}
          >
            {word.split('').map((char, ci) => (
              <motion.span key={ci} variants={child} className="inline-block">
                {char}
              </motion.span>
            ))}
          </motion.span>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ display: 'flex', overflow: 'hidden', flexWrap: 'wrap' }}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      {...props}
    >
      {Array.from(text).map((letter, i) => (
        <motion.span key={i} variants={child}>
          {letter === ' ' ? ' ' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default TextAnimate;
