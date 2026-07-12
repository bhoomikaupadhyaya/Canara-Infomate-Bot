import {
    GEMINI_API_KEY,
    COLLEGE_SITE_DOMAIN,
    SYSTEM_PROMPT,
    API_URL
} from "./config.js";

class ChatbotWidget {

    constructor(containerId) {

        this.container = document.getElementById(containerId);

        if (!this.container) {
            console.error("Chatbot container not found.");
            return;
        }

        this.isOpen = false;

        this.messages = [
            {
                sender: "bot",
                text: "Hello! I am CEC-Bot, the official assistant for Canara Engineering College. How can I help you today?"
            }
        ];

        this.init();
    }

    init() {
        this.render();
    }

    render() {

        this.container.innerHTML = `

<!-- Toggle Button -->

<button id="cec-chat-toggle"
title="Open Chat"
class="cec-chat-toggle-button ${this.isOpen ? "hidden" : "flex"} bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg items-center justify-center hover:bg-blue-700 transition-all">

<svg xmlns="http://www.w3.org/2000/svg"
class="w-8 h-8"
fill="none"
viewBox="0 0 24 24"
stroke="currentColor"
stroke-width="2">

<path
stroke-linecap="round"
stroke-linejoin="round"
d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>

</svg>

</button>


<div
id="cec-chat-window"
class="cec-chat-window ${this.isOpen ? "flex" : "hidden"} bg-white rounded-lg flex-col overflow-hidden transform scale-100">

<div class="bg-blue-600 text-white p-4 flex justify-between items-center">

<h3 class="text-lg font-semibold">

Canara Engineering College

</h3>

<button
id="cec-chat-close"
title="Close Chat"
class="text-white hover:text-gray-200">

<svg xmlns="http://www.w3.org/2000/svg"
class="w-6 h-6"
fill="none"
viewBox="0 0 24 24"
stroke="currentColor"
stroke-width="2">

<path
stroke-linecap="round"
stroke-linejoin="round"
d="M6 18L18 6M6 6l12 12"/>

</svg>

</button>

</div>


<div
id="cec-chat-messages"
class="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">

${this.renderMessages()}

</div>


<div
id="cec-typing-indicator"
class="p-4 pt-0 hidden">

<div class="flex items-center space-x-2">

<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0s;"></div>

<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.2s;"></div>

<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.4s;"></div>

</div>

</div>


<div class="p-4 border-t border-gray-200 bg-white">

<div class="flex space-x-2">

<input
type="text"
id="cec-chat-input"
placeholder="Ask a question..."
class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">

<button
id="cec-chat-send"
class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">

Send

</button>

</div>

</div>

</div>

`;

        this.addEventListeners();
        this.scrollToBottom();

    }

    renderMessages() {

        return this.messages.map(msg => {

            if (msg.sender === "bot") {

                return `

<div class="flex">

<div class="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md">

<p class="font-bold">

${msg.text}

</p>

${msg.sources ? this.renderSources(msg.sources) : ""}

</div>

</div>

`;

            }

            return `

<div class="flex justify-end">

<div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md">

${msg.text}

</div>

</div>

`;

        }).join("");

    }

    renderSources(sources){

        if(!sources || sources.length===0)
            return "";

        return `

<div class="mt-2 pt-2 border-t border-gray-300">

<h4 class="text-xs font-semibold text-gray-600 mb-1">

Sources

</h4>

<ul class="space-y-1">

${sources.map(source=>`

<li>

<a
href="${source.uri}"
target="_blank"
class="text-xs text-blue-600 hover:underline">

${source.title || source.uri}

</a>

</li>

`).join("")}

</ul>

</div>

`;

    }
        addEventListeners() {

        document
            .getElementById("cec-chat-toggle")
            ?.addEventListener("click", () => this.toggleChat(true));

        document
            .getElementById("cec-chat-close")
            ?.addEventListener("click", () => this.toggleChat(false));

        document
            .getElementById("cec-chat-send")
            ?.addEventListener("click", () => this.handleSend());

        document
            .getElementById("cec-chat-input")
            ?.addEventListener("keydown", (e) => {

                if (e.key === "Enter") {
                    this.handleSend();
                }

            });

    }


