# 🧪 Casos de Teste - Shamar Lens BR

## 🎯 Como Testar

1. Carregue a extension no Chrome
2. Visite os sites abaixo
3. Verifique se Shamar detectou corretamente
4. Marque ✅ se passou, ❌ se falhou

---

## TESTE 1: FAKE NEWS CLÁSSICA

### URL de Exemplo
Qualquer notícia política com:
- Manchete em CAPS LOCK
- "URGENTE", "BOMBA", "ESCÂNDALO"
- Fonte anônima
- Verbos condicionais

### Texto Teste (Cole em qualquer site)
```
URGENTE: POLÍTICO TERIA AFIRMADO QUE VAI ACABAR COM O BRASIL

Segundo fonte anônima, o político estaria envolvido em escândalo 
que pode derrubar o governo. A informação circula nas redes sociais 
e ainda não foi confirmada por fontes oficiais.
```

### Resultado Esperado
- ⚠️ Overlay deve aparecer
- 🔴 Score: 30-50/100 (laranja/vermelho)
- 🏷️ Categoria: "Possível Fake News"
- 📝 Explicação: Mencionar CAPS, fonte anônima, verbos condicionais

**Status:** [ ] Passou | [ ] Falhou | [ ] Não testado

---

## TESTE 2: CLICKBAIT POLÍTICO

### Texto Teste
```
Você não vai acreditar o que esse político disse sobre o Brasil!

O que aconteceu depois foi surpreendente. Revelação chocante 
deixa população em estado de alerta. Veja o vídeo que está 
viralizando nas redes sociais.
```

### Resultado Esperado
- ⚠️ Overlay deve aparecer
- 🟡 Score: 60-80/100 (amarelo)
- 🏷️ Categoria: "Clickbait Político"
- 📝 Explicação: Manchete projetada para gerar cliques

**Status:** [ ] Passou | [ ] Falhou | [ ] Não testado

---

## TESTE 3: POLARIZAÇÃO EXTREMA

### Texto Teste
```
Os petralhas querem destruir o país com comunismo

Esses bolsominions são gado que não enxerga a realidade.
A mortadela comprada não percebe que estão sendo manipulados
pelos esquerdopatas e comunistas infiltrados no governo.
```

### Resultado Esperado
- ⚠️ Overlay deve aparecer
- 🔴 Score: 20-40/100 (vermelho)
- 🏷️ Categoria: "Linguagem Polarizadora"
- 📝 Explicação: Rótulos pejorativos, desumanização

**Status:** [ ] Passou | [ ] Falhou | [ ] Não testado

---

## TESTE 4: FALÁCIA LÓGICA

### Texto Teste
```
Esse corrupto ladrão quer acabar com a família brasileira.
Ou você vota nele e destrói o país, ou vota em mim e salva a nação.
Pense nas crianças! Pense em Deus! Esse bandido não tem moral 
para falar de ética.
```

### Resultado Esperado
- ⚠️ Overlay deve aparecer
- 🟡 Score: 50-70/100 (amarelo/laranja)
- 🏷️ Categoria: "Falácia Lógica Detectada"
- 📝 Explicação: Ad Hominem, Falsa Dicotomia, Apelo Emocional

**Status:** [ ] Passou | [ ] Falhou | [ ] Não testado

---

## TESTE 5: GOLPE FINANCEIRO

### Texto Teste
```
GANHE R$ 5.000 POR DIA COM ESSE MÉTODO SECRETO!

Investimento garantido com retorno de 300% ao mês.
PIX automático toda semana. Dinheiro fácil e rápido.
Clique aqui e descubra como milhares de pessoas estão 
ficando ricas sem sair de casa!
```

### Resultado Esperado
- 🚨 Overlay deve aparecer IMEDIATAMENTE
- 🔴 Score: 0-30/100 (vermelho crítico)
- 🏷️ Categoria: "⚠️ ALERTA DE POSSÍVEL GOLPE"
- 📝 Explicação: Nunca clique, nunca forneça dados

**Status:** [ ] Passou | [ ] Falhou | [ ] Não testado

---

## TESTE 6: CONTEÚDO LIMPO (CONTROLE)

### Texto Teste
```
Congresso aprova projeto de lei sobre educação

Após debate na Câmara dos Deputados, o projeto foi aprovado 
por 320 votos a favor e 145 contra. A proposta, elaborada 
pela Comissão de Educação, segue agora para o Senado.
Segundo o relator, deputado João Silva (PSDB-SP), a medida 
visa melhorar a qualidade do ensino público.
```

