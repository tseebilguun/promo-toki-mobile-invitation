import { Box, HStack, IconButton, Text } from "@chakra-ui/react"

import iconAlert from "../assets/toast/icon_alert.svg"
import iconCheck from "../assets/toast/icon_check.svg"

interface Toast {
    id: number
    type: "success" | "error"
    message: string
}

interface ToastContainerProps {
    toasts: Toast[]
    onClose: (id: number) => void
}

const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
    if (!toasts || toasts.length === 0) return null

    return (
        <Box
            position="fixed"
            left="16px"
            right="16px"
            top="calc(16px + env(safe-area-inset-top))"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="12px"
            zIndex={9999}
            pointerEvents="none"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </Box>
    )
}

interface ToastItemProps {
    toast: Toast
    onClose: (id: number) => void
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
    const isError = toast.type === "error"

    return (
        <Box
            pointerEvents="auto"
            minW="80%"
            maxW="90%"
            bg="#FFFFFF"
            borderRadius="16px"
            boxShadow="0 4px 12px rgba(0,0,0,0.2)"
            px="16px"
            py="12px"
        >
            <HStack gap="12px" align="center">
                {/* Left icon */}
                <Box
                    w="32px"
                    h="32px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                >
                    <Box
                        as="img"
                        src={isError ? iconAlert : iconCheck}
                        alt={isError ? "Alert" : "Success"}
                        w="24px"
                        h="24px"
                    />
                </Box>

                {/* Message */}
                <Text
                    flex="1"
                    color="#4B4F5C"
                    fontSize="14px"
                    fontWeight="400"
                    lineHeight="1.4"
                >
                    {toast.message}
                </Text>

                {/* Close button (X) */}
                <IconButton
                    aria-label="Close"
                    variant="ghost"
                    size="sm"
                    color="#4B4F5C"
                    fontSize="20px"
                    minW="auto"
                    h="auto"
                    p="0"
                    onClick={() => onClose(toast.id)}
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                >
                    ×
                </IconButton>
            </HStack>
        </Box>
    )
}

export default ToastContainer