import { useState, useRef, useEffect } from "react"
import { Mic, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface VoiceInputBoxProps {
  value: string
  onChange: (value: string | ((prev: string) => string)) => void
  placeholder?: string
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export const VoiceInputBox = ({ value, onChange, placeholder }: VoiceInputBoxProps) => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        let transcript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }

        onChange((prev: string) => (prev + " " + transcript).trim())
      }

      recognition.onend = () => {
        // If user didn’t manually stop, restart listening
        if (isListening) {
          recognition.start()
        }
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      recognitionRef.current?.stop()
    }
  }, [isListening, onChange])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false)
      recognitionRef.current.stop()
    }
  }

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Enter your ingredients
            </label>
            {isSupported && (
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  "transition-all duration-300",
                  isListening && "animate-pulse-glow"
                )}
              >
                {isListening ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Voice
                  </>
                )}
              </Button>
            )}
          </div>

          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Type or speak your ingredients separated by commas"}
            className="min-h-[120px] resize-none"
            disabled={isListening}
          />

          {isListening && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Listening... Click stop when done.
            </div>
          )}

          {!isSupported && (
            <p className="text-xs text-muted-foreground">
              Voice input is not supported in this browser.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
