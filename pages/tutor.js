import Image from "next/image";
import { Inter } from "next/font/google";
import Router from "next/router";
import { useState, useEffect } from "react";
import ScrollContainer from "../components/ScrollContainer";
import TypingAnimation from "../components/TypingAnimation";
import Markdown from "react-markdown";

import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import Microphone from "../components/Microphone";
import { Hume, HumeClient } from "hume";

const inter = Inter({ subsets: ["latin"] });

export default function Tutor() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [quizMode, setQuizMode] = useState(false);
  // const client = new HumeClient({
  //     apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY,
  //     secretKey: process.env.NEXT_PUBLIC_HUME_SECRET_KEY,
  // });
  // import messages as audioMessages
  const {
    connect,
    disconnect,
    readyState,
    messages: audioMessages,
  } = useVoice();

  useEffect(() => {
    if (audioMessages.length > 0) {
      setMessage(
        audioMessages.filter((m) => m.type === "user_message").map((m) => m.message.content).join(" ")
      )
    }
  }, [audioMessages])

  const handleSubmit = () => {
    setLoading(true);
    if (!message) {
      return;
    }
    setMessages([...messages, { message, type: "user", emotion: [] }]);
    sendMessage({ message, emotion: [] }).then((data) => {
        if (data.quiz) {
            if (quizMode) exitQuizMode();
            else enterQuizMode();
        }
        if (data.message) {
            setMessages([
                ...messages,
                { message, type: "user", emotion: [] },
                { message: data.message, type: "model" },
              ]);
        }
      setLoading(false);
    });
    setMessage("");
  };

  const sendMessage = async (message) => {
    console.log(message);
    await new Promise((r) => setTimeout(r, 1000));
    const data = {
      message: "Hello!",
      quiz: true,
    };
    return data;
  };

  const handleMic = async () => {
    if (
      readyState === VoiceReadyState.CONNECTED ||
      readyState === VoiceReadyState.OPEN
    ) {
      disconnect();
      // add up top 3 emotions from each message
      let emotions = {};
      for (let m of audioMessages.filter((m) => m.type === "user_message")) {
        for (let e of Object.keys(m.models.prosody.scores)) {
          if (emotions[e]) {
            emotions[e] += m.models.prosody.scores[e];
          } else {
            emotions[e] = m.models.prosody.scores[e];
          }
        }
      }
      // get top 3 emotions
      let top3 = Object.keys(emotions)
        .sort((a, b) => emotions[b] - emotions[a])
        .slice(0, 3);
      // send message
      setMessages([...messages, { message, type: "user", emotion: top3 }]);
      sendMessage({ message, emotion: top3 }).then((botMessage) => {
        setMessages([
          ...messages,
          { message, type: "user", emotion: top3 },
          { message: botMessage, type: "model" },
        ]);
        setLoading(false);
        setMessage("");
      });
    } else {
      connect().then(() => {});
    }
  };

  const enterQuizMode = async () => {
    setQuizMode(true);
    setMessages([
      ...messages,
      { message: "Entering quiz mode...", type: "model" },
    ]);
  };

  const exitQuizMode = async () => {
    setQuizMode(false);
    setMessages([
      ...messages,
      { message: "Exiting quiz mode.", type: "model" },
    ]);
  };

  return (
    <main
      className={`flex h-screen flex-col items-center justify-between ${inter.className}`}
    >
      {/* container in the middle vertically + horizontally */}
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <h1 className="mb-4 text-transparent text-4xl bg-clip-text bg-gradient-to-br from-sky-200 to-blue-600">
          Accel
        </h1>
        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Quiz Mode
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            onChange={(e) => {
              if (e.target.checked) {
                enterQuizMode();
              } else {
                exitQuizMode();
              }
            }}
            // if quizMode is true, set the checkbox to checked
            checked={quizMode}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-br from-sky-200 to-blue-600"></div>
        </label>
        <div className="h-2/3 w-2/3">
          <ScrollContainer>
            {messages.map((m, i) => {
              if (m.type == "model") {
                return (
                  <div
                    className={
                      "flex mb-4 cursor-pointer mx-4" + (i == 0 ? " mt-4" : "")
                    }
                    key={i}
                  >
                    <div className="flex max-w-full bg-white rounded-lg py-2 px-4 gap-3">
                      <div className="text-gray-700">
                        <Markdown className="divrose">{m.message}</Markdown>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    className={
                      "flex mb-4 justify-end cursor-pointer mx-4" +
                      (i == 0 ? " mt-4" : "")
                    }
                    key={i}
                  >
                    <div className="flex max-w-96 bg-transparent border-white border text-white rounded-lg py-2 px-4 gap-3 text-wrap break-words">
                      <p className="w-full">{m.message}</p>
                    </div>
                  </div>
                );
              }
            })}
            {loading && (
              <div className="flex mb-4 cursor-pointer mx-4">
                <div className="flex max-w-96 bg-white rounded-lg px-4 py-4 gap-3">
                  <TypingAnimation />
                </div>
              </div>
            )}
          </ScrollContainer>
        </div>

        <footer className="fixed p-0 absolute bottom-0 h-20 flex items-center w-2/3 rounded-br-lg">
          <div className="flex items-center p-4 items-center w-full">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 rounded-md border border-white bg-transparent text-white"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <button
              className={
                "bg-transparent border-white border text-white text-md px-4 py-2 ml-2 rounded-lg hover:bg-white hover:text-black duration-500" +
                (readyState === VoiceReadyState.CONNECTED ||
                readyState === VoiceReadyState.OPEN
                  ? " bg-red-500"
                  : "")
              }
              onClick={handleMic}
            >
              <Microphone />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
