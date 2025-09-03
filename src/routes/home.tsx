import { createFileRoute } from '@tanstack/react-router'
import Home from "../component/home";

export const Route = createFileRoute('/home')({
  component: Home,
})
