import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Divider,
  Badge,
  Image,
  Flex,
  useToast,
  Container,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";
import domtoimage from "dom-to-image";
import * as htmlToImage from "html-to-image";

export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImageUrl, setConvertedImageUrl] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();
  const previewRef = useRef(null);
  const iframeRef = useRef(null);

  // Update preview content when HTML changes
  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      // Create a complete HTML document with proper head section
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://cdnjs.cloudflare.com">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" crossorigin="anonymous">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" crossorigin="anonymous">
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" crossorigin="anonymous">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            
            /* Ensure Font Awesome icons are properly loaded */
            .fa, .fas, .far, .fab, .fal, .fad {
              font-family: "Font Awesome 6 Free", "Font Awesome 5 Free", "Font Awesome 6 Pro", "Font Awesome 5 Pro" !important;
              font-weight: 900 !important;
              font-style: normal !important;
              font-variant: normal !important;
              text-rendering: auto !important;
              line-height: 1 !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }
            
            .far {
              font-weight: 400 !important;
            }
            
            .fab {
              font-family: "Font Awesome 6 Brands", "Font Awesome 5 Brands" !important;
              font-weight: 400 !important;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      iframeDoc.open();
      iframeDoc.write(fullHtml);
      iframeDoc.close();
    }
  }, [htmlContent]);

  // Fullscreen modal states
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();

  const handleConvertToPng = async () => {
    setIsConverting(true);
    setError("");
    setConvertedImageUrl("");

    try {
      if (!htmlContent) {
        throw new Error("Please enter HTML content first");
      }

      // Use Puppeteer API for perfect rendering (including Font Awesome)
      const response = await fetch("/api/convert-to-png", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          options: {
            scale: 2,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Conversion failed"
        );
      }

      const data = await response.json();
      setConvertedImageUrl(data.dataUrl);

      toast({
        title: "Success!",
        description: "HTML converted to PNG successfully with Puppeteer!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to capture preview. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertToPngClient = async () => {
    setIsConverting(true);
    setError("");
    setConvertedImageUrl("");

    try {
      if (!htmlContent) {
        throw new Error("Please enter HTML content first");
      }

      // Try using the iframe content first (this should work better)
      if (previewRef.current && iframeRef.current) {
        try {
          // Get the iframe content
          const iframe = iframeRef.current;
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow.document;

          if (iframeDoc && iframeDoc.body) {
            // Wait for fonts to load properly
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Force font loading
            if (iframeDoc.fonts && iframeDoc.fonts.ready) {
              await iframeDoc.fonts.ready;
            }

            // Wait for all images to load
            const images = iframeDoc.querySelectorAll("img");
            await Promise.all(
              Array.from(images).map((img) => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                });
              })
            );

            // Force reflow
            iframeDoc.body.offsetHeight;

            // Try multiple conversion methods for better icon support
            let dataUrl;

            try {
              // Method 1: Try with font embedding
              dataUrl = await htmlToImage.toPng(iframeDoc.body, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: null,
                width: iframeDoc.body.scrollWidth || 400,
                height: iframeDoc.body.scrollHeight || 300,
                style: {
                  transform: "scale(1)",
                  transformOrigin: "top left",
                },
                filter: (node) => {
                  return node.tagName !== "SCRIPT";
                },
                useCORS: true,
                allowTaint: true,
                fontEmbedCSS: true,
                includeQueryParams: true,
              });
            } catch (firstError) {
              console.log(
                "First conversion method failed, trying alternative:",
                firstError
              );

              // Method 2: Try without font embedding but with longer wait
              await new Promise((resolve) => setTimeout(resolve, 1000));
              dataUrl = await htmlToImage.toPng(iframeDoc.body, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: null,
                width: iframeDoc.body.scrollWidth || 400,
                height: iframeDoc.body.scrollHeight || 300,
                useCORS: true,
                allowTaint: true,
              });
            }

            setConvertedImageUrl(dataUrl);

            toast({
              title: "Success!",
              description:
                "HTML converted to PNG successfully with html-to-image!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
        } catch (iframeError) {
          console.log(
            "Iframe conversion failed, trying temporary element:",
            iframeError
          );
        }
      }

      // Fallback: Create a temporary element to render the HTML
      const tempDiv = document.createElement("div");

      // Set up the element for proper rendering - make it visible but off-screen
      tempDiv.style.position = "fixed";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      tempDiv.style.width = "auto";
      tempDiv.style.height = "auto";
      tempDiv.style.backgroundColor = "transparent"; // Don't override background
      tempDiv.style.visibility = "visible"; // Make it visible for rendering
      tempDiv.style.opacity = "1";
      tempDiv.style.pointerEvents = "none";
      tempDiv.style.zIndex = "9999";
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.border = "none"; // Remove border to avoid interference

      // Set HTML content
      tempDiv.innerHTML = htmlContent;

      // Add to body temporarily
      document.body.appendChild(tempDiv);

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Force multiple reflows to ensure rendering
      tempDiv.offsetHeight;
      tempDiv.scrollWidth;
      tempDiv.scrollHeight;

      // Debug: Log dimensions
      console.log("Element dimensions:", {
        scrollWidth: tempDiv.scrollWidth,
        scrollHeight: tempDiv.scrollHeight,
        offsetWidth: tempDiv.offsetWidth,
        offsetHeight: tempDiv.offsetHeight,
        clientWidth: tempDiv.clientWidth,
        clientHeight: tempDiv.clientHeight,
      });

      // Calculate dimensions
      const width = Math.max(tempDiv.scrollWidth, tempDiv.offsetWidth, 400);
      const height = Math.max(tempDiv.scrollHeight, tempDiv.offsetHeight, 300);

      console.log("Final dimensions:", { width, height });

      // Use html-to-image for client-side conversion with better options
      const dataUrl = await htmlToImage.toPng(tempDiv, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: null, // Don't override background
        width: width,
        height: height,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
        filter: (node) => {
          // Include all elements except script tags
          return node.tagName !== "SCRIPT";
        },
        useCORS: true,
        allowTaint: true,
      });

      // Clean up
      document.body.removeChild(tempDiv);

      setConvertedImageUrl(dataUrl);

      toast({
        title: "Success!",
        description: "HTML converted to PNG successfully with html-to-image!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Client conversion error:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to capture preview with client-side conversion.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadPng = async () => {
    setIsConverting(true);
    setError("");

    try {
      if (!htmlContent) {
        throw new Error("Please enter HTML content first");
      }

      // Use Puppeteer API for perfect rendering (including Font Awesome)
      const response = await fetch("/api/convert-to-png", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          options: {
            scale: 2,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Conversion failed"
        );
      }

      const data = await response.json();
      const dataUrl = data.dataUrl;

      // Create download link from data URL
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "converted-html.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started!",
        description: "Your PNG file is being downloaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to download PNG file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <Head>
        <title>- HTML to PNG Converter</title>
        <meta
          name="description"
          content="Convert HTML content to PNG images with futuristic neon design"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Icon Fonts */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          crossOrigin="anonymous"
        />
      </Head>

      <style jsx global>{`
        /* CSS isolation not needed with iframe */

        @keyframes neon-pulse {
          0%,
          100% {
            opacity: 1;
            filter: brightness(1);
          }
          50% {
            opacity: 0.8;
            filter: brightness(1.2);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.8),
              0 0 60px rgba(255, 0, 255, 0.5);
          }
        }
      `}</style>

      <Box
        minH="100vh"
        bg="#0a0a0a"
        py={8}
        position="relative"
        overflow="hidden"
      >
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

        <Container maxW="1400px" px={4} position="relative" zIndex={1}>
          <VStack spacing={12} align="stretch">
            {/* Header */}
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

            {/* Main Content */}
            <HStack spacing={8} align="start">
              {/* Input Section */}
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
                      <HStack spacing={4} w="100%">
                        <Button
                          bg="transparent"
                          color="#00ffff"
                          onClick={handleConvertToPng}
                          isLoading={isConverting}
                          loadingText="Processing..."
                          flex="1"
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
                          Server Convert
                        </Button>
                        <Button
                          bg="transparent"
                          color="#ff00ff"
                          onClick={handleConvertToPngClient}
                          isLoading={isConverting}
                          loadingText="Processing..."
                          flex="1"
                          h="45px"
                          border="1px solid"
                          borderColor="rgba(255, 0, 255, 0.5)"
                          borderRadius="0"
                          fontWeight="300"
                          fontSize="sm"
                          letterSpacing="wider"
                          textTransform="uppercase"
                          boxShadow="0 0 15px rgba(255, 0, 255, 0.2)"
                          _hover={{
                            bg: "rgba(255, 0, 255, 0.1)",
                            boxShadow: "0 0 25px rgba(255, 0, 255, 0.4)",
                          }}
                          _active={{
                            bg: "rgba(255, 0, 255, 0.2)",
                          }}
                          transition="all 0.3s ease"
                        >
                          Client Convert
                        </Button>
                      </HStack>
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

              {/* Output Section */}
              <Card
                flex="1"
                minH="600px"
                bg="rgba(10, 10, 10, 0.8)"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="rgba(255, 0, 255, 0.2)"
                borderRadius="2px"
                boxShadow="0 0 20px rgba(255, 0, 255, 0.1)"
                _hover={{
                  borderColor: "rgba(255, 0, 255, 0.4)",
                  boxShadow: "0 0 30px rgba(255, 0, 255, 0.2)",
                }}
                transition="all 0.3s ease"
              >
                <CardHeader pb={2}>
                  <Text
                    fontSize="xs"
                    color="#ff00ff"
                    fontWeight="300"
                    letterSpacing="widest"
                    textTransform="uppercase"
                    mb={1}
                  >
                    Output
                  </Text>
                  <Divider borderColor="rgba(255, 0, 255, 0.2)" />
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    {/* HTML Preview */}
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text
                          fontSize="xs"
                          color="rgba(255, 255, 255, 0.6)"
                          letterSpacing="wider"
                          textTransform="uppercase"
                        >
                          Preview
                        </Text>
                        {/* <Button
                          size="xs"
                          bg="transparent"
                          color="rgba(0, 255, 255, 0.7)"
                          onClick={onPreviewOpen}
                          border="1px solid"
                          borderColor="rgba(0, 255, 255, 0.3)"
                          borderRadius="0"
                          fontSize="xs"
                          px={3}
                          _hover={{
                            bg: "rgba(0, 255, 255, 0.1)",
                            borderColor: "rgba(0, 255, 255, 0.5)",
                          }}
                        >
                          Expand
                        </Button> */}
                      </HStack>
                      <Box
                        ref={previewRef}
                        border="1px solid"
                        borderColor="rgba(0, 255, 255, 0.2)"
                        borderRadius="0"
                        bg="rgba(255, 255, 255, 0.98)"
                        overflow="hidden"
                        boxShadow="0 0 15px rgba(0, 255, 255, 0.1)"
                        width="400px"
                        height="400px"
                        margin="0 auto"
                        position="relative"
                      >
                        <Box
                          as="iframe"
                          ref={iframeRef}
                          width="1080px"
                          height="1080px"
                          border="none"
                          transform="scale(0.37)"
                          transformOrigin="top left"
                          position="absolute"
                          top="0"
                          left="0"
                          bg="white"
                        />
                      </Box>
                    </Box>

                    <Divider borderColor="rgba(255, 0, 255, 0.1)" />

                    {/* PNG Output */}
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text
                          fontSize="xs"
                          color="rgba(255, 255, 255, 0.6)"
                          letterSpacing="wider"
                          textTransform="uppercase"
                        >
                          Result
                        </Text>
                        {convertedImageUrl && (
                          <Button
                            size="xs"
                            bg="transparent"
                            color="rgba(255, 0, 255, 0.7)"
                            onClick={onImageOpen}
                            border="1px solid"
                            borderColor="rgba(255, 0, 255, 0.3)"
                            borderRadius="0"
                            fontSize="xs"
                            px={3}
                            _hover={{
                              bg: "rgba(255, 0, 255, 0.1)",
                              borderColor: "rgba(255, 0, 255, 0.5)",
                            }}
                          >
                            Expand
                          </Button>
                        )}
                      </HStack>
                      {convertedImageUrl ? (
                        <Box textAlign="center">
                          <Box
                            border="1px solid"
                            borderColor="rgba(255, 0, 255, 0.2)"
                            borderRadius="0"
                            bg="rgba(0, 0, 0, 0.5)"
                            boxShadow="0 0 15px rgba(255, 0, 255, 0.1)"
                            overflow="hidden"
                            width="400px"
                            height="400px"
                            position="relative"
                            margin="0 auto"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Image
                              src={convertedImageUrl}
                              alt="Captured Preview"
                              borderRadius="0"
                              cursor="pointer"
                              onClick={onImageOpen}
                              _hover={{ opacity: 0.9 }}
                              transition="opacity 0.2s ease"
                              width="100%"
                              height="100%"
                              objectFit="contain"
                            />
                          </Box>
                          <Text
                            mt={3}
                            color="rgba(0, 255, 0, 0.7)"
                            fontSize="xs"
                            letterSpacing="wider"
                            textTransform="uppercase"
                          >
                            ✓ Ready
                          </Text>
                        </Box>
                      ) : (
                        <Box
                          border="1px dashed"
                          borderColor="rgba(255, 255, 255, 0.1)"
                          borderRadius="0"
                          p={20}
                          textAlign="center"
                          bg="rgba(0, 0, 0, 0.3)"
                          width="400px"
                          height="400px"
                          margin="0 auto"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Box>
                            <Text
                              color="rgba(255, 255, 255, 0.3)"
                              fontSize="xs"
                              letterSpacing="wider"
                            >
                              AWAITING CONVERSION
                            </Text>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </HStack>

            {/* Features Section */}
            <Card
              bg="rgba(0, 0, 0, 0.4)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="rgba(58, 134, 255, 0.3)"
              borderRadius="20px"
              boxShadow="0 0 40px rgba(58, 134, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            >
              <CardHeader>
                <Heading
                  size="lg"
                  bg="linear-gradient(45deg, #3a86ff, #00ff88)"
                  bgClip="text"
                  textShadow="0 0 20px rgba(58, 134, 255, 0.5)"
                  textAlign="center"
                >
                  🚀 NEON FEATURES 🚀
                </Heading>
              </CardHeader>
              <CardBody>
                <Flex wrap="wrap" gap={6} justify="center">
                  <Badge
                    bg="linear-gradient(45deg, #ff006e, #8338ec)"
                    color="white"
                    p={3}
                    borderRadius="20px"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="0 0 20px rgba(255, 0, 110, 0.4)"
                    _hover={{ boxShadow: "0 0 30px rgba(255, 0, 110, 0.6)" }}
                    transition="all 0.3s ease"
                  >
                    ⚡ Dual Mode
                  </Badge>
                  <Badge
                    bg="linear-gradient(45deg, #8338ec, #3a86ff)"
                    color="white"
                    p={3}
                    borderRadius="20px"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="0 0 20px rgba(131, 56, 236, 0.4)"
                    _hover={{ boxShadow: "0 0 30px rgba(131, 56, 236, 0.6)" }}
                    transition="all 0.3s ease"
                  >
                    🎨 Real-time Preview
                  </Badge>
                  <Badge
                    bg="linear-gradient(45deg, #3a86ff, #00ff88)"
                    color="white"
                    p={3}
                    borderRadius="20px"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="0 0 20px rgba(58, 134, 255, 0.4)"
                    _hover={{ boxShadow: "0 0 30px rgba(58, 134, 255, 0.6)" }}
                    transition="all 0.3s ease"
                  >
                    🚀 Server-side Puppeteer
                  </Badge>
                  <Badge
                    bg="linear-gradient(45deg, #ff6b6b, #ff8e8e)"
                    color="white"
                    p={3}
                    borderRadius="20px"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="0 0 20px rgba(255, 107, 107, 0.4)"
                    _hover={{ boxShadow: "0 0 30px rgba(255, 107, 107, 0.6)" }}
                    transition="all 0.3s ease"
                  >
                    🌐 Client-side html-to-image
                  </Badge>
                  <Badge
                    bg="linear-gradient(45deg, #00ff88, #00d4aa)"
                    color="black"
                    p={3}
                    borderRadius="20px"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="0 0 20px rgba(0, 255, 136, 0.4)"
                    _hover={{ boxShadow: "0 0 30px rgba(0, 255, 136, 0.6)" }}
                    transition="all 0.3s ease"
                  >
                    💾 Instant Download
                  </Badge>
                  <Badge
                    bg="linear-gradient(45deg, #ff6b6b, #ff8e8e)"
                    color="white"
                    p={3}
                    borderRadius="20px"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="0 0 20px rgba(255, 107, 107, 0.4)"
                    _hover={{ boxShadow: "0 0 30px rgba(255, 107, 107, 0.6)" }}
                    transition="all 0.3s ease"
                  >
                    🔄 High Quality
                  </Badge>
                  <Badge
                    bg="linear-gradient(45deg, #ff9a56, #ffad56)"
                    color="white"
                    p={3}
                    borderRadius="20px"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="0 0 20px rgba(255, 154, 86, 0.4)"
                    _hover={{ boxShadow: "0 0 30px rgba(255, 154, 86, 0.6)" }}
                    transition="all 0.3s ease"
                  >
                    📱 Responsive Design
                  </Badge>
                </Flex>
              </CardBody>
            </Card>
          </VStack>
        </Container>

        {/* Fullscreen HTML Preview Modal */}
        <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="full">
          <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
          <ModalContent bg="rgba(0, 0, 0, 0.95)" backdropFilter="blur(20px)">
            <ModalHeader>
              <Heading
                size="lg"
                bg="linear-gradient(45deg, #ff006e, #8338ec)"
                bgClip="text"
                textShadow="0 0 20px rgba(255, 0, 110, 0.5)"
              >
                🔍 Fullscreen HTML Preview
              </Heading>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody pb={6}>
              <Box
                border="2px solid"
                borderColor="rgba(255, 0, 110, 0.5)"
                borderRadius="15px"
                p={8}
                bg="rgba(255, 255, 255, 0.95)"
                minH="70vh"
                overflow="visible"
                backdropFilter="blur(10px)"
                boxShadow="inset 0 0 20px rgba(255, 0, 110, 0.1)"
                css={{
                  // Create a fixed-size preview window
                  overflow: "hidden",
                  width: "400px",
                  height: "400px",
                  border: "2px solid #333",
                  borderRadius: "8px",
                  position: "relative",
                  margin: "0 auto",
                  // Scale down the content to fit in the preview window
                  "& .html-preview-content": {
                    transform: "scale(0.37)", // Scale down from 1080px to ~400px
                    transformOrigin: "top left",
                    width: "1080px",
                    height: "1080px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: `<div class="html-preview-content">${htmlContent}</div>`,
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Fullscreen PNG Image Modal */}
        <Modal isOpen={isImageOpen} onClose={onImageClose} size="full">
          <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
          <ModalContent bg="rgba(0, 0, 0, 0.95)" backdropFilter="blur(20px)">
            <ModalHeader>
              <Heading
                size="lg"
                bg="linear-gradient(45deg, #8338ec, #3a86ff)"
                bgClip="text"
                textShadow="0 0 20px rgba(131, 56, 236, 0.5)"
              >
                🔍 Fullscreen PNG View
              </Heading>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody pb={6} textAlign="center">
              <Box
                border="2px solid"
                borderColor="rgba(131, 56, 236, 0.5)"
                borderRadius="15px"
                p={4}
                bg="rgba(0, 0, 0, 0.3)"
                backdropFilter="blur(10px)"
                boxShadow="0 0 30px rgba(131, 56, 236, 0.3)"
                maxH="80vh"
                overflow="auto"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "12px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(131, 56, 236, 0.5)",
                    borderRadius: "6px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(131, 56, 236, 0.7)",
                  },
                }}
              >
                <Image
                  src={convertedImageUrl}
                  alt="Converted PNG - Fullscreen"
                  maxW="100%"
                  maxH="100%"
                  borderRadius="10px"
                />
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
