
import React, { useState, useEffect } from 'react';
import { Home, MessageSquare, AlertCircle, Calendar, User, Settings, Plus, MapPin, ChevronRight, Send, Camera, LogOut, CheckCircle, Clock } from 'lucide-react';
import { INITIAL_USER, MOCK_POSTS, MOCK_COMPLAINTS, MOCK_EVENTS, NEIGHBORHOODS } from './constants';
import { Post, Complaint, ComplaintStatus, ComplaintCategory, Event, User as UserType } from './types';
import { getComplaintSuggestion } from './services/geminiService';

// Component: Navigation Bottom Bar
const Navigation = ({ currentView, setView }: { currentView: string; setView: (v: string) => void }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50">
    <button onClick={() => setView('home')} className={`flex flex-col items-center ${currentView === 'home' ? 'text-blue-600' : 'text-slate-400'}`}>
      <Home size={24} />
      <span className="text-[10px] mt-1 font-medium">Início</span>
    </button>
    <button onClick={() => setView('chats')} className={`flex flex-col items-center ${currentView === 'chats' ? 'text-blue-600' : 'text-slate-400'}`}>
      <MessageSquare size={24} />
      <span className="text-[10px] mt-1 font-medium">Chats</span>
    </button>
    <button onClick={() => setView('complaints')} className={`flex flex-col items-center ${currentView === 'complaints' ? 'text-blue-600' : 'text-slate-400'}`}>
      <AlertCircle size={24} />
      <span className="text-[10px] mt-1 font-medium">Reclamar</span>
    </button>
    <button onClick={() => setView('events')} className={`flex flex-col items-center ${currentView === 'events' ? 'text-blue-600' : 'text-slate-400'}`}>
      <Calendar size={24} />
      <span className="text-[10px] mt-1 font-medium">Agenda</span>
    </button>
    <button onClick={() => setView('profile')} className={`flex flex-col items-center ${currentView === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}>
      <User size={24} />
      <span className="text-[10px] mt-1 font-medium">Perfil</span>
    </button>
  </nav>
);

// Main App Component
export default function App() {
  const [user, setUser] = useState<UserType>(INITIAL_USER);
  const [view, setView] = useState('home');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [events] = useState<Event[]>(MOCK_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'POST' | 'COMPLAINT' | null>(null);

  // Home View Component
  const HomeView = () => (
    <div className="p-4 pb-20 space-y-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">ITAPEMA CONECTA</h1>
          <p className="text-slate-500 text-sm">Olá, {user.name} 👋</p>
        </div>
        <div className="relative">
          <img src={user.photo} className="w-10 h-10 rounded-full border-2 border-blue-100" alt="Profile" />
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-4 text-white shadow-lg mb-6">
        <h2 className="font-bold text-lg">Sugestão da Cidade</h2>
        <p className="text-sm opacity-90">Participe da audiência pública amanhã sobre o novo plano diretor de Itapema.</p>
        <button onClick={() => setView('events')} className="mt-3 bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm">
          Ver detalhes
        </button>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-slate-800">Feed da Comunidade</h3>
        <button 
          onClick={() => { setModalType('POST'); setIsModalOpen(true); }}
          className="flex items-center gap-1 text-blue-600 text-sm font-semibold"
        >
          <Plus size={16} /> Novo Post
        </button>
      </div>

      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
              {post.userName[0]}
            </div>
            <div>
              <p className="font-semibold text-sm">{post.userName}</p>
              <p className="text-[10px] text-slate-400">{post.userNeighborhood} • {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="ml-auto text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
              {post.type}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{post.content}</p>
          {post.image && <img src={post.image} className="w-full rounded-lg mb-3 max-h-64 object-cover" alt="Post" />}
          <div className="flex gap-4 border-t border-slate-50 pt-3">
            <button className="flex items-center gap-1 text-xs text-slate-500">
              ❤️ {post.likes}
            </button>
            <button className="flex items-center gap-1 text-xs text-slate-500">
              💬 {post.comments}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Complaints View Component
  const ComplaintsView = () => (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Reclamações</h2>
      <p className="text-sm text-slate-500 mb-6">Ajude a melhorar Itapema reportando problemas.</p>

      <button 
        onClick={() => { setModalType('COMPLAINT'); setIsModalOpen(true); }}
        className="w-full bg-blue-600 text-white rounded-xl p-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-200 mb-8"
      >
        <Plus size={20} /> CRIAR NOVA RECLAMAÇÃO
      </button>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-700">Meus Protocolos</h3>
        {complaints.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            Você ainda não fez nenhuma reclamação.
          </div>
        ) : (
          complaints.map(complaint => (
            <div key={complaint.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">#{complaint.protocol}</span>
                <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
                  complaint.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-700' : 
                  complaint.status === ComplaintStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {complaint.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{complaint.category}</h4>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{complaint.description}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <MapPin size={12} /> {complaint.location?.address || 'Localização não informada'}
              </div>
              <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] text-slate-400">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
                  Ver detalhes <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Events View Component
  const EventsView = () => (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Agenda Itapema</h2>
      <p className="text-sm text-slate-500 mb-6">Fique por dentro do que acontece na cidade.</p>

      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-32 bg-slate-200 relative">
              <img src={`https://picsum.photos/seed/${event.id}/600/300`} className="w-full h-full object-cover" alt="Event" />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1 text-center min-w-[45px]">
                <p className="text-[10px] font-bold text-blue-600 uppercase">{event.date.toLocaleString('pt-BR', { month: 'short' })}</p>
                <p className="text-lg font-black leading-tight">{event.date.getDate()}</p>
              </div>
              <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                {event.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800 mb-1">{event.title}</h3>
              <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                <MapPin size={12} /> {event.location}
              </p>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{event.interested} pessoas interessadas</span>
                <button className="bg-blue-50 text-blue-600 text-xs font-bold px-4 py-2 rounded-lg">
                  TENHO INTERESSE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Chat View Component
  const ChatView = () => {
    const [activeTab, setActiveTab] = useState<'bairro' | 'privado'>('bairro');
    return (
      <div className="h-screen flex flex-col bg-white">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Mensagens</h2>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('bairro')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'bairro' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Canais de Bairro
            </button>
            <button 
              onClick={() => setActiveTab('privado')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'privado' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Privado
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'bairro' ? (
            NEIGHBORHOODS.map(nb => (
              <div key={nb} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">
                  {nb[0]}
                </div>
                <div className="flex-1 border-b border-slate-50 pb-3">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-slate-800">{nb}</h4>
                    <span className="text-[10px] text-slate-400">14:30</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">Clique para entrar no chat do bairro...</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-400">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhuma conversa privada ativa.</p>
              <button className="mt-4 text-blue-600 font-bold text-sm">Iniciar nova conversa</button>
            </div>
          )}
        </div>
        <div className="h-16"></div>
      </div>
    );
  };

  // Profile View Component
  const ProfileView = () => (
    <div className="p-4 pb-20">
      <div className="flex flex-col items-center text-center py-8">
        <div className="relative mb-4">
          <img src={user.photo} className="w-24 h-24 rounded-full border-4 border-white shadow-xl" alt="Profile" />
          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
            <Camera size={16} />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
        <p className="text-blue-600 font-medium">{user.neighborhood}</p>
        <span className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">CIDADÃO VERIFICADO</span>
      </div>

      <div className="space-y-2 mt-4">
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg"><User size={20} className="text-slate-600" /></div>
            <span className="font-semibold text-slate-700">Meus Dados</span>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg"><Settings size={20} className="text-slate-600" /></div>
            <span className="font-semibold text-slate-700">Configurações</span>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-red-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg"><LogOut size={20} className="text-red-500" /></div>
            <span className="font-semibold">Sair da Conta</span>
          </div>
        </button>
      </div>
    </div>
  );

  // Modal: Create Post or Complaint
  const CreateModal = () => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<string>(Object.values(ComplaintCategory)[0]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiSuggesting, setAiSuggesting] = useState(false);

    const handleSuggest = async () => {
      if (!description) return;
      setAiSuggesting(true);
      const suggested = await getComplaintSuggestion(description);
      setDescription(suggested || description);
      setAiSuggesting(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        if (modalType === 'COMPLAINT') {
          const newComplaint: Complaint = {
            id: Math.random().toString(),
            userId: user.id,
            category: category as ComplaintCategory,
            description,
            status: ComplaintStatus.IN_ANALYSIS,
            protocol: `${new Date().getFullYear()}-ITP-${Math.floor(1000 + Math.random() * 9000)}`,
            isAnonymous,
            createdAt: new Date()
          };
          setComplaints([newComplaint, ...complaints]);
          setView('complaints');
        } else {
          const newPost: Post = {
            id: Math.random().toString(),
            userId: user.id,
            userName: user.name,
            userNeighborhood: user.neighborhood,
            type: (category as any) || 'Geral',
            content: description,
            likes: 0,
            comments: 0,
            createdAt: new Date()
          };
          setPosts([newPost, ...posts]);
          setView('home');
        }
        setIsSubmitting(false);
        setIsModalOpen(false);
        setDescription('');
      }, 1000);
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
        <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              {modalType === 'COMPLAINT' ? 'Nova Reclamação' : 'Novo Post'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {modalType === 'COMPLAINT' 
                ? 'Sua voz é importante para o desenvolvimento de Itapema.' 
                : 'Compartilhe novidades ou fotos da nossa cidade.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'COMPLAINT' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Categoria</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {Object.values(ComplaintCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bairro</label>
                  <select 
                    className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled
                  >
                    <option>{user.neighborhood}</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex justify-between items-center">
                  <span>Descrição</span>
                  {modalType === 'COMPLAINT' && (
                    <button 
                      type="button"
                      onClick={handleSuggest}
                      disabled={aiSuggesting || !description}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all disabled:opacity-50"
                    >
                      {aiSuggesting ? 'Processando...' : '✨ Melhorar com IA'}
                    </button>
                  )}
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={modalType === 'COMPLAINT' ? "Descreva o problema detalhadamente..." : "O que está acontecendo em Itapema?"}
                  className="w-full bg-slate-100 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                  required
                />
              </div>

              {modalType === 'COMPLAINT' && (
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="anonymous" 
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                  />
                  <label htmlFor="anonymous" className="text-sm text-slate-600">Reclamação anônima</label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="p-4 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="p-4 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Clock size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  {isSubmitting ? 'ENVIANDO...' : 'PUBLICAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 relative">
      <main className="pb-20">
        {view === 'home' && <HomeView />}
        {view === 'complaints' && <ComplaintsView />}
        {view === 'events' && <EventsView />}
        {view === 'chats' && <ChatView />}
        {view === 'profile' && <ProfileView />}
      </main>

      <Navigation currentView={view} setView={setView} />
      {isModalOpen && <CreateModal />}
    </div>
  );
}
