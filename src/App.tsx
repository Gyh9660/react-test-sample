import {createRouter, RouterProvider} from '@tanstack/react-router';
import {routeTree} from './routeTree.gen';
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";

const router = createRouter({routeTree});
const queryClient = new QueryClient();

export function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>

    );

}