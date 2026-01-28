import {createRoot} from "react-dom/client"
import {ChakraProvider} from "@chakra-ui/react"

import App from "./App.tsx"
import {system} from "./chakra"

createRoot(document.getElementById("root")!).render(
    <ChakraProvider value={system}>
        <App/>
    </ChakraProvider>,
)