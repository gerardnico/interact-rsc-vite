"use client"

import  {useEffect, useRef} from "react";
import type {RuffleConfig, RuffleProps} from "./Ruffle.js";

/**
 * RufflePlayer component for embedding SWF files in Docusaurus
 *
 * @param {string} src - The URL or path to the SWF file
 * @param
 */
const RufflePlayer = ({src, config, children, style, ...rest}: RuffleProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const ruffleInstanceRef = useRef<HTMLDivElement | null>(null);


    // https://github.com/ruffle-rs/ruffle/wiki/Using-Ruffle#configuration-options
    const defaultConfig: RuffleConfig = {
        autoplay: "auto",
    };
    const mergedConfig = {...defaultConfig, ...config};

    // player style
    const defaultStyle = {
        width: "100%", // To get it responsive
    };
    const mergedStyle = {...defaultStyle, ...style};


    useEffect(() => {
        // Load Ruffle script
        const loadRuffle = async () => {
            if (!window.RufflePlayer) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@ruffle-rs/ruffle@0.2.0-nightly.2026.1.9/ruffle.js';
                script.async = true;

                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }

            // Initialize Ruffle player
            let containerRefDomElement = containerRef.current;
            if (containerRefDomElement && window.RufflePlayer) {

                // https://github.com/ruffle-rs/ruffle/wiki/Using-Ruffle#configuration-options
                // global config
                window.RufflePlayer.config = {};

                const ruffle = window.RufflePlayer.newest();
                let player = ruffle.createPlayer();

                /*
                 * player is a DOM object which can be attached and resized as desired using native JavaScript features. For instance, to create a player with a width of 600px and a height of 400px, all you need to do is: player.style.width = "600px"; player.style.height = "400px";
                 */
                Object.assign(player.style, mergedStyle);

                // per-instance config
                player.ruffle().config = mergedConfig

                // Clear container and add player
                containerRefDomElement.innerHTML = '';
                containerRefDomElement.appendChild(player);

                // Load the SWF file
                player.load(src);

                // @ts-ignore
                ruffleInstanceRef.current = player;
            }
        };

        loadRuffle().catch(error => {
            console.error('Failed to load Ruffle:', error);
        });

        // Cleanup
        return () => {
            if (ruffleInstanceRef.current) {
                ruffleInstanceRef.current.remove();
                ruffleInstanceRef.current = null;
            }
        };
    }, [src]);

    return (
        <div
            className={"player-container"}
            ref={containerRef}
            {...rest}
        />
    );
};

export default RufflePlayer;
