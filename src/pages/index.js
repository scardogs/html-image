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

// Font Awesome SVG icons mapping
const createFontAwesomeSVG = (iconName, isBrand = false) => {
  const iconMap = {
    phone: `<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>`,
    envelope: `<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>`,
    "share-nodes": `<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M448 80c0-26.5-21.5-48-48-48H112C85.5 32 64 53.5 64 80v48h16V80c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v288c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16v-48H64v48c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V80zM64 160c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160zm0 96c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32v-32zm0 96c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32v-32z"/></svg>`,
    check: `<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`,
    star: `<svg viewBox="0 0 576 512" width="1em" height="1em" fill="currentColor"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`,
    "check-circle": `<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`,
    download: `<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H64zm32 160c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/></svg>`,
    globe: `<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38.8 28.8l163.2 38.7c3.8 .9 7.7 1.3 11.7 1.3c4.1 0 8.2-.4 12-1.3L520.6 193c17-3.5 30.5-14.2 38.8-28.8l9.4-16.4c8.6-15.1 8.6-33.7 0-48.8l-9.4-16.4c-8.3-14.5-21.9-25.2-38.8-28.8L334.6 1.2c-3.8-.9-7.7-1.3-11.7-1.3c-4.1 0-8.2 .4-12 1.3L148.9 33.6c-17 3.5-30.5 14.2-38.8 28.8l-9.4 16.4c-8.6 15.1-8.6 33.7 0 48.8zM256 224c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64zm-96 96c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32s-14.3-32-32-32H192c-17.7 0-32 14.3-32 32z"/></svg>`,
  };

  return iconMap[iconName] || null;
};

export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImageUrl, setConvertedImageUrl] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();
  const previewRef = useRef(null);
  const hiddenPreviewRef = useRef(null);

  // Update preview content when HTML changes
  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      // Check if the HTML content is a complete document
      const isCompleteDocument = htmlContent
        .trim()
        .toLowerCase()
        .startsWith("<!doctype html>");

      let fullHtml;
      if (isCompleteDocument) {
        // Use the HTML as-is since it's already a complete document
        fullHtml = htmlContent;
      } else {
        // Create a complete HTML document with proper head section
        fullHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://cdnjs.cloudflare.com">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" crossorigin="anonymous">
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
              .fa, .fas, .far, .fab, .fal, .fad, .fa-solid, .fa-regular, .fa-light, .fa-thin, .fa-duotone {
                font-family: "Font Awesome 7 Free", "Font Awesome 6 Free", "Font Awesome 5 Free", "Font Awesome 7 Pro", "Font Awesome 6 Pro", "Font Awesome 5 Pro" !important;
                font-weight: 900 !important;
                font-style: normal !important;
                font-variant: normal !important;
                text-rendering: auto !important;
                line-height: 1 !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
              }
              
              .far, .fa-regular {
                font-weight: 400 !important;
              }
              
              .fab, .fa-brands {
                font-family: "Font Awesome 7 Brands", "Font Awesome 6 Brands", "Font Awesome 5 Brands" !important;
                font-weight: 400 !important;
              }
              
              .fa-light, .fa-thin {
                font-weight: 300 !important;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
          </html>
        `;
      }

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

      // Try using the iframe content first (this should work better)
      if (previewRef.current && iframeRef.current) {
        try {
          // Get the iframe content
          const iframe = iframeRef.current;
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow.document;

          if (iframeDoc && iframeDoc.body) {
            // Wait for fonts to load properly
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Force font loading
            if (iframeDoc.fonts && iframeDoc.fonts.ready) {
              await iframeDoc.fonts.ready;
            }

            // Additional wait for Font Awesome 7 to load
            await new Promise((resolve) => setTimeout(resolve, 1000));

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
              // Method 1: Try with font embedding and longer wait
              await new Promise((resolve) => setTimeout(resolve, 2000));
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
                // Force font loading
                cacheBust: true,
                skipFonts: false,
              });
            } catch (firstError) {
              console.log(
                "First conversion method failed, trying alternative:",
                firstError
              );

              // Method 2: Try converting Font Awesome icons to SVG first
              try {
                // Convert Font Awesome icons to SVG
                const iconElements = iframeDoc.querySelectorAll(
                  ".fa, .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands"
                );
                console.log("Found icon elements:", iconElements.length);
                for (const icon of iconElements) {
                  const iconName = icon.className.match(/fa-([a-zA-Z0-9-]+)/);
                  console.log(
                    "Processing icon:",
                    icon.className,
                    "extracted name:",
                    iconName?.[1]
                  );
                  if (iconName) {
                    const svgIcon = createFontAwesomeSVG(
                      iconName[1],
                      icon.className.includes("fa-brands") ||
                        icon.className.includes("fab")
                    );
                    if (svgIcon) {
                      console.log("Replacing with SVG for:", iconName[1]);
                      icon.innerHTML = svgIcon;
                      icon.style.fontFamily = "inherit";
                      icon.style.display = "inline-block";
                    }
                  }
                }

                // Wait a bit for SVG rendering
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
              } catch (svgError) {
                console.log(
                  "SVG conversion failed, trying basic method:",
                  svgError
                );

                // Method 3: Basic conversion without font embedding
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
    if (!convertedImageUrl) {
      toast({
        title: "No Image",
        description: "Please convert HTML to PNG first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Create download link from the converted image URL
      const link = document.createElement("a");
      link.href = convertedImageUrl;
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
      console.error("Download error:", err);
      toast({
        title: "Error",
        description: "Failed to download PNG file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
          crossOrigin="anonymous"
        />
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
                    ⚡ Client-Side Only
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
                    🚀 html-to-image
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
