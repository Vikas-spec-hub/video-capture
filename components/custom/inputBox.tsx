"use client";

import { Camera, Video } from "lucide-react";
import { ChangeEvent } from "react";

interface FileUploadZoneProps {
  /** Unique ID for the file input field */
  id: string;
  /** Callback function to handle file change event */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Optionally, the file to display if it's already selected */
  file?: File;
}

/**
 * FileUploadZone component allows users to upload a video file
 * by clicking or dragging and dropping a file.
 *
 * @param {FileUploadZoneProps} props - Component props.
 * @param {string} props.id - Unique ID for the file input field.
 * @param {Function} props.onChange - Callback to handle file selection.
 * @param {File} [props.file] - Optional file to display if already selected.
 * @returns {JSX.Element} The file upload zone component.
 */
export function FileUploadZone({ id, onChange, file }: FileUploadZoneProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      {/* Hidden file input for video uploads */}
      <input
        type="file"
        name="video"
        accept="video/*"
        className="hidden"
        id={id}
        onChange={onChange}
      />

      {/* Label to trigger file input click */}
      <label htmlFor={id} className="flex flex-col items-center cursor-pointer">
        {file ? (
          <>
            {/* Display selected video file icon and name */}
            <Video className="w-12 h-12 text-gray-400" />
            <span className="mt-2 text-sm text-gray-600">{file.name}</span>
          </>
        ) : (
          <>
            {/* Default upload prompt with camera icon */}
            <Camera className="w-12 h-12 text-gray-400" />
            <span className="mt-2 text-sm text-gray-600">
              Click to upload video or drag and drop
            </span>
          </>
        )}
      </label>
    </div>
  );
}
