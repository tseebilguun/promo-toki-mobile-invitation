import { useMemo, useRef, useState } from "react"
import { Box, Button, Container, Drawer, HStack, Image, Input, Stack, Text } from "@chakra-ui/react"

import banner from "./assets/banner.webp"
import avatar from "./assets/avatar.svg"
import btnAdd from "./assets/btn_add.svg"

const inviteRows = Array.from({ length: 5 }, (_, i) => ({ id: i }))

const DRAG_CLOSE_DISTANCE = 60
const DRAG_CLOSE_VELOCITY = 0.5 // px/ms
const MAX_DRAG = 140

export default function App() {
    const [open, setOpen] = useState(false)
    const [phone, setPhone] = useState("")

    const isSendEnabled = useMemo(() => phone.trim().length > 0, [phone])

    const onAdd = () => setOpen(true)

    const onClose = () => {
        setOpen(false)
        setPhone("")
    }

    const onSend = () => {
        alert(`Send invite to: ${phone}`)
    }

    // ---- drag refs ----
    const sheetRef = useRef<HTMLDivElement | null>(null)
    const startY = useRef(0)
    const currentY = useRef(0)
    const lastMove = useRef({ y: 0, time: 0 })

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId)

        startY.current = e.clientY
        currentY.current = 0
        lastMove.current = { y: e.clientY, time: performance.now() }

        if (sheetRef.current) {
            sheetRef.current.style.transition = "none"
        }
    }

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const rawDelta = e.clientY - startY.current
        if (rawDelta <= 0) return

        const delta = rawDelta > MAX_DRAG ? MAX_DRAG + (rawDelta - MAX_DRAG) * 0.3 : rawDelta

        currentY.current = delta
        lastMove.current = { y: e.clientY, time: performance.now() }

        if (sheetRef.current) {
            sheetRef.current.style.transform = `translateY(${delta}px)`
        }
    }

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        const now = performance.now()
        const dt = now - lastMove.current.time
        const dy = e.clientY - lastMove.current.y
        const velocity = dt > 0 ? dy / dt : 0

        const shouldClose = currentY.current > DRAG_CLOSE_DISTANCE || velocity > DRAG_CLOSE_VELOCITY

        if (sheetRef.current) {
            sheetRef.current.style.transition = "transform 180ms ease"
            sheetRef.current.style.transform = "translateY(0px)"
        }

        currentY.current = 0

        if (shouldClose) onClose()
    }
    // -------------------

    return (
        <>
            <Box
                minH="100dvh"
                bg="appBg"
                pt="env(safe-area-inset-top)"
                display="flex"
                flexDirection="column"
            >
                {/* main content spacing */}
                <Container px="18px" pt="96px" maxW="md">
                    {/* Top banner card */}
                    <Box bg="cardBg" borderRadius="banner" p="18px">
                        <Image
                            src={banner}
                            alt="Banner"
                            draggable={false}
                            w="100%"
                            borderRadius="bannerImage"
                            display="block"
                            pointerEvents="none"
                        />

                        <Box pt="14px">
                            <Text color="mutedText" fontWeight="400" fontSize="12px" mb="6px">
                                Найзаа уриад
                            </Text>

                            <Text color="white" fontWeight="500" fontSize="20px" lineHeight="1.15" mb="10px">
                                Датагаа 3 үржүүлээд ав
                            </Text>

                            <Text color="mutedText" fontWeight="400" fontSize="14px" lineHeight="1.4">
                                Toki Mobile-д найзуудaa уриад хүссэн датагаа авах бүрдээ датагаа 3 үржүүлээрэй.
                            </Text>
                        </Box>
                    </Box>
                </Container>

                {/* Bottom sheet */}
                <Box
                    mt="auto"
                    bg="#f5f5fa"
                    borderTopRadius="sheet"
                    px="18px"
                    pt="18px"
                    pb="calc(18px + env(safe-area-inset-bottom))"
                >
                    <Text color="appBg" fontWeight="500" fontSize="16px" mb="14px">
                        Миний урьсан
                    </Text>

                    <Box bg="white" borderRadius="inner" p="14px">
                        <Stack gap="0">
                            {inviteRows.map((row) => (
                                <HStack key={row.id} h="76px" justify="space-between">
                                    <HStack gap="14px">
                                        <Image
                                            src={avatar}
                                            alt=""
                                            draggable={false}
                                            w="48px"
                                            h="48px"
                                            opacity={0.7}
                                            pointerEvents="none"
                                        />
                                        <Text color="#101318" fontWeight="400" fontSize="16px">
                                            Найзаа урих
                                        </Text>
                                    </HStack>

                                    <Button
                                        variant="ghost"
                                        aria-label="Add"
                                        onClick={onAdd}
                                        w="44px"
                                        h="44px"
                                        minW="44px"
                                        p="0"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        _hover={{ bg: "transparent" }}
                                        _active={{ bg: "transparent" }}
                                    >
                                        <Image
                                            src={btnAdd}
                                            alt="Add"
                                            draggable={false}
                                            pointerEvents="none"
                                            w="24px"
                                            h="24px"
                                        />
                                    </Button>
                                </HStack>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Box>

            {/* Drawer overlays on top of the sheet */}
            <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement="bottom">
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content ref={sheetRef} bg="#ffffff" color="#101318" borderTopRadius="sheet">
                        <Drawer.CloseTrigger onClick={onClose} />

                        <Drawer.Body px="16px" pt="10px" pb="calc(18px + env(safe-area-inset-bottom))">
                            <Stack gap="12px">
                                {/* Handle (draggable) */}
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    pt="2px"
                                    pb="6px"
                                    onPointerDown={onPointerDown}
                                    onPointerMove={onPointerMove}
                                    onPointerUp={onPointerUp}
                                    onPointerCancel={onPointerUp}
                                    touchAction="none"
                                    cursor="grab"
                                >
                                    <Box w="44px" h="5px" borderRadius="999px" bg="#D9DCE3" />
                                </Box>

                                {/* Header */}
                                <Text textAlign="center" fontWeight="500" fontSize="18px">
                                    Найзаа урих
                                </Text>

                                {/* Input field (compact) */}
                                <Box
                                    bg="#F3F4F8"
                                    borderRadius="12px"
                                    px="16px"
                                    pt="8px"
                                    pb="8px"
                                    borderBottom="2px solid #101318"
                                >
                                    <Text color="#818E9A" fontWeight="400" fontSize="12px">
                                        Утасны дугаар
                                    </Text>

                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        variant="unstyled"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        fontSize="16px"
                                        lineHeight="1.2"
                                        color="#101318"
                                        caretColor="#101318"
                                        bg="transparent"
                                        px="0"
                                        py="0"
                                        h="auto"
                                        minH="0"
                                        display="block"
                                        style={{ textIndent: 0 }}
                                    />
                                </Box>

                                {/* Helper text */}
                                <Text color="#6F7381" fontWeight="400" fontSize="14px" lineHeight="1.4">
                                    Найзынхаа Toki апп-д бүртгэлтэй дугаарыг оруулна уу.
                                </Text>

                                {/* space above button */}
                                <Box pt="20px">
                                    <Button
                                        w="100%"
                                        h="48px"
                                        borderRadius="8px"
                                        px="16px"
                                        justifyContent="space-between"
                                        fontWeight="500"
                                        fontSize="16px"
                                        onClick={onSend}
                                        disabled={!isSendEnabled}
                                        bg={isSendEnabled ? "#101318" : "#EDEDF5"}
                                        color={isSendEnabled ? "#FFFFFF" : "#ABAFBD"}
                                    >
                                        <Box flex="1" textAlign="center">
                                            Урилга илгээх
                                        </Box>
                                    </Button>
                                </Box>
                            </Stack>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </>
    )
}