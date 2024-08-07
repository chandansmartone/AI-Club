"use client";
import React, { useState, useEffect } from "react";
import { Heading } from "@/components/Heading";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { formSchema } from "./constans";
import { Input } from "@/components/ui/input";
import OpenAI from "openai";
import { Loader } from "@/components/ui/Loader";
import axios from "axios";
import { Empty } from "@/components/Empty";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";
import { Code2 } from "lucide-react";
import { userProModel } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';


const Code = () => {
  const ProModal = userProModel();
  const router = useRouter();
  const [messages, setMessages] = useState<OpenAI.Chat.CreateChatCompletionRequestMessage[]>([]);
  const [copy, setCopy] = useState("Copy");
  const [txtcopy, setTxtcopy] = useState("");
 

  // Replace this with the actual way to get the user's ID
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
     
        const localUserId = localStorage.getItem('clerk-db-jwt');
        if (localUserId) {
          setUserId(localUserId);
        } 
        console.log(userId);
        
      
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    // Load messages from local storage when the component mounts
    if (userId) {
      const storedMessages = localStorage.getItem(`messages_${userId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    }
  }, [userId]);

  useEffect(() => {
    // Save messages to local storage whenever they change
    if (userId) {
      localStorage.setItem(`messages_${userId}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessage = [...messages, userMessage];
      const response = await axios.post("api/code", {
        messages: newMessage,
      });
      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        ProModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };

  const handleCopy = (textToCopy: any) => {
    setTxtcopy(textToCopy.props?.children);
    return txtcopy;
  };

  const customTheme = {
    'code[class*="language-"]': {
      color: '#f8f8f2',
      background: 'none',
      fontFamily: 'Inconsolata, Monaco, Consolas, "Courier New", Courier, monospace',
      fontSize: '16px',
      textAlign: 'left',
      whiteSpace: 'pre-wrap',
      wordSpacing: 'normal',
      wordBreak: 'normal',
      lineHeight: '1.5',
      tabSize: 4,
      hyphens: 'none',
    },
    'pre[class*="language-"]': {
      color: '#f8f8f2',
      background: '#282a36',
      overflow: 'auto',
      position: 'relative',
      margin: '0.5em 0',
      padding: '1.25em',
      borderRadius: '0.3em',
    },
    '.token.function': {
      color: '#50fa7b',
    },
    '.token.class-name': {
      color: '#bd93f9',
    },
    '.token.keyword, .token.operator': {
      color: '#ff79c6',
    },
  };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code2}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none 
                        focus-visible:ring-0 
                        focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                Generate
              </Button>
            </form>
          </Form>
        </div>
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        <div className="space-y-4 mt-4">
          <div>
            {messages.length === 0 && !isLoading && (
              <div>
                <Empty label="No conversation started" />
              </div>
            )}

            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                    message.role === "user"
                      ? "bg-white border border-black border-opacity-10"
                      : "bg-muted"
                  )}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg relative">
                          <CopyToClipboard text={String(handleCopy(props.children))} onCopy={() => {
                            setCopy("Copied");
                            setTimeout(() => setCopy("Copy"), 2000);
                          }}>
                            <button className="absolute top-2 right-2 bg-blue-500 text-white px-2 rounded-md cursor-pointer">
                              {copy}
                            </button>
                          </CopyToClipboard>
                          <SyntaxHighlighter language="javascript" style={dracula}>
                            {React.isValidElement(props.children) ? String(props.children.props?.children) : ''}
                          </SyntaxHighlighter>
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code className="bg-black/30 rounded-lg p-1" {...props} />
                      ),
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {typeof message.content === 'string' ? message.content : ''}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Code;
