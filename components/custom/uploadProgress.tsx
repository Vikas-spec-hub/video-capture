import { JSX } from "react";

import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  /** The current progress of the video upload (0-100%) */
  progress: number;
}

/**
 * UploadProgress component that visually shows the progress of a video upload.
 *
 * @param {UploadProgressProps} props - Component props.
 * @param {number} props.progress - The current progress of the upload as a percentage (0-100).
 * @returns {JSX.Element | null} The progress bar component or null if the progress is 0.
 */
export function UploadProgress({
  progress,
}: UploadProgressProps): JSX.Element | null {
  // Do not render the progress bar if the upload has not started
  if (progress === 0) return null;

  return (
    <div className="space-y-2">
      {/* Progress bar to indicate upload progress */}
      <Progress value={progress} className="w-full" />

      {/* Display the progress percentage */}
      <p className="text-sm text-gray-600 text-center">
        Uploading: {progress}%
      </p>
    </div>
  );
}
