import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/nextjs";
import { Button } from "./ui/Button";
import { LoaderCircle } from "lucide-react";
import { SignInMessage } from "./SignInMessage";

const Navbar = () => (
  <header className="flex justify-between p-4 mb-20 sm:mb-24 px-8 items-center sm:px-16 border-b-2 shadow-md">
    <h1 className="font-bold text-xl text-heading">Task Manager</h1>
    <div>
      <ClerkLoading>
        <LoaderCircle className="animate-spin text-primary" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignInButton>
            <Button className="font-semibold capitalize">sign in</Button>
          </SignInButton>
          <SignInMessage />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </ClerkLoaded>
    </div>
  </header>
);

export default Navbar;
