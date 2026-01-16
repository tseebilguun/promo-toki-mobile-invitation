import { Box, Button, Container, HStack, Image, Stack, Text } from "@chakra-ui/react"

import banner from "./assets/banner.webp"
import avatar from "./assets/avatar.svg"

const inviteRows = Array.from({ length: 5 }, (_, i) => ({ id: i }))

export default function App() {
    const onAdd = (index: number) => {
        alert(`Add clicked: row ${index + 1}`)
    }

    return (
        <Box minH="100vh" bg="appBg" pt="env(safe-area-inset-top)">
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
                        <Text color="mutedText" fontWeight="400" fontSize="18px" mb="6px">
                            Найзаа уриад
                        </Text>

                        <Text color="white" fontWeight="500" fontSize="34px" lineHeight="1.15" mb="10px">
                            Датагаа 3 үржүүлээд ав
                        </Text>

                        <Text color="mutedText" fontWeight="400" fontSize="18px" lineHeight="1.4">
                            Toki Mobile-д найзуудaa уриад хүссэн датагаа авах бүрдээ датагаа 3 үржүүлээрэй.
                        </Text>
                    </Box>
                </Box>
            </Container>

            {/* Bottom sheet */}
            <Box
                mt="18px"
                bg="#f5f5fa"
                borderTopRadius="sheet"
                px="18px"
                pt="18px"
                pb="calc(18px + env(safe-area-inset-bottom))"
            >
                <Text color="appBg" fontWeight="500" fontSize="26px" mb="14px">
                    Миний урьсан
                </Text>

                <Box bg="white" borderRadius="inner" p="14px">
                    <Stack gap="0">
                        {inviteRows.map((row, idx) => (
                            <HStack
                                key={row.id}
                                h="86px"
                                justify="space-between"
                                borderTop={idx === 0 ? "none" : "1px solid rgba(34, 37, 45, 0.06)"}
                            >
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
                                    <Text color="#101318" fontWeight="400" fontSize="22px">
                                        Найзаа урих
                                    </Text>
                                </HStack>

                                <Button
                                    variant="ghost"
                                    aria-label="Add"
                                    onClick={() => onAdd(row.id)}
                                    w="44px"
                                    h="44px"
                                    minW="44px"
                                    fontSize="36px"
                                    lineHeight="44px"
                                    p="0"
                                    color="mutedText"
                                    _hover={{ bg: "transparent" }}
                                    _active={{ bg: "transparent" }}
                                >
                                    +
                                </Button>
                            </HStack>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}