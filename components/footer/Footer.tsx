"use client"

import Image from "next/image";
import styles from "./footer.module.scss"
import Link from "next/link";
import {
    IconBrandX,
    IconBrandLinkedin,
    IconBrandInstagram,
    IconBrandTiktok,
    IconBrandFacebook,
    IconMail,
} from "@tabler/icons-react";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <div className={styles.footer}>
            <Link href={"/"}>
                <Image src="/logo.svg" alt="logo" width={40} height={40} />
            </Link>
            <nav className={styles.links} aria-label="Footer">
                <Link href="/projects">Projects</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/about-us">About</Link>
            </nav>
            {/* copyright text */}
            <div>
                <p>©{year} Rexon. All rights reserved.</p>
                <p className={styles.credit}>
                    Illustrations by <a href="https://storyset.com" target="_blank" rel="noopener noreferrer">Storyset</a>
                </p>
            </div>

            {/* Social Links */}
            <div className={styles.socials}>
                <a href="mailto:info@rexon.dev" aria-label="Email us">
                    <IconMail stroke={2}/>
                </a>
                <a href="https://www.instagram.com/rexondev" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                    <IconBrandInstagram stroke={2}/>
                </a>
                <a href="https://www.tiktok.com/@rexoninc" target="_blank" rel="noopener noreferrer" aria-label="Follow us on TikTok">
                    <IconBrandTiktok stroke={2}/>
                </a>
                <a href="https://www.facebook.com/share/1CT3dXpU7A/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
                    <IconBrandFacebook stroke={2}/>
                </a>
                <a href="https://x.com/rexon_dev" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X (Twitter)">
                    <IconBrandX stroke={2}/>
                </a>
                <a href="https://www.linkedin.com/company/rexon-dev/" target="_blank" rel="noopener noreferrer" aria-label="Connect with us on LinkedIn">
                    <IconBrandLinkedin stroke={2}/>
                </a>
            </div>
        </div>
    );
}1