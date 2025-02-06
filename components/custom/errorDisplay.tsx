import { JSX } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorDisplayProps {
  /** Error message to be displayed */
  error: string;
}

/**
 * ErrorDisplay component to show an alert message when an error occurs.
 *
 * @param {ErrorDisplayProps} props - Component props.
 * @param {string} props.error - The error message to display.
 * @returns {JSX.Element | null} The error alert component or null if no error exists.
 */
export function ErrorDisplay({ error }: ErrorDisplayProps): JSX.Element | null {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
