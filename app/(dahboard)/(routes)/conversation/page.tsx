"use client"

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading"
import { MessageSquare } from "lucide-react"
import { useForm } from "react-hook-form"
import { formSchema } from "./constants";
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {ChatCompletionRequestMessage} from "openai";
import { useState } from "react";

const ConversationPage = () => {
    const router = useRouter()
    const [messages, setMessgaes] =  useState<ChatCompletionRequestMessage[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt:""
        }
    })

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try {
            const usermessage: ChatCompletionRequestMessage = {
                role: "user",
                content:values.prompt
            }
            const newMessages = [...messages, usermessage];
            const response = await axios.post("api/conversation", [
                messagesnewMessages,
            ])
            setMessages((current)=>[...current,userMessage, response.data])

            form.reset();
        } catch (error:any) {
            console.log(error);
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <Heading
            title="Conversation"
            description = "Generative Conversation"
            icon = {MessageSquare}
            iconColor = "text-violet-500"
            bgColor="bg-violet-500/10" 
            />
            <div className="px-4 lg:px:8">
                <div>
                    <Form {...form}>
                        <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="
                        rounded-lg borders w-full p-4 px-3 md:px-6
                        focus-within:shadow-sm grid grid-cols-12 gap-2
                        "
                        >
                            <FormField
                                name="prompt"
                                render={({field}) =>(
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input className="border-0 outline-none
                                            focus-visible:ring-0
                                            focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="What is my name"
                                            {...field}/>
                                        </FormControl>
                                    </FormItem>
                            )}/>
                            <Button className="col-span-12 lg:col-span-2"
                            disabled={isLoading}>
                                Generate
                            </Button>
                        </form>                     
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    <div className="flex flex-col-reverse mt- gap-y-4">
                        {messages.map((message)=> (
                            <div key={message.content}>
                                {message.content}
                            </div>                    
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConversationPage