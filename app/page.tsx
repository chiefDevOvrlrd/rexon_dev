"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import Footer from "@/components/footer/Footer" 
import BlackButton from "@/components/ui/BlackButton";
import WhiteButton from "@/components/ui/WhiteButton";
import LoaderButton from "@/components/ui/LoaderButton";
import { motion, useInView } from "motion/react";
import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useQuoteDialog } from "../components/context/QuoteDialogContext";

// types
type ServiceCardProps = {
  title: string;
  image: string;
  description: string;
};

type SplitTextProps = {
  text: string;
  isVisible: boolean;
  className?: string;
};

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
      delay: i * .9, 
    } 
  }), 
}

//components
function ServiceCard({ title, image, description }: ServiceCardProps) {
  return (
    <div className={styles.service__grid__item}>
      <div className={styles.service__grid__item_face2}>
        <div className={styles.content}>
          <Image src={image} alt={title} width={200} height={100} priority loading="eager"/>
          <h3>{description}</h3>
        </div>
      </div>
      <div className={styles.service__grid__item_face1}>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

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
export default function Home() {
  const { toggleDialog } = useQuoteDialog();
  const serviceSvg = useRef<HTMLDivElement | null>(null);
  const showCaseSvg = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const showCaseSvgIsInView = useInView(showCaseSvg, {amount: "some", once: true})
  const serviceIsInView = useInView(serviceSvg, {amount: 0.2, once: true });
  const ctaIsInView = useInView(ctaRef, {amount: 0.2, once: true });

  const serviceHeader = "How we help you?";
  const ctaHeader = `You can dream but don\'t\nneglect the execution!`;

  return (
    <div className={styles.home__page}>
      <motion.div 
        className={styles.hero}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 1.3, delay: 0.5 }}
      >
        <motion.div 
          className={styles.hero__text}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <h1>Engineering the invisible architecture of tomorrow!</h1>
          <h3>We believe your ambition should know no limits. At Rexon Dev, <span>dream is free</span>, and we&apos;re here to build it.</h3>
          <p>Your dedicated team for exceptional web, mobile, and custom software solutions. Let&apos;s create something extraordinary.</p>
          <div className={styles.hero__button}>
            <BlackButton 
              text="Start your dream" 
              onClick={toggleDialog}
            />
          </div>
        </motion.div>
        <div className={styles.hero__image}>
          <Image src="/hero.svg"
            alt="hero image"
            className={styles.hero__img}
            width={700}
            height={500}
            priority
            unoptimized
          />
        </div>
      </motion.div>
      <motion.div 
        className={styles.service}
        ref={serviceSvg}
      >
        <div className={styles.service__header}>
          <div className={styles.service__image}>
            {serviceIsInView && (
              <Image
                src="/setup-analytics-animate.svg"
                alt="Service SVG"
                width={700}
                height={500}
                priority
              />
            )}
          </div>
          <div className={styles.service__text} >
            <SplitText 
              text={serviceHeader} 
              isVisible={serviceIsInView} 
              className={styles.service__text__header}
            />
            <motion.p
              variants={textVariant} custom={1}
              initial="hidden"
              animate={serviceIsInView ? "visible" : "hidden"}
              className={styles.service__text__description}
            >We specialize in crafting tailored solutions that empower your business to thrive in the digital landscape.</motion.p>
          </div>
        </div>
        <div className={styles.service__grid}>
            {/* services here */}
            {[
              {
                title: "Web Development",
                image: "/website-creator-animate.svg",
                description: "We build powerful, responsive web applications and websites that drive results. Our expertise covers modern frameworks to create scalable, secure, and high-performing digital experiences that function flawlessly on any device.",
              },
              {
                title: "Mobile Development",
                image: "/mobile-development-animate.svg",
                description: "Extend your reach and connect with your audience everywhere. We craft engaging and user-friendly mobile apps for both iOS and Android, focusing on intuitive design and flawless performance to deliver real value to your users.",
              },
              {
                title: "UI/UX Design",
                image: "/ui-ux-design-animate.svg",
                description: "We believe that exceptional software is born from exceptional design. Our designers are focused on creating intuitive and visually stunning digital experiences. We conduct user research, build thoughtful interfaces, and perfect the user journey to ensure your product isn't just functional, but a joy to use.",
              },
              {
                title: "Custom Software",
                image: "/developer-activity-animate.svg",
                description: "When off-the-shelf solutions don't fit, we build tailored software to solve your unique challenges. We design bespoke applications that automate processes and give your business a competitive edge.",
              },
              {
                title: "Web3 Development",
                image: "/bitcoin-animate.svg",
                description: "Ready to build on the blockchain? We'll help you get started. We design and develop secure DApps, custom smart contracts, and even NFT marketplaces to bring your Web3 dream to life."
              },
              {
                title: "Api Integration",
                image: "/software-code-testing-animate.svg",
                description: "Make your existing tools work better together. Our API integration service builds the digital bridges that allow your different software applications—like your CRM, e-commerce store, and marketing platforms—to share data automatically, eliminating manual work and boosting efficiency.",
              }
              // Add more services as needed
            ].map((service, idx) => (
              <ServiceCard
                key={idx}
                title={service.title}
                image={service.image}
                description={service.description}
              />
            ))}
        </div>
      </motion.div>
      <motion.div 
        className={styles.showcase}
        ref={showCaseSvg}
      >
        <div className={styles.showcase__header}>
          <div className={styles.showcase__header__text}>
            <SplitText 
              text="Don&apos;t just take our word" 
              isVisible={showCaseSvgIsInView} 
            />
            <SplitText 
              text="for it."
              isVisible={showCaseSvgIsInView} 
            />
            <motion.h3
              variants={textVariant} custom={2}
              initial="hidden"
              animate={showCaseSvgIsInView ? "visible" : "hidden"}
            >Take our showcase too</motion.h3>
          </div>
          <div className={styles.showcase__header__image}>
            {showCaseSvgIsInView&&(
              <Image src="/online-gallery-animate.svg" alt="gallery" width={700} height={500}/>
            )}
          </div>
        </div>
        <motion.div className={styles.showcase__grid}
          initial="hidden"
          animate={showCaseSvgIsInView ? "visible" : "hidden"}
          variants={textVariant} custom={1}
        >
          {/*add projects here...*/}
          {/*Use short and concise descriptions...*/}
          {[ 
            {
              thumbnail: "/projects/mzacc.svg",
              title: "Mzacc Global",
              tag: "Web Development",
              description:"A clean and modern landing page designed for a startup and its ten sub-companies. Showcases brand identity, smooth color transition, and a scalable layout built to unify multiple services under one platform.",
              embed: "",
              teaser: "/videos/mzacc.mp4",
            },{
                thumbnail: "/projects/legal-crusaders.svg",
                title: "Legal Crusaders",
                tag: "Web Development",
                description: "A sleek, high-performance immigration law landing page built with Next.js 14 and Tailwind CSS — featuring scroll-triggered animations, a fully responsive layout, and a clean separation of concerns across data, logic, and UI layers.",
                embed: "",
                teaser: "/videos/legal-crusaders.mp4"
            },{
              thumbnail: "/projects/attend.svg",
              title: "Attend",
              tag: "Web Development",
              description: "A go-to platform for creating, discovering, and joining events. Whether academic, social, or professional, Attends makes hosting seamless and participation effortless.",
              embed: "",
              teaser: "/videos/attend.mp4",
            }
          ].map((showcase, idx) => {
            return (
              <DesignShowcase
                key={idx}
                thumbnail={showcase.thumbnail}
                title={showcase.title}
                tag={showcase.tag}
                description={showcase.description}
                teaser={showcase.teaser}
                embed={showcase.embed} 
                custom={idx}
              />
            );
          })}
          
        </motion.div>
        <Link href="/projects"
          className={styles.showcase__button}
        >
          <BlackButton
            text="See More?"
          />
        </Link>
        
      </motion.div>
      <div
        className={styles.cta}
        ref={ctaRef}
      >
        <motion.div
          className={styles.cta__container}
          variants={textVariant}
          initial="hidden"
          animate={ctaIsInView ? "visible" : "hidden"}
        >
          <div className={styles.cta__container__text}>
            <SplitText text={ctaHeader} isVisible={ctaIsInView} className={styles.cta__header}/>
            <motion.p 
              className={styles.cta__description}
              variants={textVariant}
              initial="hidden"
              animate={ctaIsInView ? "visible" : "hidden"}
            >Whether you&apos;re a startup looking to make your mark, or an established business aiming to innovate, we&apos;re here to turn your <span>Dream</span> into reality. Let&apos;s build something extraordinary together.</motion.p>
            <div className={styles.cta__container__button}>
              <WhiteButton 
              text="Start your dream"
              onClick={toggleDialog}
              />
            </div>
          </div>
          <div className={styles.cta__image}>
            <Image src="/dreamer-animate.svg"alt="cta image" width={500} height={500}/>
          </div>
        </motion.div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
