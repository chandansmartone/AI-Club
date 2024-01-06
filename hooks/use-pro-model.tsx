import {create }from "zustand";

interface userProModelStore{
    isOpen:boolean;
    onOpen:()=>void;
    onClose:()=>void;

}
export const userProModel=create<userProModelStore>((set)=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})

}))