import ChatbotWidget from "./chatbot.js";

// Handle iframe loading error
window.handleIframeError = () => {
    document.getElementById("iframe-error").classList.remove("hidden");
};

// Initialize chatbot when page loads
document.addEventListener("DOMContentLoaded", () => {
    new ChatbotWidget("cec-chatbot-container");
});