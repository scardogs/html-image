import { Box, Heading, Text } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box textAlign="center" py={6}>
      <Heading
        size="2xl"
        color="#00ffff"
        fontWeight="200"
        mb={2}
        letterSpacing="widest"
        textTransform="uppercase"
        textShadow="0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)"
        animation="neon-pulse 3s ease-in-out infinite"
      >
        HTML → PNG
      </Heading>

      <Text
        fontSize="sm"
        color="rgba(255, 255, 255, 0.5)"
        fontWeight="300"
        letterSpacing="wider"
        textTransform="uppercase"
      >
        VIP - SCALE
      </Text>
    </Box>
  );
}
