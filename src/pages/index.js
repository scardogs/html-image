import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Container,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

// Import components
import BackgroundEffects from "../components/BackgroundEffects";
import Header from "../components/Header";
import HTMLInputSection from "../components/HTMLInputSection";
import HTMLOutputSection from "../components/HTMLOutputSection";
import HTMLPreviewModal from "../components/HTMLPreviewModal";
import PNGImageModal from "../components/PNGImageModal";

// Import utilities
import { convertHTMLToPNG, downloadPNG } from "../utils/htmlConversion";
import { createFontAwesomeSVG } from "../components/FontAwesomeIcons";

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

      // Check if the HTML content is a complete document
      const isCompleteDocument = htmlContent
        .trim()
        .toLowerCase()
        .startsWith("<!doctype html>");

      let fullHtml;
      if (isCompleteDocument) {
        // Use the HTML as-is since it's already a complete document
        fullHtml = htmlContent;

        // But also inject Font Awesome CSS if not already present
        if (
          !fullHtml.includes("font-awesome") &&
          !fullHtml.includes("fontawesome")
        ) {
          const fontAwesomeCSS = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" crossorigin="anonymous">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" crossorigin="anonymous">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" crossorigin="anonymous">
          `;

          // Insert Font Awesome CSS before closing </head>
          fullHtml = fullHtml.replace("</head>", `${fontAwesomeCSS}</head>`);
        }
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

      // Debug: Log iframe content
      console.log("Iframe HTML written:", fullHtml.substring(0, 500) + "...");

      // Wait for iframe to load and then convert Font Awesome icons to SVG
      setTimeout(() => {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        const fontAwesomeLinks = iframeDoc.querySelectorAll(
          'link[href*="font-awesome"]'
        );
        console.log("Font Awesome links in iframe:", fontAwesomeLinks.length);

        // Convert all Font Awesome icons to SVG immediately
        const iconElements = iframeDoc.querySelectorAll(
          ".fa, .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands"
        );
        console.log("Converting icons to SVG in preview:", iconElements.length);

        iconElements.forEach((icon) => {
          // Extract the actual icon name, not the style class
          const iconNameMatch =
            icon.className.match(
              /fa-(?:solid|regular|light|thin|duotone|brands)\s+fa-([a-zA-Z0-9-]+)/
            ) || icon.className.match(/fa-([a-zA-Z0-9-]+)(?:\s|$)/);
          const iconName = iconNameMatch?.[1];
          console.log(
            "Processing icon:",
            icon.className,
            "extracted name:",
            iconName
          );
          if (iconName) {
            const svgIcon = createFontAwesomeSVG(
              iconName,
              icon.className.includes("fa-brands") ||
                icon.className.includes("fab")
            );
            console.log(
              "SVG result for",
              iconName,
              ":",
              svgIcon ? "SUCCESS" : "FAILED"
            );
            if (svgIcon) {
              console.log("Preview: Converting icon to SVG:", iconName);
              // Clear any pseudo-element content by removing Font Awesome classes
              icon.className = icon.className.replace(/fa-[a-z-]+/g, "").trim();
              icon.innerHTML = svgIcon;
              icon.style.fontFamily = "inherit";
              icon.style.display = "inline-block";
              icon.style.fontSize = "inherit";
              icon.style.width = "1em";
              icon.style.height = "1em";
              console.log("Icon after conversion:", icon.innerHTML);
            } else {
              console.log("No SVG found for icon:", iconName);
            }
          }
        });
      }, 2000);
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

      const dataUrl = await convertHTMLToPNG(
        htmlContent,
        previewRef,
        iframeRef
      );
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
      downloadPNG(convertedImageUrl);

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
        <title>HTML to PNG Converter</title>

        <meta
          name="description"
          content="Convert HTML content to PNG images with clean, modern design"
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
        /* Clean minimal animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes subtlePulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>

      <Box
        minH="100vh"
        bg="var(--background)"
        py={12}
        position="relative"
        overflow="hidden"
      >
        <BackgroundEffects />

        <Container maxW="1400px" px={6} position="relative" zIndex={1}>
          <VStack spacing={16} align="stretch">
            <Header />

            {/* Main Content */}
            <HStack spacing={8} align="start">
              <HTMLInputSection
                htmlContent={htmlContent}
                setHtmlContent={setHtmlContent}
                handleConvertToPng={handleConvertToPng}
                handleDownloadPng={handleDownloadPng}
                isConverting={isConverting}
                error={error}
              />

              <HTMLOutputSection
                previewRef={previewRef}
                iframeRef={iframeRef}
                convertedImageUrl={convertedImageUrl}
                onImageOpen={onImageOpen}
              />
            </HStack>
          </VStack>
        </Container>

        <HTMLPreviewModal
          isOpen={isPreviewOpen}
          onClose={onPreviewClose}
          htmlContent={htmlContent}
        />

        <PNGImageModal
          isOpen={isImageOpen}
          onClose={onImageClose}
          convertedImageUrl={convertedImageUrl}
        />
      </Box>
    </>
  );
}
