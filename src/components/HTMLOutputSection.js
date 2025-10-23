import {
  Card,
  CardBody,
  CardHeader,
  Text,
  VStack,
  HStack,
  Box,
  Button,
  Image,
  Divider,
} from "@chakra-ui/react";

export default function HTMLOutputSection({
  previewRef,
  iframeRef,
  convertedImageUrl,
  onImageOpen,
}) {
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
          Output Preview
        </Text>
        <Divider borderColor="var(--border-light)" />
      </CardHeader>

      <CardBody>
        <VStack spacing={8} align="stretch">
          {/* HTML Preview */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Text
                fontSize="sm"
                color="var(--text-secondary)"
                fontWeight="500"
                letterSpacing="0.01em"
              >
                Live Preview
              </Text>
            </HStack>

            <Box
              ref={previewRef}
              border="1px solid"
              borderColor="var(--border)"
              borderRadius="8px"
              bg="var(--background)"
              overflow="hidden"
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
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

          <Divider borderColor="var(--border-light)" />

          {/* PNG Output */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Text
                fontSize="sm"
                color="var(--text-secondary)"
                fontWeight="500"
                letterSpacing="0.01em"
              >
                Generated Image
              </Text>

              {convertedImageUrl && (
                <Button
                  size="sm"
                  bg="transparent"
                  color="var(--accent)"
                  onClick={onImageOpen}
                  border="1px solid"
                  borderColor="var(--accent)"
                  borderRadius="6px"
                  fontSize="sm"
                  px={4}
                  _hover={{
                    bg: "var(--accent)",
                    color: "white",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(255, 20, 147, 0.2)",
                  }}
                  transition="all 0.2s ease"
                >
                  Expand
                </Button>
              )}
            </HStack>

            {convertedImageUrl ? (
              <Box textAlign="center">
                <Box
                  border="1px solid"
                  borderColor="var(--border)"
                  borderRadius="8px"
                  bg="var(--background)"
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
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
                    alt="Generated PNG Image"
                    borderRadius="8px"
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
                  mt={4}
                  color="var(--success)"
                  fontSize="sm"
                  fontWeight="500"
                  letterSpacing="0.01em"
                >
                  ✓ Ready for download
                </Text>
              </Box>
            ) : (
              <Box
                border="1px dashed"
                borderColor="var(--border-light)"
                borderRadius="8px"
                p={20}
                textAlign="center"
                bg="var(--surface)"
                width="400px"
                height="400px"
                margin="0 auto"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box>
                  <Text
                    color="var(--text-muted)"
                    fontSize="sm"
                    fontWeight="400"
                    letterSpacing="0.01em"
                  >
                    Awaiting conversion...
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}
