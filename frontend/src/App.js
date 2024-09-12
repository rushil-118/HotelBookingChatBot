import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { TextField, Button, Paper, Typography, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0D0D0D',
    },
    secondary: {
      main: '#0D0D0D', 
    },
    background: {
      default: '#0D0D0D', 
    },
  },
});

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(#0D0D0D, #0D0D0D 0%, #0D0D0D 100%);
`;

const Header = styled(Paper)`
  padding: 20px;
  background: linear-gradient(to right, #0D0D0D, #3D3D3D) !important;
  color: white !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
`;

const ChatContainer = styled(Paper)`
  flex: 1;
  overflow-y: auto;
  margin: 20px;
  padding: 20px;
  background-color: #0D0D0D;
  border-radius: 12px;
  background-color: #0D0D0D!important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 10px;
`;

const Message = styled(Paper)`
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 70%;
  background: ${props => props.isUser 
    ? 'linear-gradient(45deg, white, white)' 
    : 'linear-gradient(45deg, #F8C699, #F8C699)'};
  color: ${props => props.isUser ? 'black' : 'white'};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  & div {
    width: 8px;
    height: 8px;
    background-color: #F8C699;
    border-radius: 50%;
    margin: 0 4px;
    animation: bounce 1.2s infinite;
  }

  & div:nth-child(2) {
    animation-delay: 0.2s;
  }

  & div:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const InputContainer = styled.form`
  display: flex;
  padding: 20px;
  background-color: #0D0D0D;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 30px;
    background-color: white;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 30px !important;
  padding: 10px 20px !important;
  margin-left: 10px !important;
  background: linear-gradient(45deg, #5BA8EC, #4a148c) !important;
  box-shadow: 0 4px 20px rgba(106, 27, 154, 0.4) !important;
  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(106, 27, 154, 0.5) !important;
  }
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const sendInitialMessage = async () => {
      const initialMessage = { type: 'bot', content: 'Hey, how may I help you?' };
      setMessages([initialMessage]);
    };

    sendInitialMessage();
  }, []);

  const sendMessage = async (messageText) => {
    if (messageText.trim() === '') return;
  
    const userMessage = { type: 'user', content: messageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true);
  
    try {
      const response = await axios.post('http://localhost:3000/api/chat', {
        userId,
        message: messageText
      });
  
      const botMessage = { type: 'bot', content: response.data.response };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { type: 'error', content: 'An error occurred. Please try again.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    sendMessage(input);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <AppContainer>
          <Header elevation={3}>
            <Typography variant="h4" style={{ fontWeight: 'bold' }}>Book your stay at Oterra</Typography>
          </Header>
          <ChatContainer elevation={2}>
            {messages.map((message, index) => (
              <MessageContainer key={index} isUser={message.type === 'user'}>
                <Message isUser={message.type === 'user'} elevation={1}>
                  <Typography>{message.content}</Typography>
                </Message>
              </MessageContainer>
            ))}
            {isTyping && (
              <TypingIndicator>
                <div></div>
                <div></div>
                <div></div>
              </TypingIndicator>
            )}
            <div ref={messagesEndRef} />
          </ChatContainer>
          <InputContainer onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
            />
            <StyledButton
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
            >
              Send
            </StyledButton>
          </InputContainer>
        </AppContainer>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
