import React, { useState, useEffect } from 'react';
import { database, auth } from '../../firebaseConfig';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { MdChat, MdClose, MdMenu, MdArrowBack, MdDelete } from 'react-icons/md';

interface ChatMessage {
  Sender: string;
  Text: string;
  Timestamp: string;
}

interface ChatSession {
  id: string;
  name: string;
  preview: ChatMessage[];
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { Sender: 'bot', Text: 'Chào mừng bạn đến với hệ thống tư vấn tuyển sinh!', Timestamp: new Date().toISOString() }
  ]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Trạng thái sidebar
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Trạng thái đăng nhập
  const [authError, setAuthError] = useState<string | null>(null); // Lỗi đăng nhập

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    console.log('Checking auth state...');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setIsAuthenticated(true);
        setAuthError(null);
        console.log('User authenticated. User ID:', user.uid);
      } else {
        setUserId(null);
        setIsAuthenticated(false);
        setAuthError('Bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng chatbot.');
        console.log('User not authenticated');
      }
    }, (error) => {
      console.error('Auth state error:', error);
      setIsAuthenticated(false);
      setAuthError('Có lỗi xảy ra khi kiểm tra trạng thái đăng nhập. Vui lòng thử lại.');
    });

    return () => unsubscribe();
  }, []);

  // Lấy lịch sử chat từ Firebase
 // Lấy lịch sử chat từ Firebase
