import React, { useState, useRef } from 'react';

interface VoiceRecorderProps {
  onTranscription: (transcription: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        // Here you would typically send the audio data to a speech-to-text service
        // For this example, we'll use a placeholder transcription
        onTranscription("This is a simulated transcription of the audio input.");
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`p-2 ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg`}
    >
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  );
};

export default VoiceRecorder;