import Logo from "./Logo";
import InputFormGroup from "./InputFormGroup";
import UserIcon from "./UserIcon";
import BurgerBtn from "./BurgerBtn";
import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}



function Header({isSidebarOpen, setIsSidebarOpen}:HeaderProps) {
  return (
    <div className="sticky top-0 bg-white z-100 w-full px-0 md:px-4 lg:w-11/12 mx-auto">
      <header className="flex justify-between items-center h-16 px-2 md:px-0">
        <Logo />
        <InputFormGroup />
        <UserIcon />
        <BurgerBtn  isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </header>
      <hr className="mb-8" />
    </div>
  );
}

export default Header;
