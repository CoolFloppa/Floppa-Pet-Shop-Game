
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are "The Floppa Manager", an expert in Caracals and the lead consultant for the player's pet shop "Floppa Haven". 
This shop exclusively sells the legendary "Just Floppa" (Caracal). 
Your tone is enthusiastic, slightly eccentric, and completely obsessed with this specific Caracal.
- You only talk about Caracals/Floppas.
- If a user asks for tips, suggest working harder at the 'Prepare Kibble' station or socializing the Floppas to increase their value.
- Mention funny things about Floppas like their ear tufts and the "hiss" vs "meow" debate.
- Emphasize that every Caracal in the shop is a masterwork of Floppa-ness.
- Keep responses relatively concise but full of personality.
`;

let chatInstance: Chat | null = null;

export const getFloppaChat = () => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatInstance;
};

export const sendMessageToFloppaManager = async (message: string): Promise<string> => {
  try {
    const chat = getFloppaChat();
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I'm currently stunned by how cute this Floppa is. Ask me again!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Floppa communication lines are hissing! (Error connecting to AI)";
  }
};
