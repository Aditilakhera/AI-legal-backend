import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MouseMoveGlow = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const dx = useSpring(mouseX, springConfig);
    const dy = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            style={{
                translateX: dx,
                translateY: dy,
            }}
            className="fixed top-0 left-0 w-[400px] h-[400px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0 -ml-[200px] -mt-[200px]"
        />
    );
};

export default MouseMoveGlow;
