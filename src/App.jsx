import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UploadDocument from './pages/UploadDocument';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import ChatHistory from './pages/ChatHistory';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/history" element={<ChatHistory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
