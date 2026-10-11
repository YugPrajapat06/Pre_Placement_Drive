import React, { useEffect, useRef } from "react";

import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Icon } from "@iconify/react";

gsap.registerPlugin(ScrollTrigger);

const BACKGROUND = "#050505";

export const FLUX_VORTEX_DEFAULTS = {
    speed: 1,
    size: 1,
    density: 1,
    opacity: 1,
    hue: 0,
    saturation: 1,
    brightness: 1,
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export default function FluxVortex({
    speed = FLUX_VORTEX_DEFAULTS.speed,
    size = FLUX_VORTEX_DEFAULTS.size,
    density = FLUX_VORTEX_DEFAULTS.density,
    opacity = FLUX_VORTEX_DEFAULTS.opacity,
    hue = FLUX_VORTEX_DEFAULTS.hue,
    saturation = FLUX_VORTEX_DEFAULTS.saturation,
    brightness = FLUX_VORTEX_DEFAULTS.brightness,
    className = "",
}) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const coordsRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        // -------------------------------------------------------------------------
        // Safe values
        // -------------------------------------------------------------------------

        const safeSpeed = clamp(speed, 0, 3);
        const safeSize = clamp(size, 0.05, 200);
        const safeDensity = clamp(density, 0.25, 2.5);
        const safeOpacity = clamp(opacity, 0.05, 1);

        // -------------------------------------------------------------------------
        // Scene
        // -------------------------------------------------------------------------

        const scene = new THREE.Scene();

        scene.background = new THREE.Color(BACKGROUND);

        scene.fog = new THREE.FogExp2(
            BACKGROUND,
            0.04
        );

        // -------------------------------------------------------------------------
        // Camera
        // -------------------------------------------------------------------------

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.z = 7;

        // -------------------------------------------------------------------------
        // Renderer
        // -------------------------------------------------------------------------

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: false,
            powerPreference: "high-performance",
            alpha: false,
        });

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        renderer.toneMappingExposure = 1;

        // -------------------------------------------------------------------------
        // Main Group
        // -------------------------------------------------------------------------

        const mainGroup = new THREE.Group();

        scene.add(mainGroup);

        // -------------------------------------------------------------------------
        // Vortex Particle Field
        // -------------------------------------------------------------------------

        const vortexCount = Math.max(
            1200,
            Math.round(9500 * safeDensity)
        );

        const vortexPositions =
            new Float32Array(vortexCount * 3);

        const vortexRadius =
            new Float32Array(vortexCount);

        const vortexAngle =
            new Float32Array(vortexCount);

        const vortexHeight =
            new Float32Array(vortexCount);

        const vortexSpeed =
            new Float32Array(vortexCount);

        for (
            let i = 0;
            i < vortexCount;
            i++
        ) {
            const i3 = i * 3;

            const y =
                (Math.random() - 0.5) * 7.5;

            const funnel =
                0.4 + Math.abs(y) * 0.2;

            const radius =
                (
                    0.1 +
                    Math.pow(
                        Math.random(),
                        1.5
                    ) * 2.5
                ) * funnel;

            const angle =
                Math.random() * Math.PI * 2;

            vortexHeight[i] = y;
            vortexRadius[i] = radius;
            vortexAngle[i] = angle;

            vortexSpeed[i] =
                0.5 + Math.random() * 0.8;

            vortexPositions[i3] =
                Math.cos(angle) * radius;

            vortexPositions[i3 + 1] = y;

            vortexPositions[i3 + 2] =
                Math.sin(angle) * radius;
        }

        const vortexGeometry =
            new THREE.BufferGeometry();

        vortexGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                vortexPositions,
                3
            )
        );

        const vortexMaterial =
            new THREE.PointsMaterial({
                size: 0.006 * safeSize,
                color: 0xdddddd,
                transparent: true,
                opacity: 0.6 * safeOpacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });

        const vortexPoints =
            new THREE.Points(
                vortexGeometry,
                vortexMaterial
            );

        mainGroup.add(vortexPoints);

        // -------------------------------------------------------------------------
        // Spiral Lines
        // -------------------------------------------------------------------------

        function createSpiralLine(
            turnOffset,
            color
        ) {
            const points = [];

            const pointCount = 400;

            for (
                let i = 0;
                i < pointCount;
                i++
            ) {
                const t =
                    i / (pointCount - 1);

                const angle =
                    t * Math.PI * 14 +
                    turnOffset;

                const radius =
                    0.2 + t * 2.8;

                const y =
                    (0.5 - t) * 6;

                points.push(
                    new THREE.Vector3(
                        Math.cos(angle) * radius,
                        y,
                        Math.sin(angle) * radius
                    )
                );
            }

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(points);

            const material =
                new THREE.LineBasicMaterial({
                    color,
                    transparent: true,
                    opacity: 0.15 * safeOpacity,
                    blending: THREE.AdditiveBlending,
                });

            return new THREE.Line(
                geometry,
                material
            );
        }

        const spiralLineA =
            createSpiralLine(
                0,
                0x555555
            );

        const spiralLineB =
            createSpiralLine(
                Math.PI,
                0xdddddd
            );

        mainGroup.add(spiralLineA);
        mainGroup.add(spiralLineB);

        // -------------------------------------------------------------------------
        // Ambient Particles
        // -------------------------------------------------------------------------

        const particlesCount =
            Math.max(
                40,
                Math.round(300 * safeDensity)
            );

        const particlesGeometry =
            new THREE.BufferGeometry();

        const positions =
            new Float32Array(
                particlesCount * 3
            );

        for (
            let i = 0;
            i < particlesCount * 3;
            i++
        ) {
            positions[i] =
                (Math.random() - 0.5) * 12;
        }

        particlesGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                positions,
                3
            )
        );

        const particlesMaterial =
            new THREE.PointsMaterial({
                size: 0.008 * safeSize,
                color: 0x555555,
                transparent: true,
                opacity: 0.4 * safeOpacity,
                blending: THREE.AdditiveBlending,
            });

        const particlesMesh =
            new THREE.Points(
                particlesGeometry,
                particlesMaterial
            );

        scene.add(particlesMesh);

        // -------------------------------------------------------------------------
        // Bloom
        // -------------------------------------------------------------------------

        const renderPass =
            new RenderPass(
                scene,
                camera
            );

        const bloomPass =
            new UnrealBloomPass(
                new THREE.Vector2(
                    window.innerWidth,
                    window.innerHeight
                ),
                1,
                0.4,
                0.85
            );

        bloomPass.strength = 0.6;
        bloomPass.radius = 0.3;
        bloomPass.threshold = 0.2;

        const composer =
            new EffectComposer(renderer);

        composer.addPass(renderPass);
        composer.addPass(bloomPass);

        // -------------------------------------------------------------------------
        // Mouse
        // -------------------------------------------------------------------------

        let mouseX = 0;
        let mouseY = 0;

        let targetX = 0;
        let targetY = 0;

        let windowHalfX =
            window.innerWidth / 2;

        let windowHalfY =
            window.innerHeight / 2;

        let lastX = 0;
        let lastY = 0;
        let lastTime = 0;

        const glitchTargets =
            containerRef.current?.querySelectorAll(
                ".glitch-target"
            );

        function handleMouseMove(event) {
            mouseX =
                event.clientX -
                windowHalfX;

            mouseY =
                event.clientY -
                windowHalfY;

            // ---------------------------------------------------------------------
            // Coordinates
            // ---------------------------------------------------------------------

            const x =
                (
                    event.clientX /
                    window.innerWidth
                ).toFixed(2);

            const y =
                (
                    event.clientY /
                    window.innerHeight
                ).toFixed(2);

            if (coordsRef.current) {
                coordsRef.current.innerText =
                    `${x}.${y}.00`;
            }

            // ---------------------------------------------------------------------
            // Glitch Effect
            // ---------------------------------------------------------------------

            const now = Date.now();

            const delta =
                now - lastTime;

            if (delta > 40) {
                const dx =
                    event.clientX - lastX;

                const dy =
                    event.clientY - lastY;

                const mouseSpeed =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    ) / delta;

                if (mouseSpeed > 2) {
                    glitchTargets?.forEach(
                        (element) => {
                            if (
                                element.dataset
                                    .animating
                            ) {
                                return;
                            }

                            element.dataset
                                .animating = "true";

                            gsap.to(
                                element,
                                {
                                    x: () =>
                                        (
                                            Math.random() -
                                            0.5
                                        ) * 4,

                                    y: () =>
                                        (
                                            Math.random() -
                                            0.5
                                        ) * 2,

                                    textShadow:
                                        "2px 0 rgba(255,255,255,0.4), -2px 0 rgba(100,100,100,0.4)",

                                    duration: 0.05,

                                    yoyo: true,

                                    repeat: 3,

                                    onComplete: () => {
                                        gsap.set(
                                            element,
                                            {
                                                x: 0,
                                                y: 0,
                                                textShadow:
                                                    "none",
                                            }
                                        );

                                        setTimeout(
                                            () => {
                                                element.dataset
                                                    .animating = "";
                                            },
                                            200
                                        );
                                    },
                                }
                            );
                        }
                    );
                }

                lastX =
                    event.clientX;

                lastY =
                    event.clientY;

                lastTime = now;
            }
        }

        window.addEventListener(
            "mousemove",
            handleMouseMove
        );

        // -------------------------------------------------------------------------
        // Animation
        // -------------------------------------------------------------------------

        const clock =
            new THREE.Clock();

        let animationId;

        function animate() {
            const elapsedTime =
                clock.getElapsedTime();

            targetX =
                mouseX * 0.001;

            targetY =
                mouseY * 0.0008;

            // ---------------------------------------------------------------------
            // Group Rotation
            // ---------------------------------------------------------------------

            mainGroup.rotation.y +=
                0.002 * safeSpeed;

            mainGroup.rotation.y +=
                0.03 *
                (
                    targetX -
                    mainGroup.rotation.y
                );

            mainGroup.rotation.x +=
                0.03 *
                (
                    targetY -
                    mainGroup.rotation.x
                );

            // ---------------------------------------------------------------------
            // Vortex Animation
            // ---------------------------------------------------------------------

            const positionArray =
                vortexGeometry
                    .attributes
                    .position
                    .array;

            for (
                let i = 0;
                i < vortexCount;
                i++
            ) {
                const i3 = i * 3;

                const spin =
                    elapsedTime *
                    vortexSpeed[i] *
                    0.5 *
                    safeSpeed +
                    vortexHeight[i] * 0.5;

                const angle =
                    vortexAngle[i] +
                    spin;

                const pulse =
                    Math.sin(
                        elapsedTime *
                        1.2 *
                        safeSpeed +
                        i * 0.01
                    ) * 0.05;

                const radius =
                    vortexRadius[i] +
                    pulse;

                positionArray[i3] =
                    Math.cos(angle) *
                    radius;

                positionArray[i3 + 1] =
                    vortexHeight[i] +
                    Math.sin(
                        elapsedTime *
                        safeSpeed +
                        i * 0.02
                    ) * 0.03;

                positionArray[i3 + 2] =
                    Math.sin(angle) *
                    radius;
            }

            vortexGeometry
                .attributes
                .position
                .needsUpdate = true;

            // ---------------------------------------------------------------------
            // Spiral Animation
            // ---------------------------------------------------------------------

            spiralLineA.rotation.y =
                elapsedTime *
                0.15 *
                safeSpeed;

            spiralLineB.rotation.y =
                -elapsedTime *
                0.12 *
                safeSpeed;

            // ---------------------------------------------------------------------
            // Ambient Particles
            // ---------------------------------------------------------------------

            particlesMesh.rotation.y =
                elapsedTime *
                0.03 *
                safeSpeed;

            particlesMesh.rotation.x =
                -mouseY * 0.0001;

            // ---------------------------------------------------------------------
            // Render
            // ---------------------------------------------------------------------

            composer.render();

            animationId =
                requestAnimationFrame(
                    animate
                );
        }

        animate();

        // -------------------------------------------------------------------------
        // Resize
        // -------------------------------------------------------------------------

        function handleResize() {
            camera.aspect =
                window.innerWidth /
                window.innerHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

            composer.setSize(
                window.innerWidth,
                window.innerHeight
            );

            windowHalfX =
                window.innerWidth / 2;

            windowHalfY =
                window.innerHeight / 2;
        }

        window.addEventListener(
            "resize",
            handleResize
        );

        // -------------------------------------------------------------------------
        // Initial Animation
        // -------------------------------------------------------------------------

        const navItems =
            containerRef.current?.querySelectorAll(
                ".nav-item"
            );

        const maskWords =
            containerRef.current?.querySelectorAll(
                ".mask-word"
            );

        const timeline =
            gsap.timeline();

        timeline.from(
            mainGroup.scale,
            {
                x: 0.6,
                y: 0.6,
                z: 0.6,
                duration: 2,
                ease: "power3.out",
            }
        );

        if (navItems) {
            timeline.to(
                navItems,
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power2.out",
                },
                "-=1.5"
            );
        }

        // -------------------------------------------------------------------------
        // ScrollTrigger
        // -------------------------------------------------------------------------

        if (maskWords) {
            gsap.to(
                maskWords,
                {
                    y: 0,
                    duration: 1.4,
                    stagger: 0.1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger:
                            containerRef.current,
                        start: "top 80%",
                        scroller: window,
                    },
                }
            );
        }

        // -------------------------------------------------------------------------
        // Cleanup
        // -------------------------------------------------------------------------

        return () => {
            cancelAnimationFrame(
                animationId
            );

            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            window.removeEventListener(
                "resize",
                handleResize
            );

            timeline.kill();

            ScrollTrigger.getAll().forEach(
                (trigger) => {
                    trigger.kill();
                }
            );

            gsap.killTweensOf(
                containerRef.current
            );

            vortexGeometry.dispose();
            vortexMaterial.dispose();

            spiralLineA.geometry.dispose();
            spiralLineA.material.dispose();

            spiralLineB.geometry.dispose();
            spiralLineB.material.dispose();

            particlesGeometry.dispose();
            particlesMaterial.dispose();

            renderer.dispose();
            composer.dispose();

            scene.clear();
        };
    }, [
        speed,
        size,
        density,
        opacity,
    ]);

    // -------------------------------------------------------------------------
    // CSS Filter
    // -------------------------------------------------------------------------

    const safeHue =
        clamp(hue, -180, 180);

    const safeSaturation =
        clamp(
            saturation,
            0,
            2
        );

    const safeBrightness =
        clamp(
            brightness,
            0.35,
            1.65
        );

    const filter =
        safeHue === 0 &&
        safeSaturation === 1 &&
        safeBrightness === 1
            ? undefined
            : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 overflow-hidden bg-[#050505] text-white ${className}`}
            style={{ filter }}
        >
            {/* Three.js Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-0 h-full w-full outline-none"
            />

            {/* Border Frame */}
            <div className="pointer-events-none fixed inset-x-6 inset-y-6 z-10 flex flex-col justify-between border-x border-white/10 md:inset-x-12 md:inset-y-12">

                {/* Top Left */}
                <div className="absolute -left-0.75 top-0 h-1.5 w-1.5 -translate-y-1/2 rounded-none border border-neutral-500 bg-neutral-900" />

                {/* Top Right */}
                <div className="absolute -right-0.75 top-0 h-1.5 w-1.5 -translate-y-1/2 rounded-none border border-neutral-500 bg-neutral-900" />

                {/* Bottom Left */}
                <div className="absolute bottom-0 -left-0.75 h-1.5 w-1.5 translate-y-1/2 rounded-none border border-neutral-500 bg-neutral-900" />

                {/* Bottom Right */}
                <div className="absolute bottom-0 -right-0.75 h-1.5 w-1.5 translate-y-1/2 rounded-none border border-neutral-500 bg-neutral-900" />
            </div>

            {/* Content */}
            <div className="pointer-events-none relative z-20 flex min-h-[160vh] flex-col">

                {/* Footer */}
                <footer className="nav-item pointer-events-auto fixed bottom-6 left-6 right-6 z-30 grid translate-y-5 grid-cols-3 items-end px-6 py-6 opacity-0 md:bottom-12 md:left-12 md:right-12">

                    {/* Telemetry */}
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-light uppercase tracking-widest text-neutral-600">
                            Telemetry
                        </span>

                        <span
                            ref={coordsRef}
                            className="font-mono text-xs font-extralight text-neutral-300"
                        >
                            0.00.0.00.00
                        </span>
                    </div>

                    {/* Scroll */}
                    <div className="hidden flex-col items-center gap-2 sm:flex">
                        <span className="text-[10px] font-light uppercase tracking-[0.2em] text-neutral-600">
                            Scroll to traverse
                        </span>

                        <div className="h-8 w-px bg-linear-to-b from-neutral-600 to-transparent" />
                    </div>
                </footer>
            </div>
        </div>
    );
}