"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import styles from "./page.module.scss";
import Footer from "@/components/footer/Footer";

//types
type Profile = {
    profileImage: string,
    name: string,
    role: string,
    bio: string,

}

type ProfileCardProps = Profile & { custom?: number };

//animation variants
const textVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({ 
        opacity: 1, y: 0, 
        transition: { 
            duration: 0.5, 
            delay: i * 0.3, 
        } 
    }), 
}

//components
const ProfileCard = ({profileImage, name, role, bio, custom = 0 }: ProfileCardProps) => {
    return (
        <motion.div className={styles.profileCard}
            variants={textVariant} custom={custom}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
        >
            <div className={styles.profileCard__picture}>
                <Image
                    src={profileImage}
                    alt={name}
                    width={400}
                    height={400}
                />
                <div className={styles.profileCard__info}>
                    <h3>{name}</h3>
                    <p className={styles.role}>{role}</p>
                    <p className={styles.bio}>{bio}</p>
                </div>
            </div>
        </motion.div>
    )
}

//main component
const AboutUs = () => {
    const headerRef = useRef<HTMLDivElement|null>(null)

    const headerRefIsInView = useInView(headerRef, {amount: "some", once: true})
    return(
        <motion.div
            className={styles.aboutUs}
        >
            <div className={styles.aboutUs__header} ref={headerRef}>
                <div className={styles.aboutUs__header__image}>
                    {headerRefIsInView && (
                        <Image
                            src="/company-animate.svg"
                            alt="rexon members"
                            width={700}
                            height={700}
                            priority
                        />
                    )}
                </div>
                <motion.div 
                    className={styles.aboutUs__header__text}
                    initial={{ opacity: 0, x: 30 }}
                    animate={headerRefIsInView? { opacity: 1, x: 0 } : {opacity: 0, x: 30}}
                    transition={{ duration: 0.8, delay: 1.5 }}
                >

                    <h2>
                        Meet the Engineers of Rexon Dev!
                    </h2>
                    <p>
                        We are not just developers and designers; we are a team of actual engineers driven by a shared passion for building robust and elegant digital solutions. For us, creativity personified is about applying a methodical, engineering mindset to every challenge, transforming your digital dreams into tangible realities.
                    </p>
                </motion.div>
            </div>
            <motion.div className={styles.ourEngineers}>
                {[
                    {
                        profileImage: "/profiles/joePP.jpg",
                        name: "Joseph Aneto",
                        role: "Full-Stack Engineer, Chief Executive Officer",
                        bio: "Joe, CEO and founder, blends technical expertise with creative vision. A full-stack developer skilled in front-end, back-end and web3 technologies, he leads the agency in building sleek, scalable apps. His passion for beautiful UI—and a love for anime—shapes the team’s culture and innovation."
                    },{
                        profileImage: "/profiles/divinePP.jpg",
                        name: "Divine Nwachukwu",
                        role: "Mobile Engineer, Chief Operations Officer",
                        bio: "Divine, COO and mobile software engineer, is passionate about crafting seamless mobile experiences. Skilled in Flutter, he focuses on performance optimization and intuitive design, ensuring our apps are not only functional but also delightful to use on any device."
                    },{
                        profileImage: "/profiles/michealPP.jpg",
                        name: "Micheal Emmanuel",
                        role: "Front-end Engineer, Chief Technical Officer",
                        bio: "Micheal, our CTO, specializes in frontend and Web3 development with a focus on sleek and intuitive user interfaces and most-valued experience in web3 infastructure. Skilled in Javascript, React, Next.js, and modern CSS frameworks, he drives the agency’s frontend and web3 vision, ensuring every product feels as good as it looks, cause what's a product without good ui."
                    },{
                        profileImage: "/profiles/umorenPP.jpg",
                        name: "Emmanuel Umoren",
                        role: "UI/UX Designer, Chief Product Officer",
                        bio: "Emmanuel, CPO and lead UI/UX engineer, combines a keen eye for design with a user-centric approach. Proficient in Figma, and user research methodologies, he ensures every project not only meets business goals but also delivers an exceptional user experience and best believe he's always ging to deliver."
                    },{
                        profileImage: "/profiles/ebubePP.jpg",
                        name: "Ebubechi Ihediwa",
                        role: "Mobile Engineer, Head of Mobile Development",
                        bio: "Ebube is a highly experienced mobile developer specializing in React Native. With years of building fast, reliable, and user-friendly apps, he ensures our mobile solutions run smoothly across platforms. His expertise helps the agency deliver seamless mobile experiences that match modern user expectations."
                    },{
                        profileImage: "/profiles/ifeanyiPP.jpg",
                        name: "Ifeanyi Ojukwu",
                        role: "UI/UX Designer",
                        bio: "Ifeanyi, a talented UI/UX engineer, is dedicated to creating intuitive and engaging user experiences. With expertise in design tools like Figma and a strong understanding of user behavior, he crafts interfaces that are both visually appealing and easy to navigate, he has a real knack for knowing designs that just fit."
                    },{
                        profileImage: "/profiles/zionPP.jpg",
                        name: "Zion Ubesie",
                        role: "Frontend Engineer, Mobile Engineer",
                        bio: "Zion navigates both frontend and mobile development with ease, weaving together code that is efficient, scalable, and purposeful. His work bridges design and functionality, ensuring projects feel seamless end to end. With a knack for fresh perspectives, he injects energy and inventive thinking into every build he touches."
                    },{
                        profileImage: "/profiles/sammyPP.jpg",
                        name: "Samuel Kalu-Ichie",
                        role: "Project Manager, UI/UX designer",
                        bio: "Sammy, our project manager and UI/UX designer, ensures smooth project execution from start to finish. With a keen eye for design and a knack for organization, he coordinates teams and timelines while crafting user-centric designs that enhance overall project quality. His dual expertise keeps our projects on track and visually compelling."
                    }
                ].map((engineers, idx)=>(
                    <ProfileCard
                        key={idx}
                        profileImage={engineers.profileImage}
                        name={engineers.name}
                        role={engineers.role}
                        bio={engineers.bio}
                        custom={idx}
                    />
                ))}
                
            </motion.div>
            <div>
                <Footer/>
            </div>
        </motion.div>
    )
}

export default AboutUs;
