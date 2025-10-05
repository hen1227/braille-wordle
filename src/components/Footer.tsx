// src/components/Footer.tsx
import React from "react";
import { GithubIcon } from "./Icons.tsx";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>
                <a href="https://brailledecoded.com" target="_blank" rel="noopener noreferrer">
                    Learn braille with the BrailleDecoded app
                </a>
                &nbsp; · &nbsp;
                <a
                    href="https://github.com/hen1227/braille-wordle"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                >
                    <GithubIcon className="icon-inline" /> Source Code
                </a>
                &nbsp; · &nbsp;
                © {new Date().getFullYear()} Henry Abrahamsen, Eli Beber, and Henhen1227, LLC
            </p>
        </footer>
    );
};

export default Footer;
