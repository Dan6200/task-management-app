"use client";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/Button";

const Navbar = () => (
  <header className="flex justify-between p-4 mb-8 px-8 items-center sm:px-16 border-b-2">
    <h1 className="font-bold text-xl">Task Manager</h1>
    <div>
      <SignedOut>
        <Button>
          <SignInButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </header>
);

export default Navbar;
