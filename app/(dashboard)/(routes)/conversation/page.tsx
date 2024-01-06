"use client";
import { Heading } from "@/components/Heading";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { formSchema } from "./constans";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import OpenAI from "openai";
import { Loader } from "@/components/ui/Loader";
import axios from "axios";
import { Empty } from "@/components/Empty";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { userProModel } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";


const ConversationPage = () => {
  const proModal=userProModel()
    const router = useRouter();
    const [messages,setMessages]=useState< OpenAI.Chat.CreateChatCompletionRequestMessage[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          prompt: ""
        }
      });
      const isLoading = form.formState.isSubmitting;

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
          const userMessage: OpenAI.Chat.CreateChatCompletionRequestMessage={
           
            role:"user",
            content:values.prompt,
            
          };
          const newMessage=[...messages,userMessage];
          const response=await axios.post("api/conversation",{
            messages:newMessage,
          });
          setMessages((current)=>[...current,userMessage,response.data]);
          form.reset();
        }catch(error:any){
            if(error?.response?.status===403)
            {
              proModal.onOpen();
            }else{
              toast.error("something went wrong")
            }
        }finally{
            router.refresh();
        }
        
      }
    return (
    <div>
       <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
            render={({field})=>(
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
                <Empty label="No conversation started"/>
              </div>
          )}

             <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message,index) => (
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
                <div
                  className="text-sm overflow-hidden leading-7"
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      ? message.content.replace(/\n/g, "<br />")
                      : "",
                  }}
                />
              </div>
            ))}
          </div>
            </div>
            </div>
    </div>
    
    </div>
  )
}

export default ConversationPage
