import { Box } from "@chakra-ui/react";

export default function BackgroundEffects() {
  return (
    <>
      {/* Minimalist grid background */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage="linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)"
        backgroundSize="50px 50px"
        opacity={0.5}
      />

      {/* Subtle neon glow orbs */}
      <Box
        position="absolute"
        top="20%"
        left="10%"
        w="300px"
        h="300px"
        bg="radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%)"
        filter="blur(60px)"
        animation="float 8s ease-in-out infinite"
      />

      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        w="400px"
        h="400px"
        bg="radial-gradient(circle, rgba(255, 0, 255, 0.1) 0%, transparent 70%)"
        filter="blur(80px)"
        animation="float 10s ease-in-out infinite reverse"
      />
    </>
  );
}
