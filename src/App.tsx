import { useEffect, useMemo, useRef, useState } from "react"
import { Box, Button, Container, Drawer, HStack, Image, Input, Stack, Text } from "@chakra-ui/react"

import banner from "./assets/banner.webp"
import avatar from "./assets/avatar.svg"
import btnAdd from "./assets/btn_add.svg"
import btnDelete from "./assets/btn_delete.svg"
import bonus from "./assets/bonus.svg"

const DRAG_CLOSE_DISTANCE = 60
const DRAG_CLOSE_VELOCITY = 0.5 // px/ms
const MAX_DRAG = 140

interface InviteData {
    id: string
    invitedNumber: string
    newNumber: string | null
    status: "SUCCESS" | "SENT" | "EXPIRED"
    operatorName: string
    expireDate: string
}

interface ApiResponseData {
    referrals: InviteData[]
    hasActiveEntitlement: boolean
    successReferralsCount: number
    entitlementExpirationDate: string
}

interface ApiResponse {
    result: "Success" | "Fail"
    message: string
    data: ApiResponseData | null
}

// Dummy API response
const DUMMY_RESPONSE: ApiResponse = {
    result: "Success",
    message: "Fetched existing records",
    data: {
        referrals: [
            {
                id: "82312",
                invitedNumber: "89115441",
                newNumber: "55150010",
                status: "SUCCESS",
                operatorName: "Юнител",
                expireDate: "2026-03-31T23:59:59",
            },
            {
                id: "82313",
                invitedNumber: "88547020",
                newNumber: null,
                status: "SENT",
                operatorName: "Юнител",
                expireDate: "2026-01-28T23:59:59",
            },
            {
                id: "82314",
                invitedNumber: "88547021",
                newNumber: null,
                status: "EXPIRED",
                operatorName: "Юнител",
                expireDate: "2026-01-12T23:59:59",
            },
        ],
        hasActiveEntitlement: true,
        successReferralsCount: 1,
        entitlementExpirationDate: "2026-02-25T00:00:00",
    },
}

// Map API status to display status
const mapStatus = (status: string): "Амжилттай" | "Урилга илгээсэн" | "Хугацаа дууссан" => {
    switch (status) {
        case "SUCCESS":
            return "Амжилттай"
        case "SENT":
            return "Урилга илгээсэн"
        case "EXPIRED":
            return "Хугацаа дууссан"
        default:
            return "Урилга илгээсэн"
    }
}

