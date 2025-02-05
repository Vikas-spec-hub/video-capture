"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "./errorDisplay";
import { useFormStatus } from "react-dom";

interface VideoRecorderProps {
  /** Callback function to handle the recorded video file */
  onRecordingComplete: (file: File) => void;
}

/**
 * VideoRecorder component allows users to record a video using their camera
 * and send the recorded video file once completed.
 *
 * @param {Object} props - The props for the VideoRecorder component.
 * @param {function} props.onRecordingComplete - Callback to handle the recorded video file.
 * @returns {JSX.Element} The VideoRecorder component.
 */
export function VideoRecorder({ onRecordingComplete }: VideoRecorderProps) {
  // State to manage recording status
  const [isRecording, setIsRecording] = useState(false);
  // Ref for the video element to display live video feed
  const videoRef = useRef<HTMLVideoElement>(null);
  // Ref for the MediaRecorder instance
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // Ref to store video chunks while recording
  const chunksRef = useRef<BlobPart[]>([]);
  // State to handle error messages
  const [error, setError] = useState<string>("");
  // State to store the recorded video file
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  // Form status to track submission state
  const { pending } = useFormStatus();

  /**
   * Resets the video recorder state and clears any recorded video.
   */
  const resetRecorder = () => {
    setIsRecording(false);
    if (videoRef.current) videoRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setError("");
    setRecordedFile(null);
  };

  /**
   * Starts recording video from the user's camera.
   * Requests camera access and initializes the MediaRecorder to start recording.
   */
  const startRecording = async () => {
    try {
      // Request access to user's camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // If the video element is present, assign the stream to display live video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize the MediaRecorder to record the video stream
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      // Handle data available from the recorder (ondataavailable)
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle stop of recording (onstop)
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], "recorded-video.webm", {
          type: "video/webm",
        });
        setRecordedFile(file); // Set the recorded file to state
      };

      mediaRecorderRef.current.start(); // Start recording
      setIsRecording(true); // Update recording status
    } catch (err) {
      // Set error message if camera access fails
      setError(
        `Failed to access camera: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  /**
   * Stops the current video recording and releases camera resources.
   * This stops the MediaRecorder and video tracks.
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
      tracks?.forEach((track) => track.stop()); // Stop the video tracks
      setIsRecording(false); // Update recording status
    }
  };

  /**
   * Handles the uploaded recorded video.
   * Passes the recorded file to the onRecordingComplete callback and resets the recorder.
   */
  const handleUploadRecordedFile = () => {
    if (!recordedFile) return;
    onRecordingComplete(recordedFile);
    resetRecorder();
  };

  return (
    <div className="space-y-4">
      {/* Display the video element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full rounded-lg bg-black"
      />
      {/* Controls for recording */}
      <div className="flex justify-center gap-4">
        {recordedFile ? (
          // If a video is recorded, show button to upload it
          <Button
            type="button"
            onClick={handleUploadRecordedFile}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            disabled={pending} // Disable while form is pending
          >
            <Camera className="w-4 h-4" />
            Upload Recorded Video
          </Button>
        ) : !isRecording ? (
          // If not recording, show button to start recording
          <Button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Start Recording
          </Button>
        ) : (
          // If recording, show button to stop recording
          <Button
            type="button"
            onClick={stopRecording}
            variant="destructive"
            className="flex items-center gap-2"
          >
            Stop Recording
          </Button>
        )}
      </div>
      {/* Display error message if there is one */}
      <ErrorDisplay error={error} />
    </div>
  );
}

export default VideoRecorder;
