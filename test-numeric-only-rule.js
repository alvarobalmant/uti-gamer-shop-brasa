// Teste para verificar a regra de rejeição por compatibilidade apenas numérica
import { calculateTokenCompatibility } from './src/utils/tokenCompatibilitySearch.js';

console.log('🧪 Testando Regra de Rejeição por Compatibilidade Apenas Numérica\n');

// Casos de teste
const testCases = [
  {
    name: 'Caso 1: Far Cry 6 vs Street Fighter 6 (DEVE SER REJEITADO)',
    query: 'far cry 6',
    tagName: 'Street Fighter 6',
    tagWeight: 5,
    expectedRejection: true
  },
  {
    name: 'Caso 2: Far Cry 6 vs Far Cry 6 (DEVE SER ACEITO)',
    query: 'far cry 6',
    tagName: 'Far Cry 6',
    tagWeight: 5,
    expectedRejection: false
  },
  {
    name: 'Caso 3: FIFA 25 vs PES 25 (DEVE SER REJEITADO)',
    query: 'fifa 25',
    tagName: 'PES 25',
    tagWeight: 4,
    expectedRejection: true
  },
  {
    name: 'Caso 4: FIFA 25 vs FIFA 25 (DEVE SER ACEITO)',
    query: 'fifa 25',
    tagName: 'FIFA 25',
    tagWeight: 4,
    expectedRejection: false
  },
  {
    name: 'Caso 5: GTA V vs FIFA V (DEVE SER REJEITADO)',
    query: 'gta v',
    tagName: 'FIFA V',
    tagWeight: 3,
    expectedRejection: true
  },
  {
    name: 'Caso 6: Busca apenas numérica: 6 vs Street Fighter 6 (DEVE SER ACEITO)',
    query: '6',
    tagName: 'Street Fighter 6',
    tagWeight: 5,
    expectedRejection: false // Não há tokens não-numéricos na query
  },
  {
    name: 'Caso 7: Call of Duty vs Call of Duty Modern Warfare (DEVE SER ACEITO)',
    query: 'call of duty',
    tagName: 'Call of Duty Modern Warfare',
    tagWeight: 5,
    expectedRejection: false // Há matches não-numéricos
  }
];

// Executar testes
let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`\n${testCase.name}`);
  console.log(`Query: "${testCase.query}"`);
  console.log(`Tag: "${testCase.tagName}"`);
  
  try {
    const result = calculateTokenCompatibility(testCase.query, testCase.tagName, testCase.tagWeight);
    
    console.log(`Matches: ${result.matches.map(m => `"${m.queryToken}"→"${m.tagToken}"`).join(', ')}`);
    console.log(`Score: ${result.finalScore.toFixed(1)}`);
    console.log(`Rejeitado: ${result.rejectedByNumericOnlyRule ? 'SIM' : 'NÃO'}`);
    
    // Verificar se o resultado está correto
    const actualRejection = result.rejectedByNumericOnlyRule || false;
    const testPassed = actualRejection === testCase.expectedRejection;
    
    if (testPassed) {
      console.log('✅ PASSOU');
      passedTests++;
    } else {
      console.log('❌ FALHOU');
      console.log(`   Esperado: ${testCase.expectedRejection ? 'REJEITADO' : 'ACEITO'}`);
      console.log(`   Obtido: ${actualRejection ? 'REJEITADO' : 'ACEITO'}`);
    }
    
  } catch (error) {
    console.log('❌ ERRO:', error.message);
  }
});

console.log(`\n📊 Resultado Final: ${passedTests}/${totalTests} testes passaram`);

if (passedTests === totalTests) {
  console.log('🎉 Todos os testes passaram! A regra está funcionando corretamente.');
} else {
  console.log('⚠️  Alguns testes falharam. Verifique a implementação.');
}
