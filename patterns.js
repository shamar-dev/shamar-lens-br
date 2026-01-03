// patterns.js - Red Flags de Manipulação Política Brasileira
// Versão MVP - 5 padrões principais

const MANIPULATION_PATTERNS = {
  
  // 1. FAKE NEWS CLÁSSICA
  fake_news: {
    name: "Possível Fake News",
    severity: "high",
    triggers: [
      /\bURGENTE\b/i,
      /\bBOMBA\b/i,
      /\bESCÂNDALO\b/i,
      /\bvazou\b/i,
      /fonte anônima/i,
      /circula nas redes/i,
      /segundo informações/i,
      /teria dito/i,
      /estaria/i
    ],
    indicators: {
      no_source: {
        pattern: /(?!.*(segundo|conforme|de acordo com).{0,50}(fonte|jornal|portal|agência))/i,
        weight: 0.3
      },
      anonymous_source: {
        pattern: /fonte (anônima|reservada|confidencial)/i,
        weight: 0.4
      },
      emotional_caps: {
        pattern: /[A-ZÀÁÂÃÉÊÍÓÔÕÚÇ]{8,}/g,
        weight: 0.2,
        threshold: 3 // mínimo de ocorrências
      },
      conditional_verb: {
        pattern: /\b(teria|estaria|seria|poderia)\s+(dito|feito|afirmado)/i,
        weight: 0.3
      }
    },
    explanation: "Conteúdo usa linguagem típica de desinformação: manchetes sensacionalistas, fontes não verificáveis e verbos condicionais que evitam responsabilidade factual.",
    education_link: "O que caracteriza fake news?"
  },

  // 2. CLICKBAIT POLÍTICO
  clickbait: {
    name: "Clickbait Político",
    severity: "medium",
    triggers: [
      /você não vai acreditar/i,
      /o que aconteceu (depois|em seguida)/i,
      /revelação chocante/i,
      /descobriu-se que/i,
      /veja o (vídeo|áudio)/i,
      /surpreendente/i,
      /impressionante/i
    ],
    explanation: "Manchete projetada para gerar cliques através de curiosidade artificial, não para informar objetivamente.",
    education_link: "Como identificar clickbait?"
  },

  // 3. POLARIZAÇÃO EXTREMA (específico BR)
  polarization: {
    name: "Linguagem Polarizadora",
    severity: "high",
    triggers: [
      /\bpetralha\b/i,
      /\bbolsominion\b/i,
      /\bmortadela\b/i,
      /\bgado\b/i,
      /\bcomunista\b/i,
      /\bfascista\b/i,
      /\bcoxinha\b/i,
      /\besquerdopata\b/i,
      /\bdireitista\b/i,
      /\bglobista\b/i,
      /\blulopetista\b/i
    ],
    explanation: "Uso de rótulos pejorativos que desumanizam adversários políticos e impedem debate racional. Técnica clássica de propaganda para criar divisão.",
    education_link: "Por que polarização é manipulação?"
  },

  // 4. FALÁCIAS LÓGICAS
  fallacies: {
    name: "Falácia Lógica Detectada",
    severity: "medium",
    types: {
      ad_hominem: {
        pattern: /(corrupto|ladrão|bandido|criminoso|vagabundo).{0,50}(político|governo|partido|presidente|ministro)/i,
        explanation: "Ataque à pessoa em vez de aos argumentos (Ad Hominem)"
      },
      false_dichotomy: {
        pattern: /ou\s+(\w+)\s+ou\s+(\w+)/i,
        context_required: true,
        explanation: "Falsa dicotomia - apresenta apenas 2 opções quando existem mais"
      },
      appeal_to_emotion: {
        pattern: /(crianças|família|Deus|Jesus|pátria).{0,100}(voto|eleição|político|partido)/i,
        explanation: "Apelo emocional em vez de argumentação racional"
      },
      appeal_to_fear: {
        pattern: /(perigo|ameaça|destruir|acabar com).{0,50}(brasil|país|democracia|família)/i,
        explanation: "Apelo ao medo para influenciar opinião"
      }
    },
    education_link: "O que são falácias lógicas?"
  },

  // 5. DESINFORMAÇÃO FINANCEIRA (golpes políticos)
  financial_scam: {
    name: "⚠️ ALERTA DE POSSÍVEL GOLPE",
    severity: "critical",
    triggers: [
      /ganhe?\s+R?\$?\s*\d+/i,
      /dinheiro fácil/i,
      /método secreto/i,
      /PIX automático/i,
      /renda extra/i,
      /investimento garantido/i,
      /retorno de \d+%/i,
      /clique (aqui|no link)/i
    ],
    explanation: "ATENÇÃO: Conteúdo apresenta características de golpe financeiro. Nunca clique em links suspeitos ou forneça dados pessoais/bancários.",
    education_link: "Como identificar golpes online?"
  }
};

// Sistema de pontuação para determinar confiabilidade
const SCORING_SYSTEM = {
  calculate: function(detectedPatterns) {
    let score = 100; // começa em 100 (confiável)
    
    detectedPatterns.forEach(pattern => {
      switch(pattern.severity) {
        case 'critical':
          score -= 50;
          break;
        case 'high':
          score -= 30;
          break;
        case 'medium':
          score -= 15;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });
    
    return Math.max(0, score); // mínimo 0
  },
  
  getLabel: function(score) {
    if (score >= 80) return { text: "Confiável", color: "green" };
    if (score >= 60) return { text: "Verificar Fontes", color: "yellow" };
    if (score >= 40) return { text: "Suspeito", color: "orange" };
    return { text: "Alto Risco de Manipulação", color: "red" };
  }
};

// Exportar para uso nos outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MANIPULATION_PATTERNS, SCORING_SYSTEM };
}

// CRÍTICO: Expor globalmente para o navegador
window.MANIPULATION_PATTERNS = MANIPULATION_PATTERNS;
window.SCORING_SYSTEM = SCORING_SYSTEM;
