import React, { useState } from "react";
import { Container, VStack, Input, Button, Text, Select } from "@chakra-ui/react";
import axios from "axios";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post("https://api.example.com/chat", { message: input });
      const botMessage = { text: response.data.reply, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  const handleTranslate = async (text, targetLang) => {
    try {
      const response = await axios.post("https://translation.googleapis.com/language/translate/v2", {
        q: text,
        target: targetLang,
        key: "YOUR_GOOGLE_TRANSLATE_API_KEY",
      });
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Error translating message:", error);
      return text;
    }
  };

  const handleLanguageChange = async (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);

    const translatedMessages = await Promise.all(
      messages.map(async (message) => {
        const translatedText = await handleTranslate(message.text, selectedLanguage);
        return { ...message, text: translatedText };
      })
    );

    setMessages(translatedMessages);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </Select>
        <VStack spacing={2} width="100%" maxH="60vh" overflowY="auto" border="1px solid #ccc" borderRadius="md" p={4}>
          {messages.map((message, index) => (
            <Text key={index} alignSelf={message.sender === "user" ? "flex-end" : "flex-start"} bg={message.sender === "user" ? "blue.100" : "gray.100"} p={2} borderRadius="md">
              {message.text}
            </Text>
          ))}
        </VStack>
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
        <Button onClick={handleSend} colorScheme="blue">Send</Button>
      </VStack>
    </Container>
  );
};

export default Index;