useEffect(() => {
  if (!isAuthenticated || !userId) {
    console.log('Cannot fetch chat history: user not authenticated or userId is null');
    setChatHistory([]);
    return;
  }

  console.log('Fetching chat history for user:', userId);
  const chatHistoryRef = ref(database, `ChatHistory/${userId}`);
  const unsubscribe = onValue(
    chatHistoryRef,
    (snapshot) => {
      const data = snapshot.val();
      console.log('ChatHistory data:', data); // Debug dữ liệu từ Firebase
      if (data) {
        const chatList: ChatSession[] = Object.entries(data).map(([id, chat]: [string, any]) => {
          const messages = chat.messages ? Object.values(chat.messages) : [];
          console.log(`Chat ${id} messages:`, messages); // Debug tin nhắn của từng chat
          return {
            id,
            name: chat.chatName || `Cuộc trò chuyện ${id}`, // Nếu không có chatName, dùng ID
            // Ép kiểu preview thành ChatMessage[]
            preview: messages.slice(-4) as ChatMessage[],
          };
        });
        console.log('Processed chat list:', chatList); // Debug danh sách chat đã xử lý
        setChatHistory(chatList);
      } else {
        setChatHistory([]);
        console.log('No chat history found for user:', userId);
      }
    },
    (error) => {
      console.error('Error fetching chat history:', error);
      setAuthError('Không thể lấy lịch sử chat. Vui lòng kiểm tra quyền truy cập hoặc thử lại.');
    }
  );

  return () => unsubscribe(); // Cleanup listener khi component unmount
}, [userId, isAuthenticated]);

  const createNewChat = () => {
    if (!isAuthenticated || !userId) {
      console.log('Cannot create new chat: user not authenticated');
      return;
    }

    const newChatRef = push(ref(database, `ChatHistory/${userId}`));
    const currentChatCount = chatHistory.length + 1;
    const chatName = `Cuộc trò chuyện số ${currentChatCount}`;

    set(newChatRef, { chatName, messages: [] })
      .then(() => {
        console.log('New chat created with ID:', newChatRef.key); // Debug khi tạo chat mới
        setSelectedChat(newChatRef.key);
        setMessages([{ Sender: 'bot', Text: 'Chào mừng bạn đến với cuộc trò chuyện mới!', Timestamp: new Date().toISOString() }]);
      })
      .catch((error) => {
        console.error('Error creating new chat:', error);
      });
  };

  const deleteChat = (chatId: string) => {
    if (!isAuthenticated || !userId) {
      console.log('Cannot delete chat: user not authenticated');
      return;
    }

    const chatRef = ref(database, `ChatHistory/${userId}/${chatId}`);
    remove(chatRef)
      .then(() => {
        console.log('Chat deleted:', chatId);
        if (selectedChat === chatId) {
          setSelectedChat(null);
          setMessages([{ Sender: 'bot', Text: 'Chào mừng bạn đến với hệ thống tư vấn tuyển sinh!', Timestamp: new Date().toISOString() }]);
        }
      })
      .catch((error) => {
        console.error('Error deleting chat:', error);
      });
  };

  const loadChatHistory = (chatId: string) => {
    if (!isAuthenticated || !userId) {
      console.log("Cannot load chat history: user not authenticated");
      return;
    }
    setSelectedChat(chatId);
  
    const chatRef = ref(database, `ChatHistory/${userId}/${chatId}/messages`);
    onValue(
      chatRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log(`Messages for chat ${chatId}:`, data); // Debug tin nhắn của chat
        setMessages(
          data
            ? Object.values(data).map((msg: any) => ({
                ...(typeof msg === "object" && msg !== null ? msg : {}), // Ensure msg is an object
                Text: (msg?.Text ?? "Unknown message")
                  .replace(/\*/g, " ") // Thay thế toàn bộ dấu `*` bằng khoảng trắng
                  .trim(), // Loại bỏ khoảng trắng đầu và cuối
              }))
            : []
        );
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );
  };  

  const saveMessageToChat = (chatId: string, message: ChatMessage) => {
    if (!isAuthenticated || !userId || !chatId) {
      console.log('Cannot save message: user not authenticated or chat ID is null');
      return;
    }
    const messageRef = ref(database, `ChatHistory/${userId}/${chatId}/messages`);
    push(messageRef, message)
      .then(() => {
        console.log('Message saved to chat:', chatId); // Debug khi lưu tin nhắn
      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat || !isAuthenticated) {
      console.log('Cannot send message: user not authenticated or no chat selected');
      return;
    }
  
    const userMessage = {
      Sender: 'user',
      Text: input.trim(),
      Timestamp: new Date().toISOString(),
    };
  
    // Thêm tin nhắn người dùng vào danh sách messages ngay lập tức
    setMessages((prev) => [...prev, userMessage]);
    saveMessageToChat(selectedChat, userMessage);
    setInput('');
    setIsSending(true);
  
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found, please login');
  
      // Tạo lịch sử tin nhắn để gửi lên API, bao gồm tất cả tin nhắn hiện tại
      const chatHistoryToSend = [...messages, userMessage].map((msg) => ({
        sender: msg.Sender,
        message: msg.Text,
        timestamp: msg.Timestamp,
      }));
  
      // Giới hạn số lượng tin nhắn nếu cần (ví dụ: chỉ gửi 10 tin nhắn cuối cùng để tránh quá tải)
      const limitedHistory = chatHistoryToSend.slice(-10); // Lấy 10 tin nhắn cuối cùng
  
      // Chuẩn bị request body với lịch sử chat
      const requestBody = JSON.stringify(limitedHistory);
  
      const apiUrl = `https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/gemini?prompt=${encodeURIComponent(
        input.trim()
      )}`;
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: requestBody,
      });
  
      if (!response.ok) throw new Error(await response.text());
  
      const responseData = await response.json();
      const botReply = {
        Sender: 'bot',
        Text: responseData?.message?.content || 'Không có nội dung phản hồi',
        Timestamp: new Date().toISOString(),
      };
  
      setMessages((prev) => [...prev, botReply]);
      saveMessageToChat(selectedChat, botReply);
    } catch (error) {
      console.error('❌ Error in sendMessage:', error);
      const errorMessage = {
        Sender: 'bot',
        Text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!',
        Timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      saveMessageToChat(selectedChat, errorMessage);
    }
  
    setIsSending(false);
  };

  return (
    <div className="chatbot-container">
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition">
        <MdChat size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-white border rounded-lg shadow-lg flex flex-col">
          {isAuthenticated === null ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center text-gray-600">
                Đang kiểm tra trạng thái đăng nhập...
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center text-gray-600">
                {authError || 'Vui lòng đăng nhập để sử dụng chatbot.'}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 h-full">
              {/* Sidebar lịch sử chat */}
              <div
                className={`bg-gray-100 border-r transition-all duration-300 ${
                  isSidebarOpen ? 'w-1/3' : 'w-12'
                } flex flex-col h-full`}
              >
                <div className="flex justify-between items-center p-2 border-b">
                  {isSidebarOpen ? (
                    <>
                      <button onClick={createNewChat} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Tạo cuộc trò chuyện mới
                      </button>
                      <button onClick={() => setIsSidebarOpen(false)} className="ml-2 text-gray-600 hover:text-gray-800">
                        <MdArrowBack size={20} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:text-gray-800">
                      <MdMenu size={20} />
                    </button>
                  )}
                </div>

                {isSidebarOpen && (
                  <div className="flex-1 overflow-y-auto p-1">
                    {chatHistory.length === 0 ? (
                      <div className="text-gray-500 text-center">Không có lịch sử chat</div>
                    ) : (
                      <div className="chat-history">
                        {chatHistory.map((chat) => (
                          <div
                            key={chat.id}
                            className={`p-1 mb-1 rounded flex justify-between items-center ${
                              selectedChat === chat.id ? 'bg-blue-200' : 'hover:bg-gray-200'
                            }`}
                          >
                            <div
                              onClick={() => loadChatHistory(chat.id)}
                              className="flex-1 cursor-pointer font-semibold pr-2"
                              style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                            >
                              {chat.name}
                            </div>
                            <button
                              onClick={() => deleteChat(chat.id)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Khu vực chat chính */}
              <div className={`flex flex-col ${isSidebarOpen ? 'w-2/3' : 'w-[calc(100%-3rem)]'} transition-all duration-300 h-full`}>
                <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg h-12">
                  <h3 className="text-lg font-semibold">Chatbot</h3>
                  <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                    <MdClose size={20} />
                  </button>
                </div>

                <div className="messages flex-1 overflow-y-auto p-3">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.Sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block p-2 m-1 rounded ${msg.Sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
                        {msg.Text}
                      </span>
                    </div>
                  ))}
                  {isSending && (
                    <div className="text-left">
                      <span className="inline-block p-2 m-1 rounded bg-gray-200 animate-pulse">Đang trả lời...</span>
                    </div>
                  )}
                </div>

                <div className="flex p-3 border-t h-16">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 p-3 border rounded-l focus:outline-none"
                    placeholder="Nhập tin nhắn..."
                    disabled={isSending || !selectedChat}
                  />
                  <button
                    onClick={sendMessage}
                    className="p-3 bg-blue-500 text-white rounded-r w-16 flex items-center justify-center"
                    disabled={isSending || !selectedChat}
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;