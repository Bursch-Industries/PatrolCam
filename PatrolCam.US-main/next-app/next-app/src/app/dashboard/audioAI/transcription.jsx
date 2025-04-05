// component for audio ai page that will take in the json transcription and format and style it for a clean viewing experience
'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export default function Transcription({ audioData }) {
    const lines = audioData.result.transcript.split("\n");
    const hasSuspiciousWords = audioData.result.has_suspicious_words // will be true if transcription has suspicious words, false for if not
    const suspiciousWords = audioData.result.suspicious_words // list of suspicious words from transcript
    const messages = [] // use to store messages from data
    let currentSpeaker = "" // track the current speaker
    let currentText = "" // track the current text
    let currentTimestamp = "" // track the current timestamp

    // loop over the transcript lines
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (line.startsWith("Speaker ") && line.includes(":")){
            // If we have a previous message, save it
            if (currentSpeaker && currentText) {
                messages.push({
                    speaker: currentSpeaker,
                    text: currentText,
                    timestamp: currentTimestamp,
                })
            }

            // Start a new message
            const parts = line.split(":")
            currentSpeaker = parts[0] // Speaker
            currentText = parts.slice(1).join(":").trim() // message text
            currentTimestamp = "" // timestamp hasnt been found yet

        } else if (line.startsWith("Timestamp:")) {
            currentTimestamp = line.replace("Timestamp:", "").trim()
        } else if (line && currentSpeaker) {
            // continue the current message
            currentText += " " + line
        }

    }
    // add the last message
    if (currentSpeaker && currentText) {
        messages.push({
            speaker: currentSpeaker,
            text: currentText,
            timestamp: currentTimestamp,
        })
    };
    
    return (
        <Tabs defaultValue="conversation" className="flex items-center">
            <TabsList>
                <TabsTrigger value="conversation" className="p-5 font-bold text-lg hover:cursor-pointer">Conversation</TabsTrigger>
                <TabsTrigger value="summary" className="p-5 font-bold text-lg hover:cursor-pointer">Summary</TabsTrigger>
                <TabsTrigger value="suspiciousWords" className="p-5 font-bold text-lg hover:cursor-pointer">Suspicious Words</TabsTrigger>
            </TabsList>
            {/* conversation tab*/}
            <TabsContent value="conversation">
                <Card>
                    <CardHeader>
                        <CardTitle><span className="text-3xl font-bold">Conversation</span></CardTitle>
                        <CardDescription>
                            <span className="font-semibold">TranscriptionId:</span> {audioData.result.transactionId}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {messages.map((message, index) => {
                            return ( 
                                <div key={index}>
                                    <p className="text-lg"><span className="font-semibold">{message.speaker}:</span> {message.text} {message.timestamp}</p>
                                </div>
                            )
                        })}
                    </CardContent>
                    <CardFooter />
                </Card>                
            </TabsContent>

            {/* Summary tab */}
            <TabsContent value="summary">
                <Card>
                    <CardHeader>
                        <CardTitle><span className="text-3xl font-bold">Summary</span></CardTitle>
                        <CardDescription>
                            <span className="text-lg font-semibold">Summary of the transcription</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg">{audioData.result.summary}</p>
                    </CardContent>
                    <CardFooter />
                </Card>
            </TabsContent>

            {/* Suspicious words tab */}
            <TabsContent value="suspiciousWords">
                <Card>
                    <CardHeader>
                        <CardTitle><span className="text-3xl font-bold">Suspicious Words</span></CardTitle>
                        <CardDescription>
                            <span className="text-lg font-bold">Suspicious words from the transcription</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasSuspiciousWords ? (
                            suspiciousWords.map((context, index) => {
                                return (
                                    <div key={index}>
                                        <p className="text-lg"><span className="font-semibold">{context.word}: </span>{context.sentence}</p>
                                    </div>
                                )
                            })
                        ) : (
                            <p>This transcription contains no suspicious words.</p>
                        )}
                    </CardContent>
                    <CardFooter />
                </Card>
            </TabsContent>
        </Tabs>
    )
}