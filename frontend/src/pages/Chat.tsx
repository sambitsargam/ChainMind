import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your ChainMind AI assistant. I can help you with DeFi strategy analysis, portfolio optimization, and market insights. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Analyze my portfolio performance",
        "What are the best yield farming opportunities?",
        "Show me arbitrage opportunities",
        "Explain my current risk exposure"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('performance')) {
      return {
        content: "📊 **Portfolio Analysis**\n\nYour current portfolio shows:\n• Total Value: $45,230\n• 24h Change: +2.3% ($1,040)\n• Diversification Score: 8.5/10\n• Risk Level: Moderate\n\n**Top Performers:**\n🟢 ETH Staking: +5.2%\n🟢 Uniswap V3 LP: +3.8%\n🔴 AAVE Lending: -0.5%\n\nWould you like me to suggest optimization strategies?",
        suggestions: [
          "Suggest portfolio rebalancing",
          "Show me yield opportunities",
          "Analyze risk factors",
          "Compare with market benchmark"
        ]
      };
    }
    
    if (lowerMessage.includes('yield') || lowerMessage.includes('farming')) {
      return {
        content: "🌾 **Top Yield Farming Opportunities**\n\n**High APY (>15%):**\n• Curve 3Pool: 18.4% APY\n• Convex Finance: 16.7% APY\n• Yearn USDC Vault: 15.2% APY\n\n**Stable Options (5-10%):**\n• Compound USDC: 8.3% APY\n• AAVE ETH: 6.9% APY\n• Lido Staking: 5.4% APY\n\n⚠️ Higher yields = higher risk. I recommend diversifying across multiple protocols.",
        suggestions: [
          "Calculate impermanent loss risk",
          "Show me stable coin strategies",
          "Explain yield farming risks",
          "Set up auto-compound strategy"
        ]
      };
    }
    
    if (lowerMessage.includes('arbitrage') || lowerMessage.includes('opportunity')) {
      return {
        content: "⚡ **Live Arbitrage Opportunities**\n\n**Flash Loan Arbitrage:**\n• ETH/USDC: 0.12% spread (Uniswap ↔ SushiSwap)\n• WBTC/ETH: 0.08% spread (1inch ↔ Curve)\n• DAI/USDC: 0.05% spread (Balancer ↔ Uniswap)\n\n**Cross-Chain Arbitrage:**\n• USDC: Ethereum vs Polygon (0.15% spread)\n• ETH: Arbitrum vs Optimism (0.09% spread)\n\n💡 Estimated profit after gas: $45-120 per transaction",
        suggestions: [
          "Execute flash loan arbitrage",
          "Set up arbitrage alerts",
          "Explain MEV protection",
          "Show gas optimization tips"
        ]
      };
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('safety')) {
      return {
        content: "🛡️ **Risk Analysis**\n\n**Your Current Risk Profile:**\n• Overall Risk Score: 6.5/10 (Moderate)\n• Smart Contract Risk: Low\n• Liquidity Risk: Medium\n• Market Risk: High\n\n**Risk Factors:**\n🔴 High exposure to ETH (45% of portfolio)\n🟡 Some funds in experimental protocols\n🟢 Good diversification across chains\n\n**Recommendations:**\n• Consider reducing ETH exposure to 30%\n• Add more stable coin positions\n• Set up stop-loss orders for volatile assets",
        suggestions: [
          "Set up risk alerts",
          "Rebalance for lower risk",
          "Explain stop-loss strategies",
          "Show correlation analysis"
        ]
      };
    }
    
    return {
      content: "I understand you're asking about DeFi strategies. I can help you with:\n\n📈 **Portfolio Management**\n• Performance analysis\n• Risk assessment\n• Rebalancing suggestions\n\n💰 **Yield Strategies**\n• Farming opportunities\n• Staking rewards\n• Liquidity provision\n\n⚡ **Advanced Features**\n• Arbitrage detection\n• Flash loan strategies\n• MEV protection\n\nWhat specific area would you like to explore?",
      suggestions: [
        "Analyze my portfolio",
        "Find yield opportunities",
        "Show arbitrage options",
        "Check risk levels"
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <CpuChipIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ChainMind AI Assistant</h1>
            <p className="text-sm text-gray-400">Powered by GPT-4 • Real-time DeFi Analysis</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-600'
              }`}>
                {message.type === 'user' ? <UserIcon className="w-5 h-5" /> : <CpuChipIcon className="w-5 h-5" />}
              </div>
              
              {/* Message Content */}
              <div className={`rounded-lg p-4 ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 border border-slate-700'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400">Suggested actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-full transition-colors border border-slate-600"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <CpuChipIcon className="w-5 h-5" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 border-t border-slate-700 p-4">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => handleSendMessage("What's my portfolio performance today?")}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors border border-slate-600"
          >
            <ChartBarIcon className="w-4 h-4" />
            <span className="text-sm">Portfolio</span>
          </button>
          <button
            onClick={() => handleSendMessage("Show me yield farming opportunities")}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors border border-slate-600"
          >
            <CurrencyDollarIcon className="w-4 h-4" />
            <span className="text-sm">Yields</span>
          </button>
          <button
            onClick={() => handleSendMessage("Analyze my risk exposure")}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors border border-slate-600"
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span className="text-sm">Risk</span>
          </button>
        </div>

        {/* Input */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about DeFi strategies, portfolio analysis, or market insights..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-2 rounded-lg transition-colors"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
