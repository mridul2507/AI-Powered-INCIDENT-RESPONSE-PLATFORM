"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");  
  const [messages, setMessages] = useState<
  {
    role: "user" | "assistant";
    content: string;
  }[]
>([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const [pageContext, setPageContext] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, displayedText]);

  useEffect(() => {
    localStorage.setItem(
      "ai-chat-history",
      JSON.stringify(messages)
    );

  }, [messages]);

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "ai-chat-history"
      );

    if (stored) {
      setMessages(
        JSON.parse(stored)
      );
    }

  }, []);

  useEffect(() => {
    async function fetchContext() {

      if (!pathname.startsWith("/incidents/"))
        return;

      const id =
        pathname.split("/")[2];

      const res = await fetch(
        `/api/incidents/${id}`
      );

      const incident =
        await res.json();

      setPageContext(
  `
  Title:
  ${incident.title}

  Description:
  ${incident.description}

  Severity:
  ${incident.severity}

  Status:
  ${incident.status}

  Service:
  ${incident.service?.name}
  `
      );

    }

    fetchContext();

  }, [pathname]);
  

  async function handleSend() {

    if (!input.trim() || loading)
      return;

    const userMessage = {
      role: "user" as const,
      content: input,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setInput("");

    try {
      setLoading(true);
      const res = await fetch(
        "/api/ai-chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message:
              userMessage.content,

            pathname,

            context:
              pageContext,

            messages:
              updatedMessages,
          }),
        }
      );

      const data = await res.json();

      setDisplayedText("");

      for (let i = 0;i <= data.reply.length;i++) {
        setDisplayedText(
          data.reply.slice(0, i)
        );
        await new Promise(
          resolve => setTimeout(resolve, 10)
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply,
        },
      ]);

      setDisplayedText("");

    } 
    
    catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "AI service unavailable.",
        },
      ]);

    }

    finally {
      setLoading(false);
    }
  }
  return (
    
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className=" fixed bottom-8 right-8 bg-green-700 text-white p-4 rounded-full shadow-xl transition-all z-50"
      >
        <Bot size={24} />
      </button>

      {open && (
        <div
          className="fixed bottom-28 right-8 
             w-full max-w-sm h-[75vh] 
             bg-white dark:bg-emerald-950
             border dark:border-slate-700 
             rounded-3xl shadow-2xl z-50 p-4 
             flex flex-col"
        >

          <div className="flex items-center gap-2 mb-4">
            <Bot className="text-green-600" />

            <div className="flex items-center justify-between w-full">
                <h2 className=" text-xl font-bold text-green-900 dark:text-green-400">
                    IR Assist Copilot
                </h2>

                <X
                size={20}
                onClick={()=>setOpen(false)}
                className=" cursor-pointer text-gray-500 hover:text-red-500 "/>
            </div>
          </div>

          {/* Messages */}

          <div className=" flex-1 overflow-y-auto space-y-4 p-2 mb-4">

            {messages.length === 0 ? (
              <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-4 max-w-[85%]">
                  <p className="font-semibold text-green-700">
                      IR Assist
                  </p>

                  <p className="mt-2 text-sm">
                      Hello 👋

                      Ask me anything about incidents,
                      logs, services, or system health.
                  </p>
              </div>

              ) : (

              messages.map((message,index)=>(
                <div
                  key={index}
                  className={` flex ${message.role==="user" ?"justify-end" :"justify-start"} `}>

                <div className={` w-fit max-w-[85%] rounded-2xl px-4 py-3 break-words
                  ${
                  message.role==="user"
                  ?
                  "bg-green-700 text-white"
                  :
                  "bg-gray-100 dark:bg-white text-black"
                  }
                  `}
                >

                <p>{message.content}</p>

                </div>
              </div>

                ))

              )}

              {
                displayedText && (
                <div className="flex justify-start">
                <div className=" w-fit max-w-[85%] bg-gray-100 dark:bg-white text-black rounded-2xl px-4 py-3 ">
                  {displayedText}
                </div>
                </div>
                )
              }
                <div ref={bottomRef}/>

            </div>

          {/* Input */}

          <div className=" border-t pt-4 flex gap-3">

            <input
                value={input}
                onChange={(e)=>setInput(e.target.value)}

                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}

                placeholder="Ask anything..."

                className=" flex-1 border rounded-2xl px-4 py-3 outline-none dark:bg-slate-900 "
                />

            <button
              onClick={handleSend}
              className=" bg-green-700 hover:bg-green-800 text-white p-4 rounded-2xl"
            >
              <Send size={18}/>
            </button>

          </div>

        </div>
      )}
    </>
  );
}