import {auth} from "@clerk/nextjs"
import prismadb from "./prismadb"
const DAY_IN_MS=86_400_000

export const checkSubscription=async()=>{
    const {userId}=await auth()
    if(!userId)return false


    const userSubscription=await prismadb.userSubscription.findUnique({
        where:{
            userId:userId,
        },
        select:{
            stripeCurrentPeriodEnd:true,
            stripePriceId:true,
            stripeSubScriptionId:true,
            stripeCustomerId:true
        }
    })
    if(!userSubscription){
        return false;
    }
    const isvalid=userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()!+DAY_IN_MS>Date.now();
    return !!isvalid;
}

