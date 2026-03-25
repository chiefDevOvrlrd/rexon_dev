'use client';

import styles from "./navbar.module.scss";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react"
import Link from "next/link";
import BlackButton from "../ui/BlackButton";
import { useState, useEffect } from 'react';

const barVariant = {
    visible: { opacity: 1, y:0 },
    hidden: { opacity: 0, y: -100}
}

const linkVariants = {
    initial: { scale: 1, color: "#454444ff" },      
    hover: { scale: 1.2, color: "#fff" },      
    tap: { scale: 1.1, color: "#fff" },
    active: { scale: 1.2, color: "#fff" } 
}


export default function NavBar ({ toggleDialog }: { toggleDialog: () => void }) {
    const [isVisible, setIsVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for menu
    const [isMobileSmall, setIsMobileSmall] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY = currentScrollY;
        };

        const handleResize = () => {
            setIsMobileSmall(window.innerWidth <= 450);
        };

        // Initial check
        handleResize();
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return(
    <>
        <motion.div 
            className={styles.nav} 
            variants={barVariant} 
            animate={isVisible ? "visible" : "hidden"} 
            transition={{ duration: 0.3, ease: "easeInOut" }}   
        >
            <div className={styles.nav__container}>
                <div className={`${styles.nav__links} ${isMenuOpen ? styles.nav__links_open : ''}`}>
                    <ul>
                        <motion.li
                            variants={linkVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            animate={pathname === "/about-us" ? "active" : "initial"}
                        >
                            <Link href={'/about-us'}>About us</Link>
                        </motion.li>
                        <motion.li
                            variants={linkVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            animate={pathname === "/projects" ? "active" : "initial"}
                        >
                            <Link href={'/projects'}>Projects</Link>
                        </motion.li>
                        <motion.li
                            variants={linkVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            animate={pathname === "/pricing" ? "active" : "initial"}
                        >
                            <Link href={'/pricing'}>Pricing</Link>
                        </motion.li>
                        
                    </ul>
                </div>                

                <Link href={'/'}>
                    <motion.div className={styles.nav__logo} layoutId="logo">
                        <Image src="/logo.svg" alt="rexon logo" className={styles.logo}
                            width={80}
                            height={50}
                        />
                        <motion.span
                            className={styles.nav__category}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.8, delay: 4 }}
                        >
                            <h4>Dev.</h4>
                        </motion.span>
                    </motion.div>
                </Link>

                <div className={`${styles.nav__arrow} ${isMenuOpen ? styles.open : ''}`} onClick={toggleMenu}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <div className={styles.nav__button}>
                    <BlackButton text="Start your dream" onClick={toggleDialog} size={isMobileSmall ? 'small' : 'medium'} />
                </div>
            </div>
            
            <div className={`${styles.nav__mobile_menu} ${isMenuOpen ? styles.nav__mobile_menu_open : ''}`}>
                <ul>
                    <motion.li
                        variants={linkVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        animate={pathname === "/about-us" ? "active" : "initial"}
                    >
                        <Link href={'/about-us'}>About us</Link>
                    </motion.li>
                    <motion.li
                        variants={linkVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        animate={pathname === "/projects" ? "active" : "initial"}
                    >
                        <Link href={'/projects'}>Projects</Link>
                    </motion.li>
                    <motion.li
                        variants={linkVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        animate={pathname === "/pricing" ? "active" : "initial"}
                    >
                        <Link href={'/pricing'}>Pricing</Link>
                    </motion.li>
                    
                </ul>
            </div>
        </motion.div>
    </>
    )
}