export default function App() {
    const [open, setOpen] = useState(false)
    const [phone, setPhone] = useState("")
    const [invites, setInvites] = useState<InviteData[]>([])
    const [hasActiveEntitlement, setHasActiveEntitlement] = useState(false)
    const [successReferralsCount, setSuccessReferralsCount] = useState(0)
    const [entitlementExpirationDate, setEntitlementExpirationDate] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const isSendEnabled = useMemo(() => phone.trim().length > 0, [phone])

    // Get tokiId from URL and fetch data (dummy for now)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const tokiId = params.get("tokiId")

        if (!tokiId) {
            setError("tokiId not found in URL")
            setLoading(false)
            return
        }

        // Simulate API call with dummy response
        setTimeout(() => {
            const response = DUMMY_RESPONSE

            if (response.result === "Success" && response.data) {
                setInvites(response.data.referrals)
                setHasActiveEntitlement(response.data.hasActiveEntitlement)
                setSuccessReferralsCount(response.data.successReferralsCount)
                setEntitlementExpirationDate(response.data.entitlementExpirationDate)
            } else {
                setError(response.message || "Failed to load invites")
            }
            setLoading(false)
        }, 500) // 500ms delay to simulate network

        // TODO: Replace with real API call later:
        // fetch(`https://your-api.com/invites?tokiId=${tokiId}`)
        //     .then((res) => res.json())
        //     .then((response: ApiResponse) => {
        //         if (response.result === "Success" && response.data) {
        //             setInvites(response.data.referrals)
        //             setHasActiveEntitlement(response.data.hasActiveEntitlement)
        //             setSuccessReferralsCount(response.data.successReferralsCount)
        //             setEntitlementExpirationDate(response.data.entitlementExpirationDate)
        //         } else {
        //             setError(response.message || "Failed to load invites")
        //         }
        //     })
        //     .catch((err) => {
        //         setError(err.message)
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     })
    }, [])

    const onAdd = () => setOpen(true)

    const onClose = () => {
        setOpen(false)
        setPhone("")
    }

    const onSend = () => {
        alert(`Send invite to: ${phone}`)
    }

    const onResend = (id: string) => {
        alert(`Resend invitation for ID: ${id}`)
    }

    const onDelete = (id: string) => {
        alert(`Delete invitation for ID: ${id}`)
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

    // Empty slots to always show 5 rows
    const displayRows = useMemo(() => {
        const rows = [...invites]
        while (rows.length < 5) {
            rows.push({
                id: `empty-${rows.length}`,
                invitedNumber: "",
                newNumber: null,
                status: "SENT",
                operatorName: "",
                expireDate: "",
            })
        }
        return rows.slice(0, 5)
    }, [invites])

    return (
        <>
            <Box
                minH="100dvh"
                bg="appBg"
                pt="env(safe-area-inset-top)"
                display="flex"
                flexDirection="column"
            >
                <Container px="18px" pt="96px" pb="18px" maxW="md">
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

                <Box
                    mt="auto"
                    bg="#f5f5fa"
                    borderTopRadius="sheet"
                    px="18px"
                    pt="18px"
                    pb="calc(18px + env(safe-area-inset-bottom))"
                >
                    {/* Entitlement card - show only if hasActiveEntitlement is true */}
                    {hasActiveEntitlement && (
                        <EntitlementCard
                            expirationDate={entitlementExpirationDate}
                            successCount={successReferralsCount}
                        />
                    )}

                    <Text color="appBg" fontWeight="500" fontSize="16px" mb="14px">
                        Миний урьсан
                    </Text>

                    <Box bg="white" borderRadius="inner" px="14px">
                        {loading ? (
                            <Box py="40px" textAlign="center">
                                <Text color="#6F7381">Loading...</Text>
                            </Box>
                        ) : error ? (
                            <Box py="40px" textAlign="center">
                                <Text color="#E53E3E">{error}</Text>
                            </Box>
                        ) : (
                            <Stack gap="0">
                                {displayRows.map((row) => (
                                    <InviteRow
                                        key={row.id}
                                        data={row}
                                        onAdd={onAdd}
                                        onResend={onResend}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Box>
            </Box>

            <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement="bottom">
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content ref={sheetRef} bg="#ffffff" color="#101318" borderTopRadius="sheet">
                        <Drawer.CloseTrigger onClick={onClose} />

                        <Drawer.Body px="16px" pt="10px" pb="calc(18px + env(safe-area-inset-bottom))">
                            <Stack gap="12px">
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

                                <Text textAlign="center" fontWeight="500" fontSize="18px">
                                    Найзаа урих
                                </Text>

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
                                        onChange={(e) => {
                                            const digitsOnly = e.target.value.replace(/\D/g, "")
                                            setPhone(digitsOnly)
                                        }}
                                        variant="flushed"
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        pattern="[0-9]*"
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

                                <Text color="#6F7381" fontWeight="400" fontSize="14px" lineHeight="1.4">
                                    Найзынхаа Toki апп-д бүртгэлтэй дугаарыг оруулна уу.
                                </Text>

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

// Entitlement Card Component
interface EntitlementCardProps {
    expirationDate: string
    successCount: number
}

function EntitlementCard({ expirationDate, successCount }: EntitlementCardProps) {
    const [countdown, setCountdown] = useState("")

    useEffect(() => {
        if (!expirationDate) return

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const expire = new Date(expirationDate).getTime()
            const diff = expire - now

            if (diff <= 0) {
                setCountdown("0 өдөр 00:00:00")
                clearInterval(interval)
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                setCountdown(
                    `${days} өдөр ${String(hours).padStart(2, "0")}:${String(minutes).padStart(
                        2,
                        "0"
                    )}:${String(seconds).padStart(2, "0")}`
                )
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [expirationDate])

    return (
        <Box bg="#22252D" borderRadius="14px" p="2px" mb="14px">
            {/* Inner white card */}
            <Box bg="#FFFFFF" borderRadius="12px" p="14px">
                <HStack gap="12px" mb="12px">
                    <Image src={bonus} draggable={false} pointerEvents="none" />
                    <Box flex="1">
                        <Text color="#6F7381" fontWeight="400" fontSize="12px">
                            Дата x3 үржигдэх хугацаа
                        </Text>
                        <Text color="#22252D" fontWeight="500" fontSize="16px">
                            {countdown}
                        </Text>
                    </Box>
                </HStack>

                <Text color="#6F7381" fontWeight="400" fontSize="12px" lineHeight="1.4">
                    Найзаа урих бүрд урамшууллын хугацаа 30 хоногоор нэмэгдэнэ.
                </Text>
            </Box>

            {/* Bottom section - Амжилттай урьсан */}
            <HStack px="14px" py="5px" justify="space-between" align="center">
                <Text color="#FFFFFF" fontWeight="400" fontSize="12px">
                    Амжилттай урьсан
                </Text>
                <Text color="#FFFFFF" fontWeight="500" fontSize="12px">
                    {successCount}/5
                </Text>
            </HStack>
        </Box>
    )
}

// Individual row component
interface InviteRowProps {
    data: InviteData
    onAdd: () => void
    onResend: (id: string) => void
    onDelete: (id: string) => void
}

function InviteRow({ data, onAdd, onResend, onDelete }: InviteRowProps) {
    const [countdown, setCountdown] = useState("")

    // Countdown timer for "SENT" status
    useEffect(() => {
        if (data.status !== "SENT" || !data.expireDate) return

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const expire = new Date(data.expireDate).getTime()
            const diff = expire - now

            if (diff <= 0) {
                setCountdown("00:00:00")
                clearInterval(interval)
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                setCountdown(
                    `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
                        seconds
                    ).padStart(2, "0")}`
                )
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [data.status, data.expireDate])

    // Empty row
    if (!data.invitedNumber) {
        return (
            <HStack h="76px" justify="space-between">
                <HStack gap="14px">
                    <Image src={avatar} w="48px" h="48px" opacity={0.7} pointerEvents="none" />
                    <Text color="#101318" fontWeight="400" fontSize="16px">
                        Найзаа урих
                    </Text>
                </HStack>

                <Button
                    variant="ghost"
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
                    <Image src={btnAdd} w="24px" h="24px" pointerEvents="none" />
                </Button>
            </HStack>
        )
    }

    // Success status
    if (data.status === "SUCCESS") {
        return (
            <HStack h="76px" justify="space-between" align="center">
                <HStack gap="14px" flex="1">
                    <Image src={avatar} w="48px" h="48px" opacity={0.7} pointerEvents="none" />
                    <Box flex="1">
                        <Text color="#101318" fontWeight="400" fontSize="16px" mb="2px">
                            {data.newNumber}
                        </Text>
                        <Text color="#6F7381" fontWeight="400" fontSize="12px">
                            {data.operatorName} • {data.invitedNumber}
                        </Text>
                    </Box>
                </HStack>

                <Box
                    bg="#e6f5e6"
                    color="#65C466"
                    px="10px"
                    py="4px"
                    borderRadius="999px"
                    fontSize="12px"
                    fontWeight="400"
                >
                    {mapStatus(data.status)}
                </Box>
            </HStack>
        )
    }

    // Invitation sent status
    if (data.status === "SENT") {
        return (
            <HStack h="76px" justify="space-between" align="center">
                <HStack gap="14px" flex="1">
                    <Image src={avatar} w="48px" h="48px" opacity={0.7} pointerEvents="none" />
                    <Box flex="1">
                        <Text color="#101318" fontWeight="400" fontSize="16px" mb="2px">
                            {data.invitedNumber}
                        </Text>
                        <Text color="#6F7381" fontWeight="400" fontSize="13px">
                            {countdown}
                        </Text>
                    </Box>
                </HStack>

                <Box
                    bg="#fff6d6"
                    color="#FFC800"
                    px="10px"
                    py="4px"
                    borderRadius="999px"
                    fontSize="12px"
                    fontWeight="400"
                >
                    {mapStatus(data.status)}
                </Box>
            </HStack>
        )
    }

    // Expired status
    if (data.status === "EXPIRED") {
        return (
            <HStack h="76px" justify="space-between" align="center">
                <HStack gap="14px" flex="1">
                    <Image src={avatar} w="48px" h="48px" opacity={0.7} pointerEvents="none" />
                    <Box flex="1">
                        <Text color="#101318" fontWeight="400" fontSize="16px" mb="2px">
                            {data.invitedNumber}
                        </Text>
                        <Text color="#6F7381" fontWeight="400" fontSize="13px">
                            00:00:00
                        </Text>
                    </Box>
                </HStack>

                <HStack gap="8px">
                    <Button
                        size="sm"
                        h="32px"
                        px="12px"
                        fontSize="13px"
                        fontWeight="500"
                        bg="#F5F5FA"
                        color="#22252D"
                        borderRadius="6px"
                        onClick={() => onResend(data.id)}
                        _hover={{ bg: "#E0E0E8" }}
                    >
                        Дахин илгээх
                    </Button>
                    <Image src={btnDelete} w="24px" h="24px" pointerEvents="none" />
                </HStack>
            </HStack>
        )
    }

    return null
}