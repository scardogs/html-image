import { Box, Heading, Text, Divider } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box textAlign="center" py={8}>
      <Heading
        size="xl"
        color="var(--text-primary)"
        fontWeight="300"
        mb={4}
        letterSpacing="-0.02em"
        className="clean-text"
      >
        HTML to PNG Converter
      </Heading>
      <Heading
        size="xl"
        color="var(--text-primary)"
        fontWeight="300"
        mb={4}
        letterSpacing="-0.02em"
        className="clean-text"
      >
        VIP - SCALE
      </Heading>

      <Divider
        borderColor="var(--border)"
        w="60px"
        mx="auto"
        mb={6}
        borderWidth="1px"
      />

      <Text
        fontSize="md"
        color="var(--text-secondary)"
        fontWeight="300"
        letterSpacing="0.01em"
        maxW="600px"
        mx="auto"
        lineHeight="1.6"
      >
        Transform your HTML content into high-quality PNG images with precision
        and ease
      </Text>
    </Box>
  );
}
