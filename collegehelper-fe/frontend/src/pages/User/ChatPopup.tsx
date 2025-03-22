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
  const [chatHistory, setChatHistory] = useState<string[]>([]); // Lưu danh sách lịch sử chat
  const [selectedChat, setSelectedChat] = useState<string | null>(null); // Cuộc trò chuyện được chọn
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

  // Lấy danh sách lịch sử chat
  useEffect(() => {
    if (!userId) return;

    const chatHistoryRef = ref(database, `ChatHistory/${userId}`);
    onValue(chatHistoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setChatHistory(Object.keys(data)); // Lưu danh sách các cuộc trò chuyện
      }
    });
  }, [userId]);

  // Load tin nhắn khi chọn một cuộc trò chuyện từ dropdown
  const loadChatHistory = (chatId: string) => {
    if (!userId) return;

    setSelectedChat(chatId);

    const chatRef = ref(database, `ChatHistory/${userId}/${chatId}/messages`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(data ? Object.values(data) : []);
    });
  };

  const sendMessage = async () => {  
    if (!input.trim()) {  
        console.error("⚠️ Không thể gửi tin nhắn: prompt bị trống!");  
        return;  
    }  

    setIsSending(true);  

    try {  
        const token = localStorage.getItem('accessToken');  
        if (!token) throw new Error('No token found, please login');  

        // 🔹 Cấu trúc body JSON giống cURL
        const requestBody = JSON.stringify([
            {
                sender: "user",  // 👈 Có thể đổi thành `input.trim()` nếu cần
                message: input.trim(),
                timestamp: new Date().toISOString()
            }
        ]);
S
        console.log("📩 JSON gửi đi:", requestBody);  

        // 🔹 Định dạng URL theo cURL (thêm prompt vào query)
        const apiUrl = `https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/gemini?prompt=${encodeURIComponent(input.trim())}`;

        const response = await fetch(apiUrl, {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json',  
                'Accept': 'text/plain',  // 👈 Thêm Accept header như cURL
                Authorization: `Bearer ${token}`  
            },  
            body: requestBody  

        });  

        if (!response.ok) {  
            const errorText = await response.text();  
            console.error(`❌ HTTP Error ${response.status}:`, errorText);  
            throw new Error(errorText);  
        }  

        const data = await response.text();  // 👈 API trả về text thay vì JSON
        console.log("✅ API Response:", data);  

        setMessages(prev => [...prev, {  
            Sender: 'bot',  
            Text: data || "Không có nội dung phản hồi",  
            Timestamp: new Date().toISOString()  
        }]);  

    } catch (error) {  
        console.error('❌ Error in sendMessage:', error);  
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

          {/* Dropdown chọn lịch sử chat */}
          <div className="p-3 border-b">
            <label className="block text-sm font-medium text-gray-700">Chọn lịch sử chat:</label>
            <select
              className="w-full p-2 border rounded mt-1"
              value={selectedChat || ""}
              onChange={(e) => loadChatHistory(e.target.value)}
            >
              <option value="" disabled>Chọn cuộc trò chuyện...</option>
              {chatHistory.map((chatId) => (
                <option key={chatId} value={chatId}>{chatId}</option>
              ))}
            </select>
          </div>

          {/* Hiển thị tin nhắn */}
          <div className="messages flex-1 overflow-y-auto p-3">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.Sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 m-1 rounded ${msg.Sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>{msg.Text}</span>
              </div>
            ))}
          </div>

          {/* Input nhập tin nhắn */}
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
