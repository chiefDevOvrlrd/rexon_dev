"use client";

import styles from './page.module.scss';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import Footer from '@/components/footer/Footer';
import BlackButton from '@/components/ui/BlackButton';
import { useRef } from 'react';
import { useChat } from '@/components/context/ChatContext';

//types
type SplitTextProps = {
    text: string;
    isVisible: boolean;
    className?: string;
};

//animation variants
const letterContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.5,   // ⏳ delay before letters start animating
            staggerChildren: 0.1, // delay between letters
        },
    },
};

const letter = {
    hidden: { y: 50, opacity: 0 },
    visible:{
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 20,
        },
    },
};

const textVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({ 
        opacity: 1, y: 0, 
        transition: { 
            duration: 0.5, 
            delay: i * 0.3, 
        } 
    }), 
};

//components
function SplitText({ text, isVisible, className }: SplitTextProps) {
    return (
        <motion.h2
            className={`split-text ${className || ""}`}
            variants={letterContainer}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
        >
        {text.split("").map((letterChar, i) => (
            <motion.span
                key={i}
                variants={letter}
                className={styles.split__text__letter}
                style={{
                    whiteSpace: letterChar === " " ? "pre" : "normal",
                }}
            >
            {letterChar}
            </motion.span>
        ))}
        </motion.h2>
    );
};

//main component
const Pricing = () => {
    const { toggleChat } = useChat();
    const headerRef = useRef<HTMLDivElement|null>(null);
    const factorsRef = useRef<HTMLDivElement|null>(null);
    const engagementRef = useRef<HTMLDivElement|null>(null);


    const headerIsInView = useInView(headerRef, { once: true, amount: 0.5 });
    const factorsIsInView = useInView(factorsRef, { once: true, amount: 0.5 });
    const engagementIsInView = useInView(engagementRef, { once: true, amount: 0.5 });

    return (
        <div className={styles.pricing}>
            <div className={styles.pricing__header} ref={headerRef}>
                <div className={styles.pricing__header__image}>
                        {headerIsInView && (
                            <Image
                                src="/consulting-animate.svg"
                                alt="Consulting Illustration"
                                width={600}
                                height={600}
                                priority
                            />
                        )}
                </div>
                <div className={styles.pricing__header__text}>
                    <motion.h1
                        variants={textVariant} custom={0}
                        initial="hidden"
                        animate={headerIsInView ? "visible" : "hidden"}
                    >Investing in Your Digital Dream.</motion.h1>
                    <motion.p
                        variants={textVariant} custom={1}
                        initial="hidden"
                        animate={headerIsInView ? "visible" : "hidden"}
                    >At <b>Rexon Dev</b>, we believe in <b>transparent and customized pricing</b>. Unlike fixed packages, our approach is meticulously tailored to the unique needs, complexity, and scope of your project, ensuring you only pay for the value you receive. Our goal is to serve as a <b>partner, not just a vendor</b>. We provide clear, value-based investment estimates and custom quotes built on an honest conversation about your budget, goals, and vision, ensuring your high-quality solution meets your exact specifications.</motion.p>
                </div>
            </div>
            <div className={styles.pricing__factors} ref={factorsRef}>
                <div className={styles.pricing__factors__header}>
                    <SplitText 
                        text="What Influences Our" 
                        isVisible={factorsIsInView} 
                        className={styles.pricing__factors__header__text}
                    />
                    <SplitText 
                        text="Pricing?" 
                        isVisible={factorsIsInView} 
                        className={styles.pricing__factors__header__text}
                    />
                    <div className={styles.pricing__factors__content}>
                        <ul>
                            <motion.li
                                variants={textVariant} custom={0}
                                initial="hidden"
                                animate={factorsIsInView ? "visible" : "hidden"}
                            ><b>Project Scope & Complexity: </b>The number of features, pages, and functionalities required for your solution directly impacts the cost. A complex e-commerce platform will require a greater investment than a simple marketing website.</motion.li>
                            <motion.li
                                variants={textVariant} custom={1}
                                initial="hidden"
                                animate={factorsIsInView ? "visible" : "hidden"}
                            ><b>Design Intricacy: </b>A custom, highly interactive UI/UX design requires more time and effort than a standard, template-based approach.</motion.li>
                            <motion.li
                                variants={textVariant} custom={2}
                                initial="hidden"
                                animate={factorsIsInView ? "visible" : "hidden"}
                            ><b>Timeline: </b>A project with a tight deadline that requires a faster turnaround may necessitate a greater investment to dedicate the necessary resources.</motion.li>
                            <motion.li
                                variants={textVariant} custom={3}
                                initial="hidden"
                                animate={factorsIsInView ? "visible" : "hidden"}
                            ><b>Technology Stack: </b>The specific technologies and tools required for the project, especially custom and emerging tech, will affect the development time.</motion.li>
                        </ul>
                    </div>
                </div>
                <div className={styles.pricing__factors__image}>
                    {factorsIsInView && (
                        <Image
                            src="/banknote-animate.svg"
                                alt="banknote illustration"
                                width={600}
                                height={600}
                                priority
                        />
                    )}
                </div>
            </div>
            <div className={styles.pricing__engagementModel} ref={engagementRef}>
                <div className={styles.pricing__engagementModel__image}>
                    {engagementIsInView && (
                        <Image
                            src="/invoice-animate.svg"
                            alt="invoice illustration"
                            width={600}
                            height={600}
                            priority
                        />
                    )}
                </div>
                <div className={styles.pricing__engagementModel__header}>
                    <SplitText
                        text='Our Engagement'
                        isVisible={engagementIsInView}
                        className={styles.pricing__engagementModel__header__text}
                    />
                    <SplitText
                        text='Models?'
                        isVisible={engagementIsInView}
                        className={styles.pricing__engagementModel__header__text}
                    />

                    <ul>
                        <motion.li
                            variants={textVariant} custom={0}
                            initial="hidden"
                            animate={engagementIsInView ? "visible" : "hidden"}
                        ><b>Fixed-Price Projects: </b>Best for projects with a clearly defined scope and detailed requirements. We agree on a final price upfront, and you can rest easy knowing the total cost.</motion.li>
                        <motion.li
                            variants={textVariant} custom={1}
                            initial="hidden"
                            animate={engagementIsInView ? "visible" : "hidden"}
                        ><b>Hourly Rates: </b>Ideal for smaller tasks, ongoing maintenance, or projects with evolving requirements. We track our hours and bill you on a bi-weekly or monthly basis.</motion.li>
                        <motion.li
                            variants={textVariant} custom={2}
                            initial="hidden"
                            animate={engagementIsInView ? "visible" : "hidden"}
                        ><b>Retainer Models: </b>Perfect for long-term partnerships or clients who need dedicated support for continuous development, bug fixes, and feature updates. We agree on a set number of hours per month at a discounted rate.</motion.li>
                    </ul>
                </div>
            </div>
            <div className={styles.pricing__getStarted}>
                <h2>Let&apos;s get rolling!!!</h2>
                <p>The best way to get an accurate quote is to discuss your project with us. Let&apos;s schedule a free consultation to talk about your vision and provide a personalized investment estimate.</p>
            <div className={styles.pricing__getStarted__button}>
                <BlackButton
                    text="Start your Dream"
                    onClick={toggleChat}
                />
            </div>
            </div>
            <Footer />
        </div>
    )
};

export default Pricing;