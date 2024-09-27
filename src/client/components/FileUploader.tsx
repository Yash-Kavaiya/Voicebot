import React from 'react';

interface FileUploaderProps {
  onTranscription: (transcription: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onTranscription }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically send the file to a speech-to-text service
      // For this example, we'll use a placeholder transcription
      const transcription = `Transcription of ${file.name}: This is a simulated transcription of the uploaded audio file.`;
      onTranscription(transcription);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
        id="audio-upload"
      />
      <label
        htmlFor="audio-upload"
        className="p-2 bg-purple-500 text-white rounded-lg cursor-pointer"
      >
        Upload Audio
      </label>
    </div>
  );
};

export default FileUploader;