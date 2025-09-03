import {createFileRoute} from '@tanstack/react-router'
import First from "../component/first";

export const Route = createFileRoute('/first')({
    component: First,
})

