import React from 'react';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
  const { courseId, videoId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <div className="aspect-video bg-black rounded-lg mb-4">
            {/* Video player will be integrated here */}
            <div className="w-full h-full flex items-center justify-center text-white">
              Video Player Placeholder
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Video Title</h1>
            <p className="text-gray-600 mb-4">
              Video description will go here. This is a placeholder for the video content details.
            </p>
          </div>
        </div>

        {/* Course Content Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Course Content</h2>
            <div className="space-y-2">
              {/* Placeholder for course sections and videos */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Section 1: Introduction</h3>
                <ul className="mt-2 space-y-1">
                  <li className="pl-4 text-blue-600">• Video 1: Getting Started</li>
                  <li className="pl-4 text-gray-600">• Video 2: Course Overview</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 