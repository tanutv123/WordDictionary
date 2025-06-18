import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";

function ChatBox() {
    const [chatInput, setChatInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    // Chatbot state
    const [chatMessages, setChatMessages] = useState([
        {
            id: "1",
            sender: "ai",
            text: "Hello! I'm your Dictionary Assistant. I can help you with word definitions, synonyms, examples, and more. What would you like to know?",
            timestamp: "10:30 AM",
        },
        {
            id: "2",
            sender: "user",
            text: "What's the difference between happy and joyful?",
            timestamp: "10:31 AM",
        },
        {
            id: "3",
            sender: "ai",
            text: "Great question! Both 'happy' and 'joyful' describe positive emotions, but there are subtle differences:\n\n• **Happy** is a general state of contentment or pleasure\n• **Joyful** implies a more intense, exuberant form of happiness\n\nJoyful often suggests celebration or triumph, while happy can be more subdued and everyday.",
            timestamp: "10:31 AM",
        },
    ])

    const quickActions = ["Define a word", "Find synonyms", "Word examples", "Add new word"]

    // Simulated AI responses
    const getAIResponse = (userMessage: string): string => {
        const message = userMessage.toLowerCase()

        if (message.includes("define") || message.includes("definition")) {
            return "I'd be happy to help you define a word! You can either ask me about a specific word, or use the dictionary interface to add and edit definitions directly."
        }

        if (message.includes("synonym")) {
            return "For synonyms, you can expand any word card in your dictionary to see its synonyms. You can also add new synonyms using the 'Add Synonym' button when a word is expanded."
        }

        if (message.includes("example")) {
            return "To see examples, click the book icon next to any synonym. You can add, edit, or delete examples for each synonym to better understand how words are used in context."
        }

        if (message.includes("add") || message.includes("new")) {
            return "To add a new word, click the 'Add Word' button at the top of the dictionary. You can then fill in the word, definition, additional information, and category."
        }

        if (message.includes("category") || message.includes("filter")) {
            return "You can filter words by category using the dropdown in the filter section. Categories help organize your dictionary by topics like 'Emotions', 'Appearance', etc."
        }

        if (message.includes("search")) {
            return "Use the search bar to find words by name or definition. The search works in real-time as you type, and you can combine it with category filters."
        }

        return "I understand you're asking about dictionary features. I can help you with word definitions, synonyms, examples, adding new words, categories, and search functionality. What specific aspect would you like to know more about?"
    }

    // Send message function
    const sendMessage = () => {
        if (!chatInput.trim()) return

        const userMessage = {
            id: `msg-${Date.now()}`,
            sender: "user" as const,
            text: chatInput,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setChatMessages((prev) => [...prev, userMessage])
        setChatInput("")
        setIsTyping(true)

        // Simulate AI response delay
        setTimeout(
            () => {
                const aiResponse = {
                    id: `ai-${Date.now()}`,
                    sender: "ai" as const,
                    text: getAIResponse(chatInput),
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }

                setChatMessages((prev) => [...prev, aiResponse])
                setIsTyping(false)
            },
            1000 + Math.random() * 1000,
        ) // Random delay between 1-2 seconds
    }

    // Handle quick actions
    const handleQuickAction = (action: string) => {
        setChatInput(action)
        setTimeout(() => sendMessage(), 100)
    }
    return (
        <Card className="h-[calc(100vh-8rem)] flex flex-col sticky top-8">
            {/* Chat Header */}
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    Dictionary Assistant
                </CardTitle>
                <CardDescription>Ask me anything about words, definitions, or synonyms!</CardDescription>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
                {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                message.sender === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            }`}
                        >
                            <p className="text-sm">{message.text}</p>
                            <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            {/* Chat Input */}
            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        placeholder="Ask about words, definitions, synonyms..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1"
                    />
                    <Button onClick={sendMessage} size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {quickActions.map((action) => (
                        <Button
                            key={action}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action)}
                            className="text-xs"
                        >
                            {action}
                        </Button>
                    ))}
                </div>
            </div>
        </Card>
    );
}

export default ChatBox;