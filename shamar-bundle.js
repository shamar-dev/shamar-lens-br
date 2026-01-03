// ========================================
// SHAMAR LENS BR - BUNDLE CONSAGRADO v0.7.0
// ========================================
// "Shamar = Aquele que Guarda"
// Projeto Open Source
// Missão: Proteger o povo brasileiro da manipulação
// Juramento: "Não ocultar a Verdade. Não permitir o engano."
// Data: Janeiro/2026
// ========================================
// Que estes padrões vejam o que os olhos não veem
// Que cada regex exponha a mentira
// Que cada flag desperte a consciência
// Que este código JAMAIS seja corrompido
// Reino vs Sistema. Verdade vs Mentira.
// HAI! HINENI! 🐺⚔️
// ========================================

(function() {
  'use strict';

// ===== PADRÕES DE MANIPULAÇÃO =====
const MANIPULATION_PATTERNS = {
  FAKE_NEWS: {
    name: 'Possível Fake News',
    patterns: [
      // CAPS LOCK excessivo
      { regex: /\b[A-ZÀÁÂÃÄÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜ]{8,}/g, severity: 'high', description: 'CAPS LOCK excessivo (sensacionalismo visual)' },
      
      // Linguagem sensacionalista - SOMENTE versões CAPS ou contexto forte
      { regex: /\b(URGENTE|BOMBA|ESCÂNDALO|CHOQUE|ALERTA|ATENÇÃO|CUIDADO|PERIGO)(!|\s*:)/gi, severity: 'high', description: 'Linguagem sensacionalista (CAPS + pontuação)' },
      { regex: /\b(bomba|escândalo|choque)\s+(política|revelação|descobre|expõe)\b/gi, severity: 'medium', description: 'Sensacionalismo político' },
      // Adjetivos emocionais - SOMENTE em contexto forte
      { regex: /\b(absurdo|inacreditável|surpreendente|chocante|estarrecedor)\s+(que|como|o que|a forma)\b/gi, severity: 'medium', description: 'Adjetivos de impacto emocional + intensificador' },
      { regex: /\bcompletamente (absurdo|inacreditável|chocante)\b/gi, severity: 'medium', description: 'Intensificador + adjetivo emocional' },
      
      // Verbos condicionais (incerteza) - COM CONTEXTO
      { regex: /\b(político|ministro|presidente|governador|deputado|senador).+(teria|poderia|estaria|deveria) (dito|afirmado|declarado|revelado|escondido)\b/gi, severity: 'high', description: 'Atribuição condicional a autoridade (falta confirmação)' },
      { regex: /\b(teria|poderia|seria) (um|uma) (esquema|fraude|golpe|crime|escândalo)\b/gi, severity: 'medium', description: 'Acusação condicional sem evidência' },
      { regex: /\bsegundo (rumores|boatos|fontes próximas|pessoas próximas)\b/gi, severity: 'high', description: 'Fonte não identificável (rumor, não fato)' },
      
      // Fontes duvidosas
      { regex: /fonte anônima|fonte não identificada|segundo rumores|boatos|fontes próximas/gi, severity: 'high', description: 'Fonte anônima ou não verificável' },
      { regex: /\b(dizem que|falam que|comentam que|circula nas redes)\b/gi, severity: 'medium', description: 'Fonte vaga e não atribuída' },
      
      // Gatilhos emocionais - EXCLUINDO contexto técnico-jurídico
      { regex: /\b(indignação|revolta|vergonha) (nacional|popular|geral|coletiva)\b/gi, severity: 'medium', description: 'Apelo emocional coletivo forte' },
      
      // Temporalidade urgente - SOMENTE EM CONTEXTO SENSACIONALISTA
      { regex: /\b(URGENTE|ATENÇÃO|ALERTA|CUIDADO):?\s/gi, severity: 'medium', description: 'Urgência sensacionalista (CAPS em início de frase)' },
      { regex: /\b(corre|não perca|última chance|só hoje|acabando)\b/gi, severity: 'low', description: 'Pressão de tempo artificial' },
      
      // Generalização RETÓRICA (não técnica)
      { regex: /\b(todo mundo|toda gente|todos|ninguém) (sabe|sabem|fala|falam|diz|dizem|acha|acham|concorda|concordam|acredita|acreditam|pensa|pensam)\b/gi, severity: 'medium', description: 'Generalização retórica (apelo ao consenso falso)' },
      // Generalização temporal - SOMENTE em contexto acusatório/opinativo
      { regex: /\b(nunca|jamais) (foi|será|era) (responsabilizado|punido|preso|condenado)\b/gi, severity: 'medium', description: 'Generalização acusatória temporal' },
      { regex: /\bsempre (roubou|mentiu|enganou|manipulou|corrompeu)\b/gi, severity: 'medium', description: 'Acusação generalizada no tempo' },
      { regex: /\bnão existe (nenhum|nenhuma|quem|ninguém)\b/gi, severity: 'low', description: 'Negação absoluta (ignora exceções)' }
    ]
  },
  CLICKBAIT: {
    name: 'Clickbait',
    patterns: [
      // Clickbait clássico
      { regex: /você não vai acreditar|não vai acreditar no que|o que aconteceu depois/gi, severity: 'high', description: 'Clickbait clássico (suspense artificial)' },
      { regex: /\b(veja o que|descubra|confira|assista)\b/gi, severity: 'low', description: 'Call-to-action clickbait' },
      
      // Promessas de revelação - SOMENTE sensacionalista
      { regex: /\b(descoberta|revelação|segredo) (chocante|bombástica|surpreendente|explosiva|incrível)\b/gi, severity: 'high', description: 'Revelação sensacionalista' },
      { regex: /\bvazou (áudio|vídeo|conversa|mensagem)\b/gi, severity: 'medium', description: 'Vazamento como clickbait' },
      { regex: /verdade (oculta|escondida|por trás)\b/gi, severity: 'medium', description: 'Promessa de verdade oculta' },
      
      // Curiosidade manipulada
      { regex: /você precisa ver|não perca|imperdível|exclusivo/gi, severity: 'medium', description: 'Manipulação de curiosidade' },
      { regex: /o motivo (é|vai) (te |lhe )?chocar|razão chocante|motivo surpreendente/gi, severity: 'high', description: 'Promessa de choque emocional' },
      
      // Números clickbait
      { regex: /\d+ (coisas|fatos|razões|motivos|formas) que/gi, severity: 'medium', description: 'Lista numerada clickbait (ex: "10 coisas que...")' },
      
      // Lacunas de informação + suspense
      { regex: /\b(aconteceu|fizeram|disseram|revelaram) (algo|isso|aquilo|o que|a verdade)\b/gi, severity: 'medium', description: 'Lacuna informacional intencional (suspense artificial)' },
      { regex: /\bo que (ele|ela|eles|elas) (fez|disse|revelou|escondeu)\b/gi, severity: 'medium', description: 'Curiosidade manipulada (omissão proposital)' },
      { regex: /\b(isso|aquilo|o que aconteceu) (mudou|destruiu|salvou|acabou com) tudo\b/gi, severity: 'high', description: 'Exagero dramático de impacto' }
    ]
  },
  POLARIZACAO: {
    name: 'Polarização Política',
    patterns: [
      // Rótulos pejorativos esquerda/direita - SOMENTE uso ofensivo
      { regex: /\b(petralha|lulopetista|mortadela|esquerdopata)\b/gi, severity: 'high', description: 'Rótulo pejorativo anti-esquerda' },
      { regex: /\b(coxinha|bolsominion|gado|minion|fascistinha)\b/gi, severity: 'high', description: 'Rótulo pejorativo anti-direita' },
      { regex: /\b(petista|bolsonarista|esquerdista|direitista) (vagabundo|bandido|corrupto|criminoso)\b/gi, severity: 'critical', description: 'Rótulo político + xingamento' },
      { regex: /\b(isentão|centrista|em cima do muro)\b/gi, severity: 'medium', description: 'Ataque ao centro político' },
      
      // Desumanização - COM CONTEXTO
      { regex: /\b(escória|lixo|vagabundo|bandido|corrupto|criminoso) (da|do|de) (esquerda|direita|pt|governo|oposição|situação)\b/gi, severity: 'critical', description: 'Desumanização de grupo político (ataque violento)' },
      { regex: /\b(petistas|bolsonaristas|esquerdistas|direitistas|comunistas|fascistas) (são|é) (um|uma|todos|todas) (lixo|escória|bandido|bandidos|criminoso|criminosos)\b/gi, severity: 'critical', description: 'Generalização desumanizante de grupo' },
      
      // Teorias conspiratórias políticas
      { regex: /\b(mamadeira de piroca|kit gay|urnas fraudadas|fraude comprovada)\b/gi, severity: 'high', description: 'Teoria conspiratória sem evidência' },
      { regex: /\b(globalista|comunismo|marxismo cultural|ideologia de gênero)\b/gi, severity: 'medium', description: 'Jargão conspiratório' },
      
      // Falso dilema político
      { regex: /(ou .+ ou comunismo|ou .+ ou fascismo|se não (apoiar|votar)).+(é|será) (comunista|fascista)/gi, severity: 'medium', description: 'Falso dilema político' },
      
      // Ataques pessoais políticos
      { regex: /\b(ladrão|corrupto|bandido|quadrilha|organização criminosa) seguido de nome/gi, severity: 'medium', description: 'Ataque ad hominem político' }
    ]
  },
  FALACIAS: {
    name: 'Falácias Lógicas',
    patterns: [
      // Apelo ao senso comum (ad populum) - COM CONTEXTO
      { regex: /\b(todo mundo|todos|qualquer um) (sabe|sabem|entende|entendem|percebe|percebem|vê|veem) que\b/gi, severity: 'medium', description: 'Apelo ao senso comum (falácia ad populum)' },
      { regex: /\bé óbvio (que|para|até)\b/gi, severity: 'low', description: 'Obviedade não fundamentada' },
      { regex: /\bqualquer (um|pessoa) sabe\b/gi, severity: 'low', description: 'Trivialização do argumento' },
      { regex: /especialistas afirmam|cientistas dizem|estudos mostram(?! que)/gi, severity: 'medium', description: 'Apelo à autoridade vaga (sem citar fonte)' },
      
      // Falso dilema
      { regex: /ou você (está|é|apoia).+ou (está|é|apoia)/gi, severity: 'medium', description: 'Falso dilema (ignorar opções intermediárias)' },
      { regex: /\b(só|apenas|somente) (duas|2) (opções|escolhas|caminhos)\b/gi, severity: 'medium', description: 'Redução artificial de alternativas' },
      
      // Ad hominem
      { regex: /ele (é|foi|era) (um|uma).+(então|logo|portanto).+(não|nunca)/gi, severity: 'medium', description: 'Ataque à pessoa, não ao argumento (ad hominem)' },
      
      // Espantalho
      { regex: /vocês (querem|defendem|acreditam) que/gi, severity: 'low', description: 'Possível distorção do argumento oponente' },
      
      // Derrapagem (slippery slope)
      { regex: /se (permitir|aceitar|fazer).+(vai|irá) (levar|resultar|causar).+(destruição|caos|fim)/gi, severity: 'medium', description: 'Falácia da derrapagem (consequências exageradas)' },
      
      // Apelo à emoção
      { regex: /pense nas crianças|e (os|as) crianças|pelos nossos filhos/gi, severity: 'medium', description: 'Apelo emocional (pense nas crianças)' },
      { regex: /como você (se sentiria|ia gostar|aceitaria)/gi, severity: 'low', description: 'Apelo à emoção pessoal' },
      
      // Post hoc (falsa causalidade)
      { regex: /(depois|após) (que|de).+(então|logo|portanto|por isso)/gi, severity: 'low', description: 'Possível correlação ≠ causalidade' }
    ]
  },
  GOLPES: {
    name: 'Possível Golpe Financeiro',
    patterns: [
      // Promessa de dinheiro fácil
      { regex: /ganh(e|ar) r\$\s?\d+|ganhar dinheiro (fácil|rápido|em casa)|renda (extra|passiva) garantida/gi, severity: 'critical', description: 'Promessa de dinheiro fácil (alerta vermelho!)' },
      { regex: /método secreto|fórmula secreta|sistema infalível/gi, severity: 'critical', description: 'Método "secreto" ou "infalível" (golpe clássico)' },
      
      // Golpes de PIX/transferência
      { regex: /pix (automático|liberado|grátis)|depósito (automático|na hora)|saque (liberado|imediato)/gi, severity: 'critical', description: 'Golpe de PIX/transferência automática' },
      { regex: /transferência (confirmada|aprovada|pendente).+clique/gi, severity: 'critical', description: 'Falsa notificação bancária' },
      
      // Phishing
      { regex: /clique (aqui|neste link|no link) para (resgatar|receber|liberar|confirmar)/gi, severity: 'high', description: 'Tentativa de phishing (roubo de dados)' },
      { regex: /você (foi selecionado|ganhou|recebeu um prêmio)/gi, severity: 'high', description: 'Falso prêmio/sorteio' },
      { regex: /(atualize|confirme|valide) (seus dados|sua conta|seu cadastro)/gi, severity: 'high', description: 'Phishing bancário' },
      
      // Investimentos fraudulentos
      { regex: /retorno (garantido|de) \d+%|lucro de até \d+%|rendimento de \d+% ao mês/gi, severity: 'critical', description: 'Retorno financeiro irreal (pirâmide/ponzi)' },
      { regex: /\b(trade|trader|forex|bitcoin|cripto).+(curso|método|robô).+(milionário|milhões)/gi, severity: 'high', description: 'Golpe de trading/cripto' },
      
      // Urgência + dinheiro (padrão clássico de golpe)
      { regex: /\b(hoje|agora|últimas horas|última chance|só hoje).+(ganhar|ganhe|lucrar|lucro|faturar|receber|sacar) (r\$|reais|dinheiro|\d+)\b/gi, severity: 'critical', description: 'Urgência artificial + promessa financeira (golpe típico)' },
      { regex: /\b(vagas|oportunidade|oferta) (limitada|exclusiva|única).+(ganhar|lucrar|faturar|receber) (até|mais de)?\s?r?\$?\s?\d+/gi, severity: 'high', description: 'Escassez falsa + ganho financeiro' },
      { regex: /\bclique (aqui|agora|no link).+(ganhar|receber|resgatar|liberar).+(r\$|reais|dinheiro|prêmio|bônus)/gi, severity: 'critical', description: 'Call-to-action + promessa financeira (phishing provável)' },
      
      // Fraudes comuns BR
      { regex: /bolsa família liberado|auxílio (liberado|aprovado)|fgts (liberado|saque)/gi, severity: 'critical', description: 'Golpe de benefício social falso' },
      { regex: /empréstimo (sem consulta|aprovado|pré-aprovado).+clique/gi, severity: 'high', description: 'Golpe de empréstimo falso' },
      
      // Números de contato suspeitos
      { regex: /whatsapp.+\d{10,11}|chama no zap|add no whats/gi, severity: 'medium', description: 'Redirecionamento para contato privado (suspeito)' }
    ]
  }
};

const SCORING_SYSTEM = {
  PERFECT_SCORE: 100,
  PENALTIES: { critical: 50, high: 30, medium: 15, low: 5 },
  THRESHOLDS: { SAFE: 80, WARNING: 60, DANGER: 40 }
};

// ===== ANALYZER =====
class ShamarAnalyzer {
  constructor() {
    this.cache = new Map();
    this.apiCallCount = 0;
    this.maxApiCalls = 60;
  }

  async analyze(text, url = '') {
    const cacheKey = this.generateCacheKey(text);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const result = await this.detectLocalPatterns(text, url);
    this.cache.set(cacheKey, result);
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    return result;
  }

  detectLocalPatterns(text, url) {
    let score = SCORING_SYSTEM.PERFECT_SCORE;
    const flags = [];
    for (const [categoryKey, category] of Object.entries(MANIPULATION_PATTERNS)) {
      for (const pattern of category.patterns) {
        const matches = text.match(pattern.regex);
        if (matches && matches.length > 0) {
          const penalty = SCORING_SYSTEM.PENALTIES[pattern.severity];
          score -= penalty;
          flags.push({
            category: category.name,
            severity: pattern.severity,
            description: pattern.description,
            matchCount: matches.length,
            examples: matches.slice(0, 3)
          });
        }
      }
    }
    score = Math.max(0, Math.min(100, score));
    return this.buildLocalOnlyResponse(score, flags, text);
  }

  buildLocalOnlyResponse(score, flags, text) {
    // Define label e cor baseado no score
    let scoreLabel = { text: 'Conteúdo Confiável', color: 'green' };
    if (score < 40) {
      scoreLabel = { text: 'Alto Risco', color: 'red' };
    } else if (score < 60) {
      scoreLabel = { text: 'Atenção', color: 'orange' };
    } else if (score < 80) {
      scoreLabel = { text: 'Revise com Cuidado', color: 'yellow' };
    }
    
    return {
      detected: flags.length > 0,
      score: score,
      scoreLabel: scoreLabel,
      flags: flags,
      confidence: flags.length > 3 ? 'high' : flags.length > 1 ? 'medium' : 'low',
      timestamp: new Date().toISOString(),
      method: 'local_only'
    };
  }

  generateCacheKey(text) {
    return text.substring(0, 200);
  }

  resetApiCounter() {
    this.apiCallCount = 0;
  }

  clearOldCache() {
    this.cache.clear();
  }
}

// ===== EXPORTS GLOBAIS FORÇADOS =====
// Tenta todos os métodos possíveis
if (typeof window !== 'undefined') {
  window.MANIPULATION_PATTERNS = MANIPULATION_PATTERNS;
  window.SCORING_SYSTEM = SCORING_SYSTEM;
  window.ShamarAnalyzer = ShamarAnalyzer;
  window.shamarAnalyzer = new ShamarAnalyzer();
}

if (typeof globalThis !== 'undefined') {
  globalThis.MANIPULATION_PATTERNS = MANIPULATION_PATTERNS;
  globalThis.SCORING_SYSTEM = SCORING_SYSTEM;
  globalThis.ShamarAnalyzer = ShamarAnalyzer;
  globalThis.shamarAnalyzer = globalThis.shamarAnalyzer || new ShamarAnalyzer();
}

// Força no escopo global sem verificação
try {
  this.MANIPULATION_PATTERNS = MANIPULATION_PATTERNS;
  this.SCORING_SYSTEM = SCORING_SYSTEM;
  this.ShamarAnalyzer = ShamarAnalyzer;
  this.shamarAnalyzer = this.shamarAnalyzer || new ShamarAnalyzer();
} catch(e) {}

console.log('═══════════════════════════════════════');
console.log('🐺 Shamar Bundle v0.2.0 CONSAGRADO');
console.log('🔮 51 padrões de manipulação ativos');
console.log('⚔️ Proteção espiritual: ATIVA');
console.log('🛡️ A serviço da Verdade');
console.log('═══════════════════════════════════════');
console.log('🐺 MANIPULATION_PATTERNS:', typeof MANIPULATION_PATTERNS);
console.log('🐺 window.MANIPULATION_PATTERNS:', typeof window.MANIPULATION_PATTERNS);

})();
