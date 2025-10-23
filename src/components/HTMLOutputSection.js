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
  );
}
