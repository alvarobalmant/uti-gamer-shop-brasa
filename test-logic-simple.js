// Teste simples da lógica de rejeição por compatibilidade apenas numérica

console.log('🧪 Testando Lógica de Rejeição por Compatibilidade Apenas Numérica\n');

// Simular a lógica implementada
function testNumericOnlyRule(queryTokens, tagTokens, matches) {
  console.log(`Query tokens: [${queryTokens.join(', ')}]`);
  console.log(`Tag tokens: [${tagTokens.join(', ')}]`);
  console.log(`Matches: [${matches.join(', ')}]`);
  
  // Simular análise de tipos (simplificada)
  const isNumeric = (token) => /^\d+$/.test(token) || ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'].includes(token.toLowerCase());
  
  // Verificar se todos os matches são apenas numéricos
  const allMatchesAreNumeric = matches.every(match => {
    const [queryToken, tagToken] = match.split('→');
    return isNumeric(queryToken.trim()) && isNumeric(tagToken.trim());
  });
  
  // Verificar se existem tokens não-numéricos na query
  const hasNonNumericQueryTokens = queryTokens.some(token => !isNumeric(token));
  
  // Aplicar regra
  const shouldReject = allMatchesAreNumeric && hasNonNumericQueryTokens;
  
  console.log(`Todos matches são numéricos: ${allMatchesAreNumeric}`);
  console.log(`Query tem tokens não-numéricos: ${hasNonNumericQueryTokens}`);
  console.log(`Resultado: ${shouldReject ? 'REJEITADO ❌' : 'ACEITO ✅'}`);
  
  return shouldReject;
}

// Casos de teste
const testCases = [
  {
    name: 'Caso 1: Far Cry 6 vs Street Fighter 6',
    queryTokens: ['far', 'cry', '6'],
    tagTokens: ['street', 'fighter', '6'],
    matches: ['6→6'],
    expectedRejection: true
  },
  {
    name: 'Caso 2: Far Cry 6 vs Far Cry 6',
    queryTokens: ['far', 'cry', '6'],
    tagTokens: ['far', 'cry', '6'],
    matches: ['far→far', 'cry→cry', '6→6'],
    expectedRejection: false
  },
  {
    name: 'Caso 3: FIFA 25 vs PES 25',
    queryTokens: ['fifa', '25'],
    tagTokens: ['pes', '25'],
    matches: ['25→25'],
    expectedRejection: true
  },
  {
    name: 'Caso 4: Busca apenas numérica: 6 vs Street Fighter 6',
    queryTokens: ['6'],
    tagTokens: ['street', 'fighter', '6'],
    matches: ['6→6'],
    expectedRejection: false // Não há tokens não-numéricos na query
  }
];

// Executar testes
let passedTests = 0;
testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  
  const result = testNumericOnlyRule(testCase.queryTokens, testCase.tagTokens, testCase.matches);
  
  if (result === testCase.expectedRejection) {
    console.log('✅ PASSOU\n');
    passedTests++;
  } else {
    console.log(`❌ FALHOU - Esperado: ${testCase.expectedRejection ? 'REJEITADO' : 'ACEITO'}\n`);
  }
});

console.log(`📊 Resultado: ${passedTests}/${testCases.length} testes passaram`);

if (passedTests === testCases.length) {
  console.log('🎉 Lógica está correta! Pode prosseguir com a implementação.');
} else {
  console.log('⚠️  Lógica precisa ser ajustada.');
}
