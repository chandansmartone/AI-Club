"use client"
import { Badge } from "./ui/badge";
import {Check, Code, ImageIcon, MessageSquare, Music, VideoIcon, Zap } from "lucide-react";

import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription, DialogFooter } from "./ui/dialog"
import { userProModel } from "@/hooks/use-pro-model"
import { tools } from "@/constants";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
const ProModal = () => {
    const proModal=userProModel();
    const[loading,setLoading]=useState(false);
    const onSubscribe=async ()=>{
      try{
        setLoading(true)
        const response= await axios.get("/api/stripe");
        window.location.href=response.data.url;
      }catch(er:any){
        console.log(er,"STRIPE_CLIENT_ERROR");
      }finally{
        setLoading(false)
      } 
    }
   return (
    <div>
      <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose} >
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                <div className="flex items-center gap-x-2 font -bold py-1">
                Upgrade to Genius
                <Badge className="uppercase text-sm py-1" variant="premium">Pro</Badge> 
                </div>
                </DialogTitle>
                <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                    {tools.map((tool)=>(
                        <Card key={tool.href} className="p-3 border-black/5 flex items-center justify-between">
                        <div className="flex items-center gap-x-4">
                          <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                            <tool.icon className={cn("w-6 h-6", tool.color)} />
                          </div>
                          <div className="font-semibold text-sm">
                            {tool.label}
                          </div>
                        </div>
                        <Check className="text-primary w-5 h-5" />
                      </Card>
                    ))}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
          <Button size="lg" variant="premium" className="w-full" onClick={onSubscribe}>
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default ProModal
