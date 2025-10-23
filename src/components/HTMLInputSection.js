import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Textarea,
  Button,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Divider,
} from "@chakra-ui/react";

export default function HTMLInputSection({
  htmlContent,
  setHtmlContent,
  handleConvertToPng,
  handleDownloadPng,
  isConverting,
  error,
}) {
  return (
    <Card
      flex="1"
      minH="600px"
      bg="rgba(10, 10, 10, 0.8)"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="rgba(0, 255, 255, 0.2)"
      borderRadius="2px"
      boxShadow="0 0 20px rgba(0, 255, 255, 0.1)"
      _hover={{
        borderColor: "rgba(0, 255, 255, 0.4)",
        boxShadow: "0 0 30px rgba(0, 255, 255, 0.2)",
      }}
      transition="all 0.3s ease"
    >
      <CardHeader pb={2}>
        <Text
          fontSize="xs"
          color="#00ffff"
          fontWeight="300"
          letterSpacing="widest"
          textTransform="uppercase"
          mb={1}
        >
          Input
        </Text>
        <Divider borderColor="rgba(0, 255, 255, 0.2)" />
      </CardHeader>

      <CardBody>
        <VStack spacing={6} align="stretch">
          <Textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            placeholder={`<div style="padding: 20px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; font-family: Arial; border-radius: 10px;">
  <h1><i class="fas fa-star"></i> Test HTML Content</h1>
  <p><i class="fas fa-check-circle"></i> This is a test to verify client-side conversion works!</p>
  <button style="background: #ff6b6b; color: white; border: none; padding: 10px 20px; border-radius: 5px;">
    <i class="fas fa-download"></i> Click Me
  </button>
  <div style="margin-top: 10px;">
    <i class="fas fa-phone"></i> Phone: +1234567890<br>
    <i class="fas fa-envelope"></i> Email: test@example.com<br>
    <i class="fas fa-globe"></i> Website: example.com
  </div>
</div>`}
            minH="400px"
            fontFamily="'Courier New', monospace"
            fontSize="sm"
            bg="rgba(0, 0, 0, 0.5)"
            border="1px solid"
            borderColor="rgba(0, 255, 255, 0.2)"
            borderRadius="0"
            color="#00ffff"
            _placeholder={{ color: "rgba(0, 255, 255, 0.3)" }}
            _focus={{
              borderColor: "rgba(0, 255, 255, 0.5)",
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.2)",
              outline: "none",
            }}
            resize="vertical"
          />

          <VStack spacing={3}>
            <Button
              bg="transparent"
              color="#00ffff"
              onClick={handleConvertToPng}
              isLoading={isConverting}
              loadingText="Processing..."
              w="100%"
              h="45px"
              border="1px solid"
              borderColor="rgba(0, 255, 255, 0.5)"
              borderRadius="0"
              fontWeight="300"
              fontSize="sm"
              letterSpacing="wider"
              textTransform="uppercase"
              boxShadow="0 0 15px rgba(0, 255, 255, 0.2)"
              _hover={{
                bg: "rgba(0, 255, 255, 0.1)",
                boxShadow: "0 0 25px rgba(0, 255, 255, 0.4)",
              }}
              _active={{
                bg: "rgba(0, 255, 255, 0.2)",
              }}
              transition="all 0.3s ease"
            >
              Convert to PNG
            </Button>

            <Button
              bg="transparent"
              color="#00ff88"
              onClick={handleDownloadPng}
              isLoading={isConverting}
              loadingText="Downloading..."
              w="100%"
              h="45px"
              border="1px solid"
              borderColor="rgba(0, 255, 136, 0.5)"
              borderRadius="0"
              fontWeight="300"
              fontSize="sm"
              letterSpacing="wider"
              textTransform="uppercase"
              boxShadow="0 0 15px rgba(0, 255, 136, 0.2)"
              _hover={{
                bg: "rgba(0, 255, 136, 0.1)",
                boxShadow: "0 0 25px rgba(0, 255, 136, 0.4)",
              }}
              _active={{
                bg: "rgba(0, 255, 136, 0.2)",
              }}
              transition="all 0.3s ease"
            >
              Download PNG
            </Button>
          </VStack>

          {error && (
            <Alert
              status="error"
              bg="rgba(0, 0, 0, 0.6)"
              border="1px solid"
              borderColor="rgba(255, 0, 0, 0.5)"
              borderRadius="0"
              backdropFilter="blur(10px)"
            >
              <AlertIcon color="#ff0000" />
              <Box>
                <AlertTitle
                  color="#ff0000"
                  fontSize="xs"
                  letterSpacing="wider"
                >
                  ERROR
                </AlertTitle>
                <AlertDescription
                  color="rgba(255, 0, 0, 0.7)"
                  fontSize="xs"
                >
                  {error}
                </AlertDescription>
              </Box>
            </Alert>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
