"use client";

import profilePicPlaceholder from "@/app/assets/avatar-removebg-preview.png";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

interface UserMenuButtonProps {
  session: Session | null;
}

export default function UserMenuButton({ session }: UserMenuButtonProps) {
  const user = session?.user;

  return (
    <div className="dropdown-end dropdown">
      <label tabIndex={0} className="btn-ghost btn-circle btn">
        {user ? (
          <Image
            src={user?.image || profilePicPlaceholder}
            alt="Profile picture"
            width={40}
            height={40}
            className="w-10 rounded-full"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 128"
          className="w-6 h-6">
    <path d="M56 64A32 32 0 1 0 56 0a32 32 0 1 
    0 0 64zm-11.43 12C19.95 76 0 95.95 0 120.29C0 124.68 3.33 128 7.43 128h97.14 
    c4.1 0 7.43-3.32 7.43-7.43C112 95.95 92.05 76 74.57 76l-22.85 0z"/>
</svg>
        )}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box menu-sm z-30 mt-3 w-52 bg-slate-300 p-2 shadow"
      >
        <li>
          {user ? (
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              Sign Out
            </button>
          ) : (
            <button onClick={() => signIn()}>Sign In</button>
          )}
        </li>
      </ul>
    </div>
  );
}
