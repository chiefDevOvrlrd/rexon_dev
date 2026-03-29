"use client"

import Image from "next/image";
import styles from "./footer.module.scss"
import Link from "next/link";
import { IconBrandX } from '@tabler/icons-react';
import { IconBrandLinkedin } from "@tabler/icons-react";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <div className={styles.footer}>
            <Link href={"/"}>
                <Image src="/logo.svg" alt="logo" width={40} height={40} />
            </Link>
            {/* copyright text */}
            <div>
                <p>©{year} Rexon. All rights reserved.</p>
            </div>

            {/* Social Links */}
            <div className={styles.socials}>
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