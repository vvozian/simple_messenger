export type Message = {
    id: number;
    senderId: number;
    chatId: number;
    content: string;
    date: number; // Unix format
}