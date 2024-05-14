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
import { LoaderCircle } from "lucide-react";

const Navbar = () => (
  <header className="flex justify-between p-4 mb-8 px-8 items-center sm:px-16 border-b-2 shadow-md">
    <h1 className="font-bold text-xl text-primary">Task Manager</h1>
    <div>
      <ClerkLoading>
        <Button>
          <LoaderCircle className="animate-spin" />
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