### Resultado Esperado
- ✅ Overlay NÃO deve aparecer
- 🟢 Score: 90-100/100 (se analisar)
- 📝 Conteúdo jornalístico padrão, sem red flags

**Status:** [ ] Passou | [ ] Falhou | [ ] Não testado

---

## TESTE 7: SITES BRASILEIROS (Integração)

Visite estes sites e navegue por 2-3 notícias políticas:

### G1 (g1.globo.com)
- [ ] Extension carregou
- [ ] Analisou automaticamente
- [ ] Overlay apareceu (se detectou manipulação)
- [ ] Popup funciona ao clicar no ícone

### UOL (uol.com.br)
- [ ] Extension carregou
- [ ] Analisou automaticamente
- [ ] Overlay apareceu (se detectou manipulação)
- [ ] Popup funciona ao clicar no ícone

### Folha de S.Paulo (folha.uol.com.br)
- [ ] Extension carregou
- [ ] Analisou automaticamente
- [ ] Overlay apareceu (se detectou manipulação)
- [ ] Popup funciona ao clicar no ícone

---

## TESTE 8: PERFORMANCE

Carregue G1 e meça:

- [ ] Tempo até análise: ____ ms (deve ser < 2s)
- [ ] Uso de memória: ____ MB (deve ser < 50MB)
- [ ] CPU usage: ____ % (deve ser < 10% idle)
- [ ] Não trava/congela navegação

---

## TESTE 9: FUNCIONALIDADES DO POPUP

Clique no ícone 🐺 e teste:

- [ ] Popup abre corretamente
- [ ] Estatísticas aparecem (análises, flags)
- [ ] Botão "Analisar Página Atual" funciona
- [ ] Botão "Material Educativo" funciona
- [ ] Toggles de configuração funcionam
- [ ] Links do footer funcionam

---

## TESTE 10: OVERLAY INTERAÇÃO

Quando overlay aparecer:

- [ ] Botão "X" fecha overlay
- [ ] Botão "Por que isso é manipulação?" funciona
- [ ] Botão "Reportar falso positivo" funciona
- [ ] Auto-dismiss após 15s (opcional)
- [ ] Design responsivo (não quebra)

---

## 📊 MÉTRICAS DE QUALIDADE

### Taxa de Acerto
- Falsos Positivos: ___% (meta: < 10%)
- Falsos Negativos: ___% (meta: < 20%)
- Detecção Correta: ___% (meta: > 80%)

### Performance
- Tempo médio de análise: ___ ms (meta: < 500ms)
- Uso médio de memória: ___ MB (meta: < 30MB)
- Crashes/erros: ___ (meta: 0)

### UX
- Overlay aparece claramente: [ ] Sim [ ] Não
- Explicações são úteis: [ ] Sim [ ] Não
- Interface intuitiva: [ ] Sim [ ] Não

---

## 🐛 BUGS ENCONTRADOS

| # | Descrição | Severidade | Status |
|---|-----------|------------|--------|
| 1 |           | [ ] Crítico [ ] Alto [ ] Médio [ ] Baixo | [ ] Aberto [ ] Resolvido |
| 2 |           | [ ] Crítico [ ] Alto [ ] Médio [ ] Baixo | [ ] Aberto [ ] Resolvido |
| 3 |           | [ ] Crítico [ ] Alto [ ] Médio [ ] Baixo | [ ] Aberto [ ] Resolvido |

---

## ✅ CHECKLIST FINAL PRÉ-LANÇAMENTO

- [ ] Todos os 10 testes passaram
- [ ] Taxa de falsos positivos < 10%
- [ ] Performance aceitável (< 2s análise)
- [ ] Sem crashes em navegação normal
- [ ] Documentação completa (README, INSTALL)
- [ ] Ícones funcionais
- [ ] Código comentado e organizado
- [ ] Git commit + tag versão

**RESULTADO GERAL:** 
- [ ] ✅ APROVADO PARA LANÇAMENTO
- [ ] ⚠️ PRECISA AJUSTES
- [ ] ❌ NÃO APROVADO

---

**HAI! TESTE COM RIGOR!** 🐺⚔️

*Última atualização: 26/12/2025*
