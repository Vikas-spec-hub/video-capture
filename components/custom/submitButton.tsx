"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

/**
 * SubmitButton component that handles form submission.
 * It disables itself when the form is in a pending (submitting) state.
 *
 * @returns {JSX.Element} The submit button component.
 */
export function SubmitButton() {
  // Get form submission status to disable the button when submitting
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Uploading..." : "Upload Video"}
    </Button>
  );
}
