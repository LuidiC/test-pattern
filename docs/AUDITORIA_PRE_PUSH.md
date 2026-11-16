# Auditoria pré-publicação — Implementando Padrões de Teste

**Aluno:** Luidi Cadete Silva · **Disciplina:** Testes de Software · **Instituição:** PUC Minas

**Data da verificação:** 16 de novembro de 2026

A matriz usa as etapas e os pesos do enunciado oficial. O sucesso padrão e a ausência de persistência e e-mail após recusa também constam do README do projeto-base. A falha de e-mail e os testes específicos dos builders são complementares.

## Matriz de rastreabilidade

| Requisito do enunciado | Critério | Status | Arquivo e ponto | Evidência verificável | Observações e pendências |
| --- | --- | --- | --- | --- | --- |
| Etapa 1. Fork na conta do aluno e clone local do fork | Preparação | ATENDIDO | [Fork](https://github.com/LuidiC/test-pattern) e configuração Git local | A API confirmou `fork=true`, `parent=CleitonSilvaT/test-pattern` e branch padrão `main`. O clone foi feito a partir do fork. | `origin` aponta para o fork. `upstream` aponta para a origem do professor. |
| Etapa 1. Instalação com `npm install` | Preparação | ATENDIDO | [package.json](../package.json) e [package-lock.json](../package-lock.json) | Instalação registrou 354 pacotes adicionados e saiu com código 0. | Lockfile versionado. |
| Etapa 1. Arquivo exigido para o checkout | Qualidade dos testes (10%) | ATENDIDO | [CheckoutService.test.js](../__tests__/CheckoutService.test.js) | Jest executou a suíte com quatro cenários. | O SUT foi preservado. |
| Etapa 2. Object Mother em `__tests__/builders/` | Padrões de criação (30%) | ATENDIDO | [UserMother.js](../__tests__/builders/UserMother.js#L3), `umUsuarioPadrao` e `umUsuarioPremium` | Os métodos estáticos instanciam `User`. A [suíte de builders](../__tests__/Builders.test.js#L8) verifica classe, perfis, e-mail Premium e identidades distintas. | Dados fixos por perfil. |
| Etapa 3. Data Builder com defaults, API fluente e `build()` | Padrões de criação (30%) | ATENDIDO | [CarrinhoBuilder.js](../__tests__/builders/CarrinhoBuilder.js#L5), construtor, `comUser`, `comItens`, `vazio`, `build` | O construtor prepara um usuário padrão e um `Item` de R$ 50. O teste Premium encadeia usuário, itens e construção. Há testes de carrinho vazio e isolamento. | A lista é copiada na configuração e na construção. Cada builder recebe defaults próprios. |
| Etapa 4. Retorno `null` sob recusa do gateway | Test Doubles (40%) e qualidade dos testes (10%) | ATENDIDO | [Pagamento recusado](../__tests__/CheckoutService.test.js#L9) | `mockResolvedValue({ success: false })` dirige o fluxo. `toBeNull()` verifica o estado. | Repositório e e-mail são funções sem implementação que registram chamadas. |
| README. Cobrança tentada e efeitos colaterais ausentes após recusa | Test Doubles (40%) | ATENDIDO | [Asserções de recusa](../__tests__/CheckoutService.test.js#L22) | A cobrança ocorre uma vez com `50` e o cartão. `salvar` e `enviarEmail` têm zero chamadas. | Asserções de comportamento. |
| README. Cliente padrão recebe pedido salvo com `totalFinal` integral | Test Doubles (40%) e qualidade dos testes (10%) | ATENDIDO | [Sucesso padrão](../__tests__/CheckoutService.test.js#L30) | O gateway recebe `200` e o cartão. O repositório recebe um `Pedido` processado e o checkout devolve a instância salva. O e-mail confirma `PAD-101` e `R$200`. | Exercita o caminho sem desconto. |
| Etapa 5. Cliente Premium com R$ 200 e desconto de 10% | Test Doubles (40%) e qualidade dos testes (10%) | ATENDIDO | [Sucesso Premium](../__tests__/CheckoutService.test.js#L65), [cobrança](../__tests__/CheckoutService.test.js#L83) | O total inicial é `200`. A cobrança ocorre uma vez com `180` e o cartão usado no checkout. | Itens reais de R$ 120 e R$ 80. |
| Etapa 5. Stub devolve o pedido salvo após aprovação | Test Doubles (40%) | ATENDIDO | [Stubs do cenário Premium](../__tests__/CheckoutService.test.js#L73), [persistência](../__tests__/CheckoutService.test.js#L86) | O gateway fornece `success: true`. O repositório recebe uma instância de `Pedido` com ID inicial `null`, o carrinho, total `180` e status `PROCESSADO`. `toBe(pedidoSalvo)` exige a identidade da instância com ID `PRE-202`. | O teste verifica os dados enviados à persistência e o valor devolvido ao chamador. |
| Etapa 5. Mock de e-mail com uma chamada e argumentos corretos | Test Doubles (40%) | ATENDIDO | [Asserções do e-mail Premium](../__tests__/CheckoutService.test.js#L92) | Foi exigida uma chamada com `premium@email.com`, `Seu Pedido foi Aprovado!` e `Pedido PRE-202 no valor de R$180`. | O corpo corresponde à interpolação usada pelo SUT. |
| Complementar. Falha no envio preserva o checkout aprovado | Qualidade dos testes (10%) | ATENDIDO | [Falha de envio](../__tests__/CheckoutService.test.js#L101) | O envio rejeita a Promise. O checkout devolve a instância salva e registra a mensagem com `console.error`. | O spy é restaurado em `finally`. |
| Complementar. Carrinho vazio e independência dos dados | Padrões de criação (30%) e qualidade dos testes (10%) | ATENDIDO | [Builders.test.js](../__tests__/Builders.test.js#L7) | Carrinho vazio tem lista vazia e total `0`. Alterar usuário e itens de um carrinho padrão preserva os defaults de outro builder. | Três testes. |
| Etapa 6. Suíte completa, isolada, com AAA | Qualidade dos testes (10%) | ATENDIDO | [CheckoutService.test.js](../__tests__/CheckoutService.test.js), [Builders.test.js](../__tests__/Builders.test.js) | Duas suítes, sete testes aprovados e zero reprovados em teste e cobertura. O checkout recebe três dublês locais em cada cenário. | O cartão é um valor sintético. O checkout real e as entidades reais são exercitados. |
| Etapa 6. Commits e push da solução para o fork | Versionamento e entrega | PARCIAL | Histórico local e [fork](https://github.com/LuidiC/test-pattern) | Commits locais registrados na branch de trabalho. `git ls-remote --heads origin` retornou somente a `main` original. | A publicação depende da revisão externa e da autorização explícita do aluno. |
| Entrega 1. Link do fork com os arquivos da solução | Entrega | PARCIAL | [Fork](https://github.com/LuidiC/test-pattern), [`__tests__/`](../__tests__) | O link identifica o fork correto. Os testes e builders estão versionados localmente. | A versão pública ainda contém a base original. |
| Entrega 2. PDF de 2 a 4 páginas com capa | Relatório escrito (20%) | PARCIAL | [PDF](../entrega/Relatorio_Test_Patterns_Luidi_Cadete_Silva.pdf), p. 1 | Três páginas. A capa traz instituição, disciplina, título, nome e data. | Matrícula obrigatória a informar. |
| Entrega 2. Builder versus Mother, Antes/Depois e legibilidade | Relatório escrito (20%) | ATENDIDO | [PDF](../entrega/Relatorio_Test_Patterns_Luidi_Cadete_Silva.pdf), p. 2, e [fonte](Relatorio_Test_Patterns_Luidi_Cadete_Silva.md) | Os dois trechos montam um carrinho Premium de R$ 200. O texto explica a combinação de variações pelo Builder, a concentração dos dados comuns e a prevenção de Obscure Setup. | O Depois reproduz a preparação do teste Premium. |
| Entrega 2. Stubs, Mock e estado/comportamento no sucesso Premium | Relatório escrito (20%) | ATENDIDO | [PDF](../entrega/Relatorio_Test_Patterns_Luidi_Cadete_Silva.pdf), p. 3 | Explica respostas predefinidas do gateway e do repositório, a verificação do e-mail e a diferença entre inspecionar o retorno e inspecionar uma chamada. Inclui código real. | O teste de recusa exemplifica verificação de estado com `toBeNull()`. |
| Entrega 2. Conclusão sobre Test Smells e sustentabilidade | Relatório escrito (20%) | ATENDIDO | [PDF](../entrega/Relatorio_Test_Patterns_Luidi_Cadete_Silva.pdf), p. 3, conclusão | Discute repetição no Arrange, isolamento de serviços e manutenção das expectativas de negócio. | Relaciona os padrões aos casos concretos. |

## Contratos verificados no projeto-base

- `User(id, nome, email, tipo = 'PADRAO')` identifica Premium por `tipo === 'PREMIUM'`. `Carrinho(user, itens = [])` soma `item.preco`. `Item(nome, preco)` traz apenas nome e preço. `Pedido(id, carrinho, totalFinal, status)` guarda os dados do pedido.
- `CheckoutService(gateway, repository, emailSvc)` injeta as dependências. `processarPedido(carrinho, cartaoCredito)` chama `cobrar(totalFinal, cartaoCredito)` com o total integral ou 90% dele. Em caso de recusa, retorna `null`.
- Na aprovação, o serviço chama `salvar(pedido)` com um `Pedido` de status `PROCESSADO` e usa o ID retornado para `enviarEmail(para, assunto, corpo)`. Uma rejeição no envio é registrada e o serviço devolve o pedido salvo. O gateway, o repositório e o e-mail concretos do projeto-base lançam erro se forem chamados diretamente.

## Execução e evidências

Ambiente Windows com Git 2.48.1.windows.1, Node.js 24.14.1, npm 11.11.0 e Jest 29.7.0. No PowerShell local foi usado o inicializador `npm.cmd`.

| Comando executado | Resultado |
| --- | --- |
| `npm.cmd install --no-audit --no-fund` | Código 0. 354 pacotes adicionados. O npm emitiu avisos de depreciação para `inflight@1.0.6` e `glob@7.2.3`, dependências transitivas da configuração original. |
| `npm.cmd test -- --runInBand` com a configuração original | Código 1. Quatro suítes detectadas, incluindo os dois builders, falharam ao carregar. Zero testes executados. O Jest reportou `SyntaxError: Cannot use import statement outside a module`. |
| `npm.cmd test -- --runInBand` após o ajuste | Código 0. Duas suítes e sete testes aprovados, zero reprovados. |
| `npm.cmd run coverage -- --runInBand` | Código 0. Duas suítes e sete testes aprovados, zero reprovados. |

Trecho da execução após o ajuste:

```text
PASS __tests__/CheckoutService.test.js
PASS __tests__/Builders.test.js

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Snapshots:   0 total
```

O [ajuste de configuração](../package.json#L15) ativou o `@babel/preset-env` já declarado no transformador `babel-jest` para o Node corrente e restringiu a descoberta a `__tests__/**/*.test.js`. Os scripts e as dependências declaradas foram mantidos. As classes de produção conservam seus imports e exports ES.

Na cobertura, os arquivos instrumentados somaram **100% de instruções, 66,66% de ramos, 100% de funções e 100% de linhas**. `CheckoutService.js` atingiu 100% nos quatro indicadores. Os ramos não exercitados são os argumentos opcionais de `User` e `Carrinho`. O relatório do Jest inclui os builders e os arquivos de produção carregados pelas suítes. As implementações concretas dos três serviços externos não foram carregadas.

## Conferência do PDF

O arquivo [`entrega/Relatorio_Test_Patterns_Luidi_Cadete_Silva.pdf`](../entrega/Relatorio_Test_Patterns_Luidi_Cadete_Silva.pdf) foi reaberto para extração de texto e renderizado em três imagens para inspeção visual. Conferi a capa, a legibilidade dos blocos de código, a paginação e as margens. As três páginas estão legíveis, sem cortes ou sobreposições. A [fonte editável](Relatorio_Test_Patterns_Luidi_Cadete_Silva.md) contém o mesmo conteúdo, incluindo a marcação de que a matrícula ainda precisa ser informada.

SHA-256 do PDF conferido com `Get-FileHash`: `8409503c6af9b76e8751008d424c58e3a81e2845811817ed826cdc6fb03785c0`.

## Conferência Git

- Cópia de trabalho em `C:\Users\Stron\Documents\Atividade de Teste - Test Pattern`, branch `trabalho/test-patterns`, criada sobre `main` no commit `d493ee6bb05e9709a4166fa82bdcc191082ca979`.
- `origin` para `https://github.com/LuidiC/test-pattern.git` e `upstream` para `https://github.com/CleitonSilvaT/test-pattern.git`, ambos verificados com `git remote -v`.
- O conector GitHub confirmou a conta `LuidiC`. A CLI `gh` não estava instalada. A credencial do Git local foi usada em memória para confirmar a mesma conta na API e criar o fork após a consulta de existência. Clone e instalação usaram acesso de rede autorizado pelo ambiente.
- `07609e7` registra testes, builders, `package.json` e `package-lock.json`. `61fff6c` registra o README, a fonte editável e o PDF. O commit `docs: registra a auditoria pré-publicação` acrescenta este arquivo e pode ser identificado com `git log -1 -- docs/AUDITORIA_PRE_PUSH.md`.
- Após os commits de implementação e relatório, `git status --short -b` exibiu somente `## trabalho/test-patterns` e `git rev-list --left-right --count origin/main...HEAD` retornou `0 2`. A verificação final após o commit da auditoria acompanha o handoff.
- `git diff --exit-code upstream/main HEAD -- src/` encerrou com código 0. `git diff --check upstream/main HEAD` não acusou problemas. `.gitignore` cobre `node_modules/` e `coverage/`. A revisão dos arquivos e a busca por padrões de credenciais nos textos versionados não encontraram tokens ou chaves privadas.
- `git ls-remote --heads origin` encontrou apenas `refs/heads/main` em `d493ee6bb05e9709a4166fa82bdcc191082ca979`. Os commits da solução permanecem locais. Nenhum push da solução, PR ou merge foi executado.

## Avaliação pelos critérios do professor

| Critério | Status | Evidência e risco remanescente |
| --- | --- | --- |
| Padrões de criação, 30% | ATENDIDO | `UserMother` instancia as categorias reais. `CarrinhoBuilder` fornece defaults, API fluente e uma instância de `Carrinho`. A suíte específica comprova o isolamento e a construção vazia. |
| Test Doubles, 40% | ATENDIDO | Stubs dirigem sucesso e recusa e devolvem pedidos salvos. O Mock de e-mail verifica quantidade e argumentos. A cobrança Premium de R$ 180 é verificada diretamente. |
| Qualidade dos testes, 10% | ATENDIDO | Os cenários de checkout seguem AAA e usam dublês locais. Dois comandos independentes do Jest passaram com sete testes. |
| Relatório escrito, 20% | PARCIAL | Três páginas validadas, com as análises, exemplos e conclusão exigidos. A matrícula ausente deixa a capa incompleta para entrega acadêmica. |

## Liberação

- [x] Fork criado e histórico original preservado.
- [x] Suítes, builders, documentação e PDF versionados localmente.
- [x] Testes, cobertura e inspeção visual registrados.
- [x] Referências públicas do fork conferidas antes da revisão.
- [ ] **Bloqueio acadêmico:** obter a matrícula verdadeira, atualizar a fonte e o PDF e conferir novamente a capa.
- [ ] **Bloqueio de publicação:** obter a aprovação da revisão externa e a autorização explícita de publicação. Só então disponibilizar a solução no fork.

**BLOQUEADO POR PENDÊNCIAS** para entrega acadêmica e publicação. O material local pode seguir para revisão externa neste checkpoint.
