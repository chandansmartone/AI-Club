import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { userProModel } from "@/hooks/use-pro-model";

interface FreeCountProps{
    apiLimitCount:number;
    isPro:boolean;
}
const FreeCounter = ({

    apiLimitCount=0,
    isPro=false
}:FreeCountProps) => {
    const proModal=userProModel();
    const [mounted ,setMounted]=useState(false);
    useEffect(()=>{
        setMounted(true);
    },[])
    if(!mounted){
        return null;
    }
    
    if(isPro){
        return null
    }
  return (
    <div className="px-3">
    <Card className="bg-white/10 border-0" >
        <CardContent className="py-6">
            <div className="text-center text-sm text-white mb-4 space-y-3">
                <p>
                    {apiLimitCount}/{MAX_FREE_COUNTS} free
                    Generation
                </p>
                <Progress 
                className="h-3"
                value={(apiLimitCount/MAX_FREE_COUNTS)*100}/>

            </div>
            <Button className="w-full" variant="premium" onClick={proModal.onOpen}>Upgrade<Zap className="w-4 g-4 fill-white"/></Button>
        </CardContent>
    </Card>
    </div>
  )
}

export default FreeCounter
