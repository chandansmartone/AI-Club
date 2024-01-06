"use client"
import { useEffect } from "react"
import {Crisp} from"crisp-sdk-web";

export const CrispChat=()=>{
    useEffect(()=>{
        Crisp.configure("8de1c88b-76aa-4cc4-89c5-906a2f0b4df9")
    },[]);
    return null;
}