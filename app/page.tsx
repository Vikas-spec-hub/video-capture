import type { NextPage } from "next";
import { VideoUploadForm } from "@/components/custom/videoUpload";
import { JSX } from "react";

/**
 * Home page component that provides a user interface
 * for uploading or recording a video.
 *
 * @returns {JSX.Element} The Home page layout.
 */
const Home: NextPage = (): JSX.Element => {
  return (
    <main>
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Upload Video</h2>
          <p className="text-muted-foreground">
            Choose a video file or record directly from your camera
          </p>
        </div>

        {/* Video Upload Form Section */}
        <div className="space-y-4 rounded-lg border border-gray-200 p-4">
          <VideoUploadForm />
        </div>
      </div>
    </main>
  );
};

export default Home;
