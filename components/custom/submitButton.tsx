"use client";

import { JSX } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

/**
 * SubmitButton component that handles form submission.
 * It disables itself when the form is in a pending (submitting) state.
 *
 * @returns {JSX.Element} The submit button component.
 */
export function SubmitButton(): JSX.Element {
  // Get form submission status to disable the button when submitting
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Uploading..." : "Upload Video"}
    </Button>
  );
}
