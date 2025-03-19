import React, { useState, useEffect } from 'react';
import { database, auth } from '../../firebaseConfig';
import { ref, onValue, push, set } from 'firebase/database';
import { MdChat, MdClose } from 'react-icons/md';

interface ChatMessage {
  Sender: string;
  Text: string;
  Timestamp: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : 'anonymous');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const chatRef = ref(database, `ChatHistory/${userId}/messages`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(data ? Object.values(data) : []);
    });

    return () => unsubscribe();
  }, [userId]);

  const sendMessage = async () => {
    if (!input.trim() || !userId || isSending) return;
    setIsSending(true);

    const userMessage: ChatMessage = {
      Sender: 'user',
      Text: input,
      Timestamp: new Date().toISOString(),
    };

    const chatRef = ref(database, `ChatHistory/${userId}/messages`);
    const newMessageRef = push(chatRef);
    await set(newMessageRef, userMessage);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found, please login');

      const requestBody = {
        messages: [
          ...messages.map(msg => ({ role: msg.Sender === 'user' ? 'user' : 'bot', text: msg.Text })),
          { role: 'user', text: input }
        ]
      };

      const response = await fetch('https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`HTTP Error ${response.status}: ${await response.text()}`);
      const data = await response.json();
      if (!data.response) throw new Error('Invalid response from API');

      const botMessage: ChatMessage = {
        Sender: 'bot',
        Text: data.response,
        Timestamp: new Date().toISOString(),
      };
      await set(push(chatRef), botMessage);
    } catch (error) {
      console.error('Error in sendMessage:', error);
    }

    setInput('');
    setIsSending(false);
  };

  return (
    <div className="chatbot-container">
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition">
        <MdChat size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-[500px] bg-white border rounded-lg shadow-lg flex flex-col">
          <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
            <h3 className="text-lg font-semibold">Chatbot</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <MdClose size={20} />
            </button>
          </div>

          <div className="messages flex-1 overflow-y-auto p-3">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.Sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 m-1 rounded ${msg.Sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>{msg.Text}</span>
              </div>
            ))}
          </div>

          <div className="input flex p-3 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 border rounded-l focus:outline-none"
              placeholder="Nhập tin nhắn..."
              disabled={isSending}
            />
            <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-r" disabled={isSending}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;