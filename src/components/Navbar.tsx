"use client";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/nextjs";
import { Button } from "./ui/Button";
import { Spinner } from "@radix-ui/themes";

const Navbar = () => (
  <header className="flex justify-between p-4 mb-8 px-8 items-center sm:px-16 border-b-2">
    <h1 className="font-bold text-xl">Task Manager</h1>
    <div>
      <ClerkLoading>
        <Button>
          <Spinner />
        </Button>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <Button>
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </ClerkLoaded>
    </div>
  </header>
);

export default Navbar;
