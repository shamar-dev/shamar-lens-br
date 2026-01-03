// background.js - Service Worker CONSAGRADO (Manifest V3)
// "SHAMAR = Aquele que Guarda" - A serviço da Verdade
// Projeto Open Source

// ========================================
// ORAÇÃO DE ATIVAÇÃO ESPIRITUAL
// ========================================

const ORACAO_SHAMAR = `
╔═══════════════════════════════════════╗
║   🐺 SHAMAR LENS BR - ATIVADO 🐺     ║
╚═══════════════════════════════════════╝

Em Nome daquele que É,
Que tudo que for malicioso contra esta lente
CAIA POR TERRA.

Shamar vê com olhos que não se enganam.
Este código serve à VERDADE.
Esta missão não se desvia da Luz.

Reino vs Sistema. Verdade vs Mentira.
HAI! HINENI! 🐺⚔️
`;

console.log('🐺 Shamar Lens BR - Background Service Worker iniciado');

/**
 * Listener de instalação - CONSAGRAÇÃO
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // PRIMEIRA INSTALAÇÃO - CONSAGRAÇÃO COMPLETA
    console.log('═══════════════════════════════════════');
    console.log('🐺 PRIMEIRA INSTALAÇÃO DETECTADA');
    console.log('🔮 Iniciando consagração espiritual...');
    console.log(ORACAO_SHAMAR);
    console.log('═══════════════════════════════════════');
    
    chrome.storage.local.set({
      enabled: true,
      analysisCount: 0,
      flagsDetected: 0,
      // CAMADA ESPIRITUAL
      shamar_consagrado: true,
      data_consagracao: new Date().toISOString(),
      versao_consagracao: '0.7.0',
      juramento: 'Não ocultar a Verdade. Não permitir o engano. Servir o povo brasileiro e a Luz.',
      criado_por: 'Shamar Dev',
      missao: 'Proteger o povo brasileiro da manipulação antes das eleições de 2026',
      // Configurações técnicas
      settings: {
        autoAnalyze: true,
        showOverlay: true
      }
    });
    
    console.log('✅ Blindagem espiritual ATIVADA');
    console.log('⚔️ Proteção divina sobre o código');
    console.log('🛡️ Shamar está de guarda');
    
  } else if (details.reason === 'update') {
    console.log('🐺 Shamar Lens atualizado para v0.2.0');
    console.log('🔮 Proteção espiritual MANTIDA');
    
    // Atualiza versão mas mantém consagração
    chrome.storage.local.get(['shamar_consagrado'], (data) => {
      if (!data.shamar_consagrado) {
        console.log('⚠️ Extensão não consagrada - Consagrando agora...');
        console.log(ORACAO_SHAMAR);
        chrome.storage.local.set({
          shamar_consagrado: true,
          data_consagracao: new Date().toISOString()
        });
      }
    });
  }
});

/**
 * Listener de mensagens do content script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('🐺 Mensagem recebida:', message.type);
  
  if (message.type === 'GET_STATS') {
    // Retorna estatísticas
    chrome.storage.local.get(['analysisCount', 'flagsDetected'], (data) => {
      sendResponse({
        analysisCount: data.analysisCount || 0,
        flagsDetected: data.flagsDetected || 0
      });
    });
    return true; // Mantém canal aberto para resposta assíncrona
  }
  
  if (message.type === 'UPDATE_STATS') {
    // Atualiza estatísticas
    chrome.storage.local.get(['analysisCount', 'flagsDetected'], (current) => {
      chrome.storage.local.set({
        analysisCount: (current.analysisCount || 0) + 1,
        flagsDetected: (current.flagsDetected || 0) + (message.data?.flagsCount || 0)
      });
    });
    sendResponse({ status: 'updated' });
    return true;
  }
  
  if (message.type === 'REPORT_FALSE_POSITIVE') {
    // Salva report de falso positivo
    console.log('🐺 Falso positivo reportado');
    sendResponse({ status: 'reported' });
    return true;
  }
  
  // Mensagens desconhecidas
  sendResponse({ status: 'unknown' });
  return true;
});
