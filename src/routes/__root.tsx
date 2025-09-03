import {createRootRoute, Link, Outlet} from '@tanstack/react-router';
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools';
import '../App.css'
import '../index.css'

const RootLayout = () => (
    <>
        <div className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">Root</Link>{' '}
            <Link to="/home" className="[&.active]:font-bold">Home</Link>{' '}
            <Link to="/first" className="[&.active]:font-bold">First</Link>
        </div>
        <hr/>
        <Outlet/>
        <TanStackRouterDevtools/>
    </>
);

export const Route = createRootRoute({
    component: RootLayout,
});