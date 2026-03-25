"use client";

import styles from "./page.module.scss";
import { motion, useInView } from "motion/react";
import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import WhiteButton from "@/components/ui/WhiteButton";
import LoaderButton from "@/components/ui/LoaderButton";
import BlackButton from "@/components/ui/BlackButton";
import Footer from "@/components/footer/Footer";
import { useQuoteDialog } from "@/components/context/QuoteDialogContext";

//types
type DesignShowcaseProps = {
    thumbnail: string;
    title: string; 
    tag: string;
    description: string;    
    teaser?: string;
    embed?: string;
    custom?: number;
};

//animation variants
const textFallVariant = {
    hidden: { opacity: 0, y: -50 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: {
            duration: 0.5,
            delay: i * 0.1,
            ease: "easeInOut" as const,
        }
    }),
}

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
const DesignShowcase = ({thumbnail, title, tag, description, teaser, embed, custom = 0}: DesignShowcaseProps) => {
    const [hovered, setHovered] = useState(false);
    const [showEmbed, setShowEmbed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleMouseEnter = useCallback(() => {
        setHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHovered(false);
        setShowEmbed(false);
        setLoading(false);
    }, []);

    const handleShowEmbed = useCallback(() => {
        setLoading(true);
        setShowEmbed(true);
        setHovered(true);
    }, []);

    const handleCloseEmbed = useCallback(() => {
        setShowEmbed(false);
        setLoading(false);
        setHovered(false);
    }, []);

    const handleIframeLoad = useCallback(() => {
        setLoading(false);
    }, []);
    return (
        <motion.div className={styles.card__container}
            variants={textVariant} custom={custom}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.card}>
                <Image src={thumbnail} alt={title} width={400} height={200} className={styles.card__image} />
            </div>
            <div className={styles.card__overlay}>
                <div className={styles.card__media}>
                    {teaser ? (
                        !hovered ? (
                            thumbnail && <Image src={thumbnail} alt={title} width={400} height={200} />
                        ) : (
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                style={{ width: "100%", borderRadius: "12px" }}
                            >
                                <source src={teaser} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )
                    ) : (
                        thumbnail && <Image src={thumbnail} alt={title} width={400} height={200} />
                    )}
                    {/* Show embed iframe if embed exists and showEmbed is true */}
                    {embed && embed.trim() !== "" && showEmbed && hovered && (
                        <iframe
                            src={embed}
                            style={{ border: "1px solid rgba(0,0,0,0.1)", width: "100%", height: "200px", borderRadius: "12px" }}
                            allowFullScreen
                            title="Figma Embed"
                            className={styles.card__iframe}
                            loading="lazy"
                            onLoad={handleIframeLoad}
                        />
                    )}
                </div>
                <div className={styles.card__content}>
                    <h2 className={styles.card__title}>{title}</h2>
                    <span className={styles.card__tag}>{tag}</span>
                    <p className={styles.card__description}>{description}</p>
                    <div className={styles.figma__button__container}>
                        {embed && embed.trim() !== "" && hovered &&( 
                            loading ? (
                            <LoaderButton disabled />
                            ) : showEmbed ? (
                            <WhiteButton
                                text="Close"
                                onClick={handleCloseEmbed}
                            />
                            )  : (
                            <WhiteButton
                                text="Show Figma"
                                
                                onClick={handleShowEmbed}
                            />
                            )
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

//main component
const Projects = () => {
    const {toggleDialog} = useQuoteDialog()
    const headerRef = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)

    const headerIsInView = useInView(headerRef, {amount: "all", once: true})
    const contentIsInView = useInView(contentRef, {amount: 0.3, once: true})

    return (
        <div className={styles.projects}>
            <div className={styles.projects__header}
                ref={headerRef}
            >
                <div className={styles.projects__header__text}>
                    <motion.h1 
                        variants={textFallVariant}
                        initial="hidden"
                        animate={headerIsInView ? "visible" : "hidden"}
                        custom={0}
                    >
                        Showcase that
                    </motion.h1>
                    <motion.h1 
                        variants={textFallVariant}
                        initial="hidden"
                        animate={headerIsInView ? "visible" : "hidden"}
                        custom={1}
                    >
                        shows just
                    </motion.h1>
                    <motion.h1 
                        variants={textFallVariant}
                        initial="hidden"
                        animate={headerIsInView ? "visible" : "hidden"}
                        custom={2}
                    >
                        enough!
                    </motion.h1>
                    <motion.h3
                        variants={textFallVariant}
                        initial="hidden"
                        animate={headerIsInView ? "visible" : "hidden"}
                        custom={4}
                    >
                        We&apos;re not just showing off; we&apos;re showcasing the dreams we&apos;re making come true—one project at a time.
                    </motion.h3>
                </div>
                <div className={styles.projects__header__image}>
                    {headerIsInView && (
                        <Image src="/innovation-animate.svg" alt="rexon showcase"
                            fill
                            priority 
                        />
                    )}                
                </div>
            </div>
            <div className={styles.projects__content} ref={contentRef}>
                <ol className={styles.projects__content__info}>
                    <motion.li
                        variants={textVariant}
                        initial="hidden"
                        animate={contentIsInView ? "visible" : "hidden"}
                        custom={0}
                    > Hold hover on projects with <span>web development</span>, <span>app development</span> tags to watch project teaser video</motion.li>
                    <motion.li
                        variants={textVariant}
                        initial="hidden"
                        animate={contentIsInView ? "visible" : "hidden"}
                        custom={1}
                    > Click on <span>Show Figma</span> button to view design files for projects with <span>design</span> tag</motion.li>
                    <motion.li
                        variants={textVariant}
                        initial="hidden"
                        animate={contentIsInView ? "visible" : "hidden"}
                        custom={2}
                    > Disclaimer: Not all projects listed here are commissioned company projects. Some are personal works created to demonstrate individual excellence, creativity, and technical expertise.</motion.li>
                </ol>
                <div className={styles.projects__content__grid}>
                    {[
                        {
                            thumbnail: "/projects/the-ark.svg",
                            title: "The Ark",
                            tag: "Web 3, Design",
                            description: "A sleek, modern website for a cutting-edge tech startup, showcasing their innovative solutions and dynamic team.",
                            embed: "https://embed.figma.com/design/eHBxWHbbkw2PnXlTW1o4iR/TheArk?node-id=0-1&embed-host=share",
                            teaser:"",
                        },{
                            thumbnail: "/projects/mzacc.svg",
                            title: "Mzacc Global",
                            tag: "Web Development",
                            description:"A clean and modern landing page designed for a startup and its ten sub-companies. Showcases brand identity, smooth color transition, and a scalable layout built to unify multiple services under one platform.",
                            embed: "",
                            teaser: "/videos/mzacc.mp4",
                        },{
                            thumbnail: "/projects/gmcoffee.svg",
                            title: "GM Coffee",
                            tag: "Web3, Design",
                            description: "Web3-powered UI for a ‘Buy Me a Coffee’ app, enabling simple crypto donations with a smooth, creator-focused experience.",
                            embed: "https://embed.figma.com/design/xIbUBunXa3SOsbcwIrzMRs/GM-Coffee?node-id=0-1&embed-host=share",
                            teaser: "",
                        },{
                            thumbnail: "/projects/attend.svg",
                            title: "Attend",
                            tag: "Web Development",
                            description: "A go-to platform for creating, discovering, and joining events. Whether academic, social, or professional, Attends makes hosting seamless and participation effortless.",
                            embed: "",
                            teaser: "/videos/attend.mp4",
                        },{
                            thumbnail: "/projects/scribl.svg",
                            title: "Scribl",
                            tag: "Web Development, App development",
                            description: "A Rexon Special: Scribl – the smarter way for students to capture, organize, and share knowledge. From personal notes to course-linked highlights, Scribl turns study into a collaborative, engaging experience.",
                            embed: "",
                            teaser: ""
                        },{
                           thumbnail: "/projects/legal-crusaders.svg",
                           title: "Legal Crusaders",
                           tag: "Web Development",
                           description: "A sleek, high-performance immigration law landing page built with Next.js 14 and Tailwind CSS — featuring scroll-triggered animations, a fully responsive layout, and a clean separation of concerns across data, logic, and UI layers.",
                           embed: "",
                           teaser: "/videos/legal-crusaders.mp4"
                        }
                    ].map((project, index) => (
                        <DesignShowcase 
                            key={index}
                            thumbnail={project.thumbnail}
                            title={project.title}
                            tag={project.tag}
                            description={project.description}
                            teaser={project.teaser}
                            embed={project.embed}
                            custom={index}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.projects__cta}>
                <BlackButton text="Start your dream" onClick={toggleDialog} />
            </div>
            <Footer />
        </div>
    ) 
}

export default Projects