    toggleChat(isOpen) {

        this.isOpen = isOpen;

        this.render();

        if (isOpen) {

            document
                .getElementById("cec-chat-input")
                ?.focus();

        }

    }


    handleSend() {

        const input = document.getElementById("cec-chat-input");

        const text = input.value.trim();

        if (!text)
            return;

        this.addMessage(text, "user");

        input.value = "";

        this.showTyping(true);

        this.getBotResponse(text);

    }


    addMessage(text, sender, sources = null) {

        this.messages.push({
            text,
            sender,
            sources
        });

        const messageContainer =
            document.getElementById("cec-chat-messages");

        if (messageContainer) {

            messageContainer.innerHTML =
                this.renderMessages();

            this.scrollToBottom();

        }

    }


    showTyping(isTyping) {

        const indicator =
            document.getElementById("cec-typing-indicator");

        if (!indicator)
            return;

        indicator.classList.toggle(
            "hidden",
            !isTyping
        );

    }


    scrollToBottom() {

        const container =
            document.getElementById("cec-chat-messages");

        if (!container)
            return;

        container.scrollTop =
            container.scrollHeight;

    }
        async getBotResponse(userQuery) {

        if (!GEMINI_API_KEY) {

            this.addMessage(
                "API key not configured. Please add your Gemini API key.",
                "bot"
            );

            this.showTyping(false);

            return;
        }

        const groundedQuery =
            `${userQuery} Canara Engineering College ${COLLEGE_SITE_DOMAIN}`;

        const payload = {

            contents: [
                {
                    parts: [
                        {
                            text: groundedQuery
                        }
                    ]
                }
            ],

            tools: [
                {
                    google_search: {}
                }
            ],

            systemInstruction: {
                parts: [
                    {
                        text: SYSTEM_PROMPT
                    }
                ]
            }

        };

        try {

            const response = await this.fetchWithBackoff(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {

                throw new Error(
                    `API Error : ${response.statusText}`
                );

            }

            const result = await response.json();

            const candidate = result.candidates?.[0];

            const text =
                candidate?.content?.parts?.[0]?.text;

            let sources = [];

            const grounding =
                candidate?.groundingMetadata;

            if (
                grounding &&
                grounding.groundingAttributions
            ) {

                sources =
                    grounding.groundingAttributions
                        .map(attr => ({
                            uri: attr.web?.uri,
                            title: attr.web?.title
                        }))
                        .filter(source =>
                            source.uri &&
                            source.uri.includes(
                                COLLEGE_SITE_DOMAIN
                            )
                        );

            }

            if (text) {

                this.addMessage(
                    text,
                    "bot",
                    sources
                );

            } else {

                this.addMessage(
                    "Sorry, I couldn't generate a response.",
                    "bot"
                );

            }

        }
        catch (error) {

            console.error(error);

            this.addMessage(
                "Sorry, I'm having trouble connecting right now. Please try again later.",
                "bot"
            );

        }
        finally {

            this.showTyping(false);

        }

    }



    async fetchWithBackoff(
        url,
        options,
        maxRetries = 5
    ) {

        let delay = 1000;

        for (
            let i = 0;
            i < maxRetries;
            i++
        ) {

            try {

                const response =
                    await fetch(url, options);

                if (
                    !response.ok &&
                    i < maxRetries - 1
                ) {

                    if (
                        response.status >= 400 &&
                        response.status < 500
                    ) {

                        break;

                    }

                    throw new Error(
                        response.statusText
                    );

                }

                return response;

            }
            catch (error) {

                if (i < maxRetries - 1) {

                    await new Promise(resolve =>
                        setTimeout(resolve, delay)
                    );

                    delay *= 2;

                }
                else {

                    throw error;

                }

            }

        }

    }

}

export default ChatbotWidget;