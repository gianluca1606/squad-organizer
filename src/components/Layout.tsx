import { type FC, type ReactNode } from 'react';
import { NavBar } from './NavBar';
import Footer from './Footer';

interface Props {
    children?: ReactNode;
}

const Layout: FC<Props> = ({ children }: Props) => {
    return (
        <div className="font-poppins flex h-screen flex-col">
            <NavBar></NavBar>
            <div className="flex  flex-grow flex-col bg-white text-black dark:bg-background dark:text-white">
                <main className="flex  flex-grow flex-col items-center justify-center ">{children}</main>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default Layout;
