"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/app/context/LoadingContext";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
    const { isLoading } = useLoading();
    const [show, setShow] = useState(true);

    const [minTimePassed, setMinTimePassed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinTimePassed(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isLoading && minTimePassed) {
            // Add a small delay before hiding to ensure smooth transition
            const timer = setTimeout(() => {
                setShow(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isLoading, minTimePassed]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                >
                    {/* Background Gradients & Texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-white to-[#FF6B35]/5" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#FF6B35]/10 via-white to-white" />
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/bg-texture%20copy.jpg')] bg-cover bg-center pointer-events-none mix-blend-multiply" />

                    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4">
                        <motion.div
                            className="relative w-full max-w-[500px] aspect-[3/1]"
                            initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            transition={{
                                duration: 1.2,
                                ease: [0.22, 1, 0.36, 1], // Custom seamless bezier
                            }}
                        >
                            {/* Logo Image */}
                            <div className="relative w-full h-full">
                                <Image
                                    src="/logos/thahama.svg"
                                    alt="Thahama Market"
                                    fill
                                    className="object-contain"
                                    priority
                                />

                                {/* Shimmer Effect Overlay - masked to logo content */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "200%" }}
                                    transition={{
                                        duration: 1.5,
                                        ease: "easeInOut",
                                        delay: 0.5,
                                        repeat: Infinity,
                                        repeatDelay: 2
                                    }}
                                    style={{
                                        maskImage: 'url("/logos/thahama.svg")',
                                        maskSize: 'contain',
                                        maskRepeat: 'no-repeat',
                                        maskPosition: 'center',
                                        WebkitMaskImage: 'url("/logos/thahama.svg")',
                                        WebkitMaskSize: 'contain',
                                        WebkitMaskRepeat: 'no-repeat',
                                        WebkitMaskPosition: 'center'
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* Loading Indicator - Refined */}
                        <motion.div
                            className="mt-12 h-[2px] w-32 bg-gray-100 rounded-full overflow-hidden relative"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-[#FF6B35]"
                                initial={{ width: "0%", x: "-10%" }}
                                animate={{ width: "100%", x: "0%" }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatType: "loop"
                                }}
                            />
                            {/* Moving light on bar */}
                            <motion.div
                                className="absolute inset-y-0 w-[20px] bg-white blur-[2px]"
                                initial={{ left: "-20%" }}
                                animate={{ left: "120%" }}
                                transition={{
                                    duration: 1,
                                    ease: "linear",
                                    repeat: Infinity,
                                    repeatDelay: 0.5
                                }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
