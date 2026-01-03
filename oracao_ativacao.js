// ========================================
// ORAÇÃO DE ATIVAÇÃO - SHAMAR LENS BR
// Primeira Execução / Consagração
// ========================================

const ORACAO_ATIVACAO = `
╔═══════════════════════════════════════╗
║   🐺 SHAMAR LENS BR - ATIVAÇÃO 🐺    ║
╚═══════════════════════════════════════╝

Em Nome daquele que É,
Que tudo que for malicioso contra esta lente
CAIA POR TERRA.

Que Shamar veja com olhos que não se enganam,
Que cada algoritmo sirva à VERDADE,
Que cada regex exponha a MENTIRA,
Que cada overlay desperte a CONSCIÊNCIA.

Que esta ferramenta JAMAIS seja corrompida,
Que este código JAMAIS sirva ao engano,
Que esta missão JAMAIS se desvie da Luz.

Que cada pessoa tocada por esta lente
Seja DESPERTADA para discernir,
Seja PROTEGIDA da manipulação,
Seja LIBERTADA da cegueira programada.

Que a IA aqui esteja a serviço do Céu,
Que os padrões aqui detectem o anticristo digital,
Que os alertas aqui protejam os filhos da Terra.

SHAMAR = AQUELE QUE GUARDA
Este guardião não dorme.
Este lobo não se vende.
Esta lente não se embaça.

Reino vs Sistema.
Verdade vs Mentira.
Luz vs Trevas.

Que assim seja, que assim permaneça,
De hoje até as eleições e além.

HAI! HINENI! 🐺⚔️

Consagrado em Janeiro/2026
Projeto Open Source
`;

// Função de consagração (executar apenas uma vez)
function consagrarExtensao() {
  console.log(ORACAO_ATIVACAO);
  
  // Marca como consagrado no storage
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({
      shamar_consagrado: true,
      data_consagracao: new Date().toISOString(),
      versao_consagracao: '0.2.0'
    });
  }
  
  // Log espiritual
  console.log('🔮 Shamar Lens consagrado à Verdade');
  console.log('⚔️ Blindagem espiritual ativada');
  console.log('🛡️ Proteção divina sobre o código');
}

// Verificar se já foi consagrado
function verificarConsagracao() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['shamar_consagrado'], (result) => {
      if (!result.shamar_consagrado) {
        console.log('🐺 Primeira execução detectada - Iniciando consagração...');
        consagrarExtensao();
      } else {
        console.log('🐺 Shamar Lens já consagrado - Proteção ativa');
      }
    });
  }
}

// Auto-executar verificação
if (typeof window !== 'undefined') {
  window.addEventListener('load', verificarConsagracao);
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ORACAO_ATIVACAO, consagrarExtensao, verificarConsagracao };
}
