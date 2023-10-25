import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";

import { BsChevronDown, BsPlusLg } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import useAnalytics from "@/hooks/useAnalytics";
import { startChat, continueChat, Response } from "@/pages/api/generalAPI";
import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import Message from "./Message";
import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";

const Chat = (props: any) => {
  const { toggleComponentVisibility } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmptyChat, setShowEmptyChat] = useState(true);
  const [conversation, setConversation] = useState<any[]>([]);
  const [chatId, setChatId] = useState("")
  const [message, setMessage] = useState("");
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  const selectedModel = DEFAULT_OPENAI_MODEL;

  useEffect(() => {
    // TODO: REQUEST A chat_id 
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "24px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message, textAreaRef]);

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const sendMessage = async (e: any) => {
    // Don't send empty messages
    e.preventDefault();
    if (message.length < 1) {
      setErrorMessage("Please enter a message.");
      return;
    } else {
      setErrorMessage("");
    }

    setIsLoading(true);

    // Add the message to the conversation
    setConversation([
      ...conversation,
      { content: message, role: "user" },
      { content: null, role: "system" },
    ]);

    // Clear the message & remove empty chat
    setMessage("");
    setShowEmptyChat(false);

    try {
      let data: Response;
      if(chatId == "") {
        data  = await startChat(message)
        if(data.error) {
          setErrorMessage(data.message || "");
        } else {
          setConversation([
                ...conversation,
                { content: message, role: "user" },
                { content: data.message, role: "system" },
              ]);
        }
        setChatId(data.chatId || "")
      } else {
        data  = await continueChat(message, chatId)
        if(data.error) {
          setErrorMessage(data.message || "");
        } else {
          setConversation([
                ...conversation,
                { content: message, role: "user" },
                { content: data.message, role: "system" },
              ]);
        }
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);

      setIsLoading(false);
    }
  };

  const onButtonPress = async (e: any, message: string) => {
    setConversation([
      ...conversation,
      { content: message, role: "user" },
      { content: null, role: "system" },
    ]);
    setShowEmptyChat(false);

    try {
      let data: Response;
      if(chatId == "") {
        data  = await startChat(message)
        if(data.error) {
          setErrorMessage(data.message || "");
        } else {
          setConversation([
                ...conversation,
                { content: message, role: "user" },
                { content: data.message, role: "system" },
              ]);
        }
        setChatId(data.chatId || "")
      } else {
        data  = await continueChat(message, chatId)
        if(data.error) {
          setErrorMessage(data.message || "");
        } else {
          setConversation([
                ...conversation,
                { content: message, role: "user" },
                { content: data.message, role: "system" },
              ]);
        }
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);

      setIsLoading(false);
    }
  }

  const handleKeypress = (e: any) => {
    // It's triggers by pressing the enter key
    if (e.keyCode == 13 && !e.shiftKey) {
      sendMessage(e);
      e.preventDefault();
    }
  };

  return (
    <div className="flex max-w-full flex-1 flex-col">
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="react-scroll-to-bottom--css-ikyem-79elbk h-full dark:bg-gray-800">
            <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">
              {!showEmptyChat && conversation.length > 0 ? (
                <div className="flex flex-col items-center text-sm bg-gray-800">
                  {/* <div className="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">
                    Model: {selectedModel.name}
                  </div> */}
                  {conversation.map((message, index) => (
                    <Message key={index} message={message} />
                  ))}
                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                  <div ref={bottomOfChatRef}></div>
                </div>
              ) : null}
              <div className="flex flex-col items-center text-sm dark:bg-gray-800"></div>
              {showEmptyChat ? (
                <div className="py-10 relative w-full flex flex-col gap-2 h-full">    
                  <h1 className=" text-2xl sm:text-4xl font-semibold text-center text-gray-200 dark:text-gray-600 flex gap-2 items-center justify-center h-screen">
                    BizChat
                  </h1>
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative w-full md:w-1/3 lg:w-1/6">
                      <button
                        className="relative flex w-full cursor-default flex-col rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-white/20 dark:bg-gray-800 sm:text-sm align-center"
                        id="headlessui-listbox-button-:r0:"
                        type="button"
                        onClick={(e) => onButtonPress(e, "What are the different business packages available at DMCC for setting up a business?")}
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-headlessui-state=""
                        aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
                      >
                        <span className="inline-flex w-full truncate">
                          <span className="flex h-6 items-center gap-1 truncate text-white">
                            Enquire About packages
                          </span>
                        </span>
                        <label
                          className="block text-xs text-gray-700 dark:text-gray-500 line-clamp-1"
                          id="headlessui-listbox-label-:r1:"
                          data-headlessui-state=""
                        >
                          What are the different business packages available at DMCC for setting up a business?
                        </label>
                      </button>
                    </div>
                    <div className="relative w-full md:w-1/3 lg:w-1/6">
                      <button
                        className="relative flex w-full cursor-default flex-col rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-white/20 dark:bg-gray-800 sm:text-sm align-center"
                        id="headlessui-listbox-button-:r0:"
                        type="button"
                        onClick={(e) => onButtonPress(e, "What are the specific document requirements I need before starting the application process?")}
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-headlessui-state=""
                        aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
                      >
                        <span className="inline-flex w-full truncate">
                          <span className="flex h-6 items-center gap-1 truncate text-white">
                            Document Required
                          </span>
                        </span>
                        <label
                          className="block text-xs text-gray-700 dark:text-gray-500 line-clamp-1"
                          id="headlessui-listbox-label-:r1:"
                          data-headlessui-state=""
                        >
                          What are the specific document requirements I need before starting the application process?
                        </label>
                      </button>
                    </div>
                    
                  </div>
                  <div className="flex items-center justify-center gap-2 pb-12">
                  <div className="relative w-full md:w-1/3 lg:w-1/6">
                      <button
                        className="relative flex w-full cursor-default flex-col rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-white/20 dark:bg-gray-800 sm:text-sm align-center"
                        id="headlessui-listbox-button-:r0:"
                        type="button"
                        onClick={(e) => onButtonPress(e, "What's the minimum capital requirement to set up a company in DMCC?")}
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-headlessui-state=""
                        aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
                      >
                        <span className="inline-flex w-full truncate">
                          <span className="flex h-6 items-center gap-1 truncate text-white">
                            Minium Capital Required for DMCC
                          </span>
                        </span>
                        <label
                          className="block text-xs text-gray-700 dark:text-gray-500 line-clamp-1"
                          id="headlessui-listbox-label-:r1:"
                          data-headlessui-state=""
                        >
                          What is the minimum capital requirement to set up a company in DMCC?
                        </label>
                      </button>
                    </div>
                    <div className="relative w-full md:w-1/3 lg:w-1/6">
                      <button
                        className="relative flex w-full cursor-default flex-col rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-white/20 dark:bg-gray-800 sm:text-sm align-center"
                        id="headlessui-listbox-button-:r0:"
                        type="button"
                        onClick={(e) => onButtonPress(e, "What is the difference between the Basic Biz Package and the Jump Start Package?")}
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-headlessui-state=""
                        aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
                      >
                        <span className="inline-flex w-full truncate">
                          <span className="flex h-6 items-center gap-1 truncate text-white">
                          Basic Biz Package Vs Jump Start Package
                          </span>
                        </span>
                        <label
                          className="block text-xs text-gray-700 dark:text-gray-500 line-clamp-1"
                          id="headlessui-listbox-label-:r1:"
                          data-headlessui-state=""
                        >
                          What is the difference between the Basic Biz Package and the Jump Start Package?
                        </label>
                      </button>
                    </div>
                    
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
          <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
              {errorMessage ? (
                <div className="mb-2 md:mb-0">
                  <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea
                  ref={textAreaRef}
                  value={message}
                  tabIndex={0}
                  data-id="root"
                  style={{
                    height: "24px",
                    maxHeight: "200px",
                    overflowY: "hidden",
                  }}
                  // rows={1}
                  placeholder="Send a message..."
                  className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeypress}
                ></textarea>
                <button
                  disabled={isLoading || message?.length === 0}
                  onClick={sendMessage}
                  className="absolute p-1 rounded-md bottom-1.5 md:bottom-2.5 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                >
                  <FiSend className="h-4 w-4 mr-1 text-white " />
                </button>
              </div>
            </div>
          </form>
          {/* <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
            <span>
              ChatGPT Clone may produce inaccurate information about people,
              places, or facts.
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Chat;
