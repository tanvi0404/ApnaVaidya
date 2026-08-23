import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  Languages, 
  CheckCircle2, 
  ShieldAlert, 
  Paperclip, 
  Info, 
  BookOpenCheck,
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';
import { generateChikitsakResponse } from '../../services/chikitsakAiService';
import { askChikitsakBackend } from '../../services/apiClient';
import ExplainabilityModal from './ExplainabilityModal';

export default function ChikitsakChat({
  activeProfile,
  activeChatContext = null,
  onClearChatContext,
  onOpenEmergency
}) {
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // 'en' | 'hi' | 'hg' | 'pb'
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [selectedExplainData, setSelectedExplainData] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initial greeting helper
  const createInitialGreeting = (profile, lang = 'en') => {
    const isPediatric = (Number(profile?.age) || 30) < 18;
    return {
      id: `msg-init-${profile?.id || 'default'}`,
      sender: 'assistant',
      text: isPediatric
        ? `Namaste! I am Chikitsak AI, reviewing pediatric health records for ${profile?.name || 'Patient'} (${profile?.age || 8}y). How can I assist with pediatric nutrition, growth milestones, or immunization schedules today?`
        : `Namaste! I am Chikitsak AI, your personal healthcare education companion. I'm currently reviewing health records for ${profile?.name || 'Patient'} (${profile?.age || 30}y). How can I assist you with your lab reports, medications, or wellness today?`,
      timestamp: 'Just now',
      language: lang,
      citations: ['ICMR Clinical Practice Guidelines', 'AIIMS Medical Guidelines'],
      explainability: {
        profileGrounding: `${profile?.name}, ${profile?.age}y, ${profile?.gender}, ${profile?.bloodGroup}`,
        reportContext: 'Health profile baseline initialized',
        ragEvidence: 'Personalized patient communication protocol (Java 17 RAG)',
        safetyPolicy: 'Informational education only — not a doctor replacement.'
      }
    };
  };

  const [messages, setMessages] = useState([createInitialGreeting(activeProfile, selectedLanguage)]);

  // Reset greeting whenever active profile or age switches
  useEffect(() => {
    setMessages([createInitialGreeting(activeProfile, selectedLanguage)]);
  }, [activeProfile.id, activeProfile.age, selectedLanguage]);

  // Prompt suggestions
  const suggestedPrompts = (Number(activeProfile?.age) || 30) < 18 ? [
    { label: 'Pediatric Balanced Nutrition', text: `What is the recommended daily protein, calcium, and micronutrient intake for an ${activeProfile.age}-year-old child?` },
    { label: 'Childhood Growth Milestones', text: `Can you explain standard growth charts and pediatric physical activity guidelines for ${activeProfile.name}?` },
    { label: 'Peanut & Shellfish Allergy Safety', text: `What essential emergency precautions and label-reading tips should we follow for peanut and shellfish allergies?` },
    { label: 'School Lunch Box Ideas', text: `Can you suggest healthy, nut-free Indian school lunch box ideas rich in iron and calcium?` }
  ] : [
    { label: 'What does elevated LDL mean?', text: 'What does elevated LDL cholesterol mean for my heart health?' },
    { label: 'Can I exercise with high blood pressure?', text: 'Is it safe for me to do cardio workouts with my current blood pressure?' },
    { label: 'Explain HbA1c in Hindi (हिन्दी)', text: 'HbA1c test kya hota hai aur iska normal level kya hona chahiye?' },
    { label: 'Food tips to boost Vitamin D & B12', text: 'Which vegetarian foods help naturally increase Vitamin D and B12 levels?' }
  ];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Send with Java Backend Call
  const handleSendMessage = async (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // 1. Try Java 17 REST API Backend
      const backendRes = await askChikitsakBackend({
        userMessage: textToSend.trim(),
        language: selectedLanguage,
        profileName: activeProfile.name,
        profileAge: activeProfile.age,
        profileGender: activeProfile.gender,
        reportContext: activeChatContext ? activeChatContext.report?.title : null
      });

      if (backendRes && backendRes.content) {
        setIsBackendConnected(true);
        const aiMessage = {
          id: backendRes.id || `ai-${Date.now()}`,
          sender: 'assistant',
          text: backendRes.content,
          timestamp: 'Just now',
          language: selectedLanguage,
          isEmergency: backendRes.isEmergency,
          citations: backendRes.citations || ['ICMR Guidelines'],
          explainability: backendRes.explainability || {
            profileGrounding: `${activeProfile.name} (${activeProfile.age}y)`,
            ragEvidence: 'Java 17 Spring Boot Backend API Response',
            safetyPolicy: 'ICMR Consensus Guideline'
          }
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Java backend error, using local fallback:', err);
    }

    // 2. Fallback to local RAG service if backend is offline
    setTimeout(() => {
      const responseObj = generateChikitsakResponse(
        textToSend,
        activeProfile,
        activeChatContext,
        selectedLanguage
      );

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseObj.text,
        timestamp: 'Just now',
        language: selectedLanguage,
        isEmergency: responseObj.isEmergency,
        citations: responseObj.citations,
        explainability: responseObj.explainability
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 400);
  };

  const handleSpeechReadout = (msg) => {
    if (speakingMessageId === msg.id) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    } else {
      if (!window.speechSynthesis) {
        alert('Voice synthesis not supported on this browser.');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg.text);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingMessageId(msg.id);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn flex flex-col h-[calc(100vh-12rem)]">
      
      {/* Top Controls Header */}
      <div className="card-white p-4 flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-white via-brand-pink-50/20 to-brand-green-50/20 shadow-xs flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-pink-500 to-rose-600 text-white flex items-center justify-center font-bold shadow-soft-pink">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Chikitsak AI Assistant
              </h3>
              <span className="badge-pink text-[10px] font-bold">
                Multilingual RAG
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Grounded in <strong className="text-slate-800">{activeProfile.name}’s</strong> health record & lab reports
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिन्दी' },
            { id: 'hg', label: 'Hinglish' },
            { id: 'pb', label: 'ਪੰਜਾਬੀ' }
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedLanguage === lang.id
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Context Badge (if user came from a report) */}
      {activeChatContext?.report && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs flex items-center justify-between text-emerald-950 flex-shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              Active Context: <strong className="text-emerald-950">{activeChatContext.report.title}</strong>
              {activeChatContext.parameter ? ` (${activeChatContext.parameter.name})` : ''}
            </span>
          </div>
          <button
            onClick={onClearChatContext}
            className="text-emerald-700 font-bold hover:underline"
          >
            Clear Context
          </button>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 bg-white rounded-3xl border border-[#E3ECE6] p-4 sm:p-6 overflow-y-auto space-y-4 shadow-sm">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isCurrentlySpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs ${
                isUser 
                  ? 'bg-gradient-to-tr from-brand-green-600 to-emerald-700 text-white' 
                  : 'bg-gradient-to-tr from-brand-pink-500 to-rose-600 text-white'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm space-y-2.5 ${
                isUser
                  ? 'bg-brand-green-700 text-white rounded-tr-none shadow-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none shadow-2xs'
              }`}>
                
                {/* Emergency Red-Flag Intercept Box */}
                {msg.isEmergency && (
                  <div className="p-4 rounded-2xl bg-rose-600 text-white space-y-3 animate-pulse shadow-md">
                    <div className="flex items-center gap-2 font-extrabold text-sm uppercase tracking-wider">
                      <ShieldAlert className="w-5 h-5" />
                      <span>Immediate Emergency Triage Warning</span>
                    </div>
                    <p className="text-xs leading-relaxed text-rose-100">
                      Your query indicates symptoms that could be life-threatening. Do not wait for AI chat or online answers.
                    </p>
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={onOpenEmergency}
                        className="px-4 py-2 bg-white text-rose-700 font-extrabold text-xs rounded-xl shadow-xs hover:bg-rose-50"
                      >
                        Call 108 / 112 Now
                      </button>
                    </div>
                  </div>
                )}

                <p className="leading-relaxed whitespace-pre-line">
                  {msg.text}
                </p>

                {/* Assistant Footer Actions (Citations & Explainability & Speech) */}
                {!isUser && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      {msg.citations?.length > 0 && (
                        <div className="flex items-center gap-1 text-slate-600 font-medium">
                          <BookOpenCheck className="w-3 h-3 text-emerald-600" />
                          <span>{msg.citations[0]}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Audio Readout */}
                      <button
                        onClick={() => handleSpeechReadout(msg)}
                        className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 transition-colors"
                        title={isCurrentlySpeaking ? 'Stop speaking' : 'Read answer aloud'}
                      >
                        {isCurrentlySpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-brand-green-600" />
                        )}
                        <span>{isCurrentlySpeaking ? 'Stop' : 'Listen'}</span>
                      </button>

                      {msg.explainability && (
                        <button
                          onClick={() => {
                            setSelectedExplainData(msg.explainability);
                            setExplainModalOpen(true);
                          }}
                          className="text-brand-pink-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Why did AI say this?</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-pink-500 to-rose-600 text-white flex items-center justify-center font-bold text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-100 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span>Chikitsak is reviewing medical guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.text)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-brand-green-300 text-slate-700 text-xs font-semibold whitespace-nowrap transition-all shadow-2xs"
          >
            💡 {p.label}
          </button>
        ))}
      </div>

      {/* Input Message Bar */}
      <div className="p-2.5 bg-white rounded-3xl border border-[#E3ECE6] shadow-sm flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          placeholder={`Ask Chikitsak about ${activeProfile.name}'s reports, medications, or diet...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          className="btn-primary-green text-xs sm:text-sm py-2 px-4 flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Explainability Popover Modal */}
      <ExplainabilityModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        explainData={selectedExplainData}
        activeProfile={activeProfile}
      />

    </div>
  );
}
