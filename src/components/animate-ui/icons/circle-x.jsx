'use client';;
import * as React from 'react';
import { motion } from 'motion/react';

import { getVariants, useAnimateIconContext, IconWrapper } from '@/components/animate-ui/icons/icon';

const animations = {
  default: {
    circle: {},

    line1: {
      initial: {
        rotate: 0,
        transition: { ease: 'easeInOut', duration: 0.4 },
      },
      animate: {
        rotate: 90,
        transition: { ease: 'easeInOut', duration: 0.4 },
      },
    },

    line2: {
      initial: {
        rotate: 0,
        transition: { ease: 'easeInOut', duration: 0.4, delay: 0.1 },
      },
      animate: {
        rotate: 90,
        transition: { ease: 'easeInOut', duration: 0.4, delay: 0.1 },
      },
    }
  }
};

function IconComponent({
  size,
  ...props
}) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <motion.circle
        cx={12}
        cy={12}
        r={10}
        variants={variants.circle}
        initial="initial"
        animate={controls} />
      <motion.line
        x1={9}
        y1={15}
        x2={15}
        y2={9}
        variants={variants.line1}
        initial="initial"
        animate={controls} />
      <motion.line
        x1={9}
        y1={9}
        x2={15}
        y2={15}
        variants={variants.line2}
        initial="initial"
        animate={controls} />
    </motion.svg>
  );
}

function CircleX(props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { animations, CircleX, CircleX as CircleXIcon };
