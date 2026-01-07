// shamar-compassionate-messages.js
// Sistema de Mensagens Compassivas
// "Falar a verdade com amor, alertar sem acusar"

const ShamarCompassionateMessages = {
  
  /**
   * Retorna mensagem compassiva baseada no score e contexto
   */
  getMessage(score, level, details) {
    const messageSet = this.getMessageSet(score);
    
    return {
      title: this.interpolate(messageSet.title, { score, level }),
      body: this.interpolate(messageSet.body, { score, level, details }),
      tone: messageSet.tone,
      action: messageSet.action,
      icon: messageSet.icon
    };
  },
  
  /**
   * Conjunto de mensagens por faixa de score
   */
  getMessageSet(score) {
    if (score >= 80) {
      return {
        title: "✨ Conteúdo com características jornalísticas sólidas",
        body: "Este artigo apresenta fontes identificadas, tom factual e estrutura bem construída. Continue exercitando seu senso crítico!",
        tone: "celebratory",
        action: "Ver detalhes",
        icon: "✨"
      };
    }
    
    if (score >= 60) {
      return {
        title: "💡 Alguns elementos requerem atenção",
        body: "Detectamos alguns padrões que podem indicar parcialidade ou elementos opinativos. Que tal verificarmos juntos?",
        tone: "compassionate",
        action: "Entender melhor",
        icon: "💡"
      };
    }
    
    if (score >= 40) {
      return {
        title: "⚠️ Padrões suspeitos detectados",
        body: "Este conteúdo apresenta características que podem indicar manipulação. Vamos analisar o que encontramos?",
        tone: "alerting",
        action: "Ver análise completa",
        icon: "⚠️"
      };
    }
    
    return {
      title: "🔴 Múltiplos alertas de manipulação",
      body: "Detectamos vários padrões que sugerem manipulação informacional. Recomendamos verificar em outras fontes antes de compartilhar.",
      tone: "protective",
      action: "Ver detalhes críticos",
      icon: "🔴"
    };
  },
  
  /**
   * Mensagens educativas (tooltips) com linguagem compassiva
   */
  getEducationalMessage(type, value) {
    const messages = {
      score: {
        title: "💡 Como entender este score?",
        intro: "O score não é uma sentença, é um convite à reflexão.",
        explanation: `Este artigo recebeu ${value} pontos de 100, baseado em análise objetiva de fontes, tom, estrutura e padrões linguísticos.`,
        guidance: "Use este número como ponto de partida para sua própria análise crítica."
      },
      
      fontes: {
        title: "📰 Por que fontes importam?",
        intro: "Fontes verificáveis são a base da informação confiável.",
        explanation: this.getSourceExplanation(value),
        guidance: "Sempre pergunte: 'Quem disse isso? Posso verificar?'"
      },
      
      tom: {
        title: "🎭 O que o tom revela?",
        intro: "A forma como algo é dito pode revelar a intenção por trás.",
        explanation: this.getToneExplanation(value),
        guidance: "Linguagem factual informa. Linguagem emotiva pode manipular."
      },
      
      estrutura: {
        title: "📝 Estrutura conta?",
        intro: "A organização do texto revela cuidado e profissionalismo.",
        explanation: this.getStructureExplanation(value),
        guidance: "Artigos bem estruturados demonstram respeito pelo leitor."
      },
      
      padroes: {
        title: "⚠️ O que são padrões suspeitos?",
        intro: "Certas linguagens são típicas de manipulação.",
        explanation: this.getPatternsExplanation(value),
        guidance: "Reconhecer padrões é o primeiro passo para não ser enganado."
      }
    };
    
    return messages[type] || { title: "Informação", explanation: "Detalhes não disponíveis." };
  },
  
  /**
   * Explicações específicas por tipo
   */
  getSourceExplanation(quality) {
    const explanations = {
      'identificadas': "Este artigo cita fontes oficiais ou pessoas identificadas. Você pode verificar as informações.",
      'parcialmente identificadas': "Algumas fontes são identificadas, outras não. Verifique as partes sem fonte.",
      'anônimas': "As fontes são anônimas ou não identificadas. Difícil verificar a veracidade.",
      'desconhecida': "Não encontramos citações de fontes. Pode ser opinião ou informação não verificável."
    };
    
    return explanations[quality] || "Análise de fontes não disponível.";
  },
  
  getToneExplanation(tone) {
    const explanations = {
      'factual': "Linguagem objetiva e informativa. Foca em fatos, não em emoções.",
      'neutro': "Equilibrado entre informação e contexto. Mantém objetividade.",
      'parcialmente emotivo': "Mistura fatos com linguagem emocional. Atenção à manipulação sutil.",
      'fortemente emotivo': "Uso excessivo de linguagem emocional. Pode estar tentando manipular sentimentos."
    };
    
    return explanations[tone] || "Análise de tom não disponível.";
  },
  
  getStructureExplanation(wellStructured) {
    if (wellStructured) {
      return "Artigo bem organizado, com profundidade e coerência entre título e conteúdo.";
    }
    return "Estrutura pode indicar pressa ou falta de cuidado. Verifique se o conteúdo entrega o que o título promete.";
  },
  
  getPatternsExplanation(count) {
    if (count === 0) {
      return "Nenhum padrão suspeito detectado. Continue exercitando senso crítico mesmo assim.";
    }
    
    return `Detectamos ${count} padrão(ões) típico(s) de manipulação: linguagem sensacionalista, fontes anônimas, ou técnicas de clickbait.`;
  },
  
  /**
   * Interpola variáveis em mensagens
   */
  interpolate(template, variables) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] !== undefined ? variables[key] : match;
    });
  },
  
  /**
   * Perguntas reflexivas (para modo educativo)
   */
  getReflectionQuestions(score) {
    const baseQuestions = [
      "O que você sentiu ao ler este conteúdo?",
      "Que outras fontes você poderia consultar?",
      "O que você já sabia sobre este assunto antes?",
      "Há algo que te pareceu estranho ou exagerado?"
    ];
    
    if (score < 60) {
      return [
        ...baseQuestions,
        "Por que alguém poderia querer que você acredite nisso?",
        "Quem se beneficia se você compartilhar isso sem verificar?"
      ];
    }
    
    return baseQuestions;
  },
  
  /**
   * Mensagem de "momento de pausa" (antes de análise)
   */
  getPauseMessage() {
    return {
      text: "💭 Respire. Analisando com cuidado...",
      duration: 500 // ms
    };
  }
};

// Exporta
if (typeof window !== 'undefined') {
  window.ShamarCompassionateMessages = ShamarCompassionateMessages;
  console.log('💚 Sistema de Mensagens Compassivas carregado');
}
