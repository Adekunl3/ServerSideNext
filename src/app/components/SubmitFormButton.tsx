"use client";

import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type SubmitFormButtonProps = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<"button">;

export default function SubmitFormButton({
  children,
  className,
  ...props
}: SubmitFormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={`btn btn-primary ${className} `}
      type="submit"
      disabled={pending}
    >
      {pending && <span className="loading loading-spinner" />}
      {children}
    </button>
  );
}
