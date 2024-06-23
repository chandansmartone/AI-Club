"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { OpenAI } from "openai";  // Adjust the import if necessary

const Practice = () => {
    const [text, setText] = useState<string>("");
    const [messages, setMessages] = useState<OpenAI.Chat.CreateChatCompletionRequestMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const newMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
                role: "user",
                content: text
            };

            const res = await axios.post("/api/conversation", { messages: [...messages, newMessage] });
            const botResponse: OpenAI.Chat.CreateChatCompletionRequestMessage = {
                role: "assistant",
                content: res.data.content
            };

            setMessages((current) => [...current, newMessage, botResponse]);
            console.log(messages);
            
            setText("");  // Clear input after submission
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    return (
        <>
            <div className="px-2 m-auto w-[90%] border-2 mb-3 pb-2">
                <h1 className="m-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                    Code Generation
                </h1>
                <div className="flex mb-0">
                    <div className="flex-auto w-full mx-5">
                        <input
                            type="text"
                            className="w-full h-full border-0 focus:outline-none hover:border-none"
                            placeholder="type here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <div className="flex-auto w-24 text-base mr-4">
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Loading..." : "Submit"}
                        </Button>
                    </div>
                </div>
                
            </div>
            <div>
            {messages.length > 0 && (
                    <div className="mt-4">
                        {messages.map((msg, index) => (
                            <div key={index} className="p-2 border-b border-gray-300">
                                <strong>{msg.role}:</strong> {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Practice;
