"use client";
import React, { useState } from "react";
import axios from "axios";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Circle, Mic ,StopCircleIcon} from "lucide-react";

import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import toast from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { userProModel } from "@/hooks/use-pro-model";
import { cn } from "@/lib/utils";

const TextToSpeech = () => {
  const recorderControls = useAudioRecorder();
  const [transcription, setTranscription] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const ProModal=userProModel();

  const addAudioElement = async (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      
      const response = await axios.post('/api/speech-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newTranscription = response.data.transcription;
      setTranscription(newTranscription);
    } catch (error:any) {
        if(error?.response?.status===403)
            {
              ProModal.onOpen();
            }else{
              toast.error("something went wrong")
            }
     

    } finally {
      setIsLoading(false);
    }
  };

  const handleStopRecording = () => {
    recorderControls.stopRecording();
  };

  const handleCopyTranscription = () => {
    toast.success("Transcription copied to clipboard");
  };

  return (
    <div className="ml-auto mr-auto sm:w-[100%] sm:p-0 lg:p-8 md:p-8">
      <Heading
        title="Speech-to-text Generation"
        description="Turn speech into text."
        icon={Mic}
        iconColor="text-green-500"
        bgColor="bg-green-500/10"
      />
      <div className="flex flex-col items-center mt-8 sm:w-[100%]">
        <div className="w-full max-w-xl bg-gray-100 rounded-lg overflow-hidden shadow-lg p-4">
          <div className="flex items-center mb-4  ">
            <div className="flex-1">
              <AudioRecorder 
                onRecordingComplete={addAudioElement}
                recorderControls={recorderControls}
                />
            </div>
            <div className=" lg:hidden md:hidden "> 
            <div className={cn("p-2 w-fit rounded-md")}>
          <StopCircleIcon   onClick={handleStopRecording}  className={cn("w-10 h-10","bg","text-red-500" ,"hover:cursor-pointer")} />
        </div>
            </div>
            <div className="hidden lg:inline-block md:inline-block ">

              <Button 
                onClick={handleStopRecording} 
              >
                Stop Recording
              </Button>
            </div>
          </div>
          {audioUrl && (
            <div className="mb-4">
              <audio src={audioUrl} controls className="w-full" />
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
          {!isLoading && transcription && (
            <div className="p-4 bg-gray-200 rounded-lg">
              <h2 className="text-lg font-bold">Transcription:</h2>
              <p className="mt-2">{transcription}</p>
              <div className="mt-2">
                <CopyToClipboard text={transcription} onCopy={handleCopyTranscription}>
                  <Button className="py-2 px-4  bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300 rounded-lg">
                    Copy Transcription
                  </Button>
                </CopyToClipboard>
              </div>
            </div>
          )}
          {!isLoading && !transcription && (
            <div className="p-4 bg-gray-200 rounded-lg">
              <p className="text-gray-600">Record and save to see transcription.</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default TextToSpeech;
