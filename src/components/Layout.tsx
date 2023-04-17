import { FC, ReactNode } from "react";
import { NavBar } from "./NavBar";
import Footer from "./Footer";

interface Props {
  children?: ReactNode;
}

const Layout: FC = ({ children }: Props) => {
  return (
    <div className="flex h-screen flex-col">
      <NavBar></NavBar>
      <div className="light:text-black  light:bg-white flex flex-grow flex-col dark:bg-gray-800 dark:text-white">
        <main className="flex  flex-grow flex-col items-center justify-center ">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            {children}
          </div>
        </main>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Layout;
