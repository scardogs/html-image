import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  Box,
  Image,
} from "@chakra-ui/react";

export default function PNGImageModal({ isOpen, onClose, convertedImageUrl }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
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
  );
}
