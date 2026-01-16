import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            fonts: {
                heading: { value: `"Rubik", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif` },
                body: { value: `"Rubik", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif` },
            },
            colors: {
                appBg: { value: "#22252d" },
                cardBg: { value: "#363941" },
                mutedText: { value: "#abafbd" },
            },
            radii: {
                banner: { value: "26px" },
                bannerImage: { value: "20px" },
                sheet: { value: "28px" },
                inner: { value: "22px" },
            },
        },
    },
})