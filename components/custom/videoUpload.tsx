"use client";

import { ChangeEvent, lazy, Suspense, useRef, useState } from "react";
import { FileUploadZone } from "./inputBox";
import { UploadProgress } from "./uploadProgress";
import { ErrorDisplay } from "./errorDisplay";
import { useToast } from "@/hooks/use-toast";
import { SubmitButton } from "./submitButton";

// Lazily load the VideoRecorder component for better performance
const VideoRecorder = lazy(() => import("@/components/custom/videoRecorder"));

/**
 * Handles the video file upload process, including file selection and recording.
 *
 * @returns {JSX.Element} The video upload form component.
 */
export function VideoUploadForm() {
  const [error, setError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  // Resets the form and its state
  const resetForm = () => {
    setError("");
    setUploadProgress(0);
    setIsUploading(false);
    setFile(undefined);
    formRef.current?.reset();
  };

  /**
   * Handles video file selection by the user.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The change event from file input.
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFile(event.target.files[0]);
  };

  /**
   * Handles the completion of a video recording by uploading the recorded file.
   *
   * @param {File} file - The video file recorded by the user.
   */
  const handleRecordingComplete = (file: File) => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      formData.set("video", file);
      uploadVideo(formData);
    }
  };

  /**
   * Handles the video upload process using a presigned URL.
   *
   * @param {FormData} formData - The form data containing the video file to upload.
   */
  const uploadVideo = async (formData: FormData) => {
    const file = formData.get("video") as File;
    if (!file.name || !file.size) return;

    try {
      setIsUploading(true);
      setUploadProgress(0); // Reset progress

      // Fetch presigned URL for upload
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error("Failed to get upload URL");

      const { url, fields } = await response.json();
      const uploadFormData = new FormData();

      // Append fields for the presigned upload
      Object.entries(fields).forEach(([key, value]) =>
        uploadFormData.append(key, value as string)
      );
      uploadFormData.append("file", file);

      // Upload video file to S3
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 204) {
          toast({
            description: "Video uploaded successfully!",
            variant: "success",
          });
          resetForm();
        } else {
          toast({
            description: "Failed to upload video",
            variant: "destructive",
          });
        }
      });

      xhr.addEventListener("error", () => {
        setError("Upload Failed");
        toast({ description: "Upload failed", variant: "destructive" });
      });

      xhr.open("POST", url);
      xhr.send(uploadFormData);
    } catch (error) {
      console.error("Error uploading:", error);
      setIsUploading(false);
      toast({ description: "Failed to upload video", variant: "destructive" });
    }
  };

  return (
    <form ref={formRef} className="flex flex-col space-y-4">
      {/* File upload zone for selecting a video file */}
      <Suspense fallback={<div>Loading...</div>}>
        <FileUploadZone
          onChange={handleFileChange}
          file={file}
          id="video-upload"
        />
      </Suspense>

      {/* Submit button */}
      <SubmitButton />

      {/* Lazy-loaded video recorder for capturing videos */}
      <Suspense fallback={<div>Loading Video Recorder...</div>}>
        <VideoRecorder onRecordingComplete={handleRecordingComplete} />
      </Suspense>

      {/* Upload progress indicator */}
      {isUploading && (
        <Suspense fallback={<div>Loading progress...</div>}>
          <UploadProgress progress={uploadProgress} />
        </Suspense>
      )}

      {/* Error display in case of failed uploads */}
      {error && (
        <Suspense fallback={<div>Loading errors...</div>}>
          <ErrorDisplay error={error} />
        </Suspense>
      )}
    </form>
  );
}
