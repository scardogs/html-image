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
  HStack,
  Input,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";

export default function HTMLInputSection({
  htmlContent,
  setHtmlContent,
  handleConvertToPng,
  handleDownloadPng,
  isConverting,
  error,
}) {
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);

  const handleConvertWithSize = () => {
    const customSize = useCustomSize
      ? { width: customWidth, height: customHeight }
      : null;
    handleConvertToPng(customSize);
  };
  return (
    <Card
      flex="1"
      minH="600px"
      bg="var(--surface)"
      border="1px solid"
      borderColor="var(--border)"
      borderRadius="12px"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.05)"
      _hover={{
        borderColor: "var(--accent)",
        boxShadow: "0 4px 12px rgba(0, 102, 255, 0.08)",
      }}
      transition="all 0.2s ease"
    >
      <CardHeader pb={4}>
        <Text
          fontSize="sm"
          color="var(--text-primary)"
          fontWeight="500"
          letterSpacing="0.01em"
          mb={2}
        >
          HTML Input
        </Text>
        <Divider borderColor="var(--border-light)" />
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
            fontFamily="'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace"
            fontSize="sm"
            bg="var(--background)"
            border="1px solid"
            borderColor="var(--border)"
            borderRadius="8px"
            color="var(--text-primary)"
            _placeholder={{ color: "var(--text-muted)" }}
            _focus={{
              borderColor: "var(--accent)",
              boxShadow: "0 0 0 3px rgba(255, 20, 147, 0.1)",
              outline: "none",
            }}
            resize="vertical"
          />

          {/* Size Controls */}
          <Box>
            <FormControl display="flex" alignItems="center" mb={3}>
              <FormLabel
                htmlFor="custom-size"
                mb="0"
                fontSize="sm"
                color="var(--text-secondary)"
              >
                Custom Size
              </FormLabel>
              <Switch
                id="custom-size"
                isChecked={useCustomSize}
                onChange={(e) => setUseCustomSize(e.target.checked)}
                colorScheme="pink"
              />
            </FormControl>

            {useCustomSize && (
              <HStack spacing={3} mb={4}>
                <Box flex="1">
                  <Text fontSize="xs" color="var(--text-muted)" mb={1}>
                    Width (px)
                  </Text>
                  <Input
                    value={customWidth}
                    onChange={(e) =>
                      setCustomWidth(parseInt(e.target.value) || 1080)
                    }
                    size="sm"
                    borderRadius="6px"
                    borderColor="var(--border)"
                    _focus={{
                      borderColor: "var(--accent)",
                      boxShadow: "0 0 0 1px rgba(255, 20, 147, 0.1)",
                    }}
                    min={400}
                    max={2048}
                    type="number"
                  />
                </Box>
                <Box flex="1">
                  <Text fontSize="xs" color="var(--text-muted)" mb={1}>
                    Height (px)
                  </Text>
                  <Input
                    value={customHeight}
                    onChange={(e) =>
                      setCustomHeight(parseInt(e.target.value) || 1080)
                    }
                    size="sm"
                    borderRadius="6px"
                    borderColor="var(--border)"
                    _focus={{
                      borderColor: "var(--accent)",
                      boxShadow: "0 0 0 1px rgba(255, 20, 147, 0.1)",
                    }}
                    min={400}
                    max={2048}
                    type="number"
                  />
                </Box>
              </HStack>
            )}
          </Box>

          <VStack spacing={3}>
            <Button
              bg="var(--accent)"
              color="white"
              onClick={handleConvertWithSize}
              isLoading={isConverting}
              loadingText="Converting..."
              w="100%"
              h="48px"
              borderRadius="8px"
              fontWeight="500"
              fontSize="sm"
              _hover={{
                bg: "var(--accent-hover)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(255, 20, 147, 0.3)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              transition="all 0.2s ease"
            >
              Convert to PNG
            </Button>

            <Button
              bg="transparent"
              color="var(--accent)"
              onClick={handleDownloadPng}
              isLoading={isConverting}
              loadingText="Downloading..."
              w="100%"
              h="48px"
              border="1px solid"
              borderColor="var(--accent)"
              borderRadius="8px"
              fontWeight="500"
              fontSize="sm"
              _hover={{
                bg: "var(--accent)",
                color: "white",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(255, 20, 147, 0.2)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              transition="all 0.2s ease"
            >
              Download PNG
            </Button>
          </VStack>

          {error && (
            <Alert
              status="error"
              bg="rgba(255, 51, 51, 0.05)"
              border="1px solid"
              borderColor="rgba(255, 51, 51, 0.2)"
              borderRadius="8px"
            >
              <AlertIcon color="var(--error)" />
              <Box>
                <AlertTitle color="var(--error)" fontSize="sm" fontWeight="500">
                  Conversion Error
                </AlertTitle>
                <AlertDescription color="var(--text-secondary)" fontSize="sm">
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
