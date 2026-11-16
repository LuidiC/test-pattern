# Implementando Padrões de Teste (Test Patterns)

Trabalho da disciplina **Testes de Software** da **PUC Minas**. Aluno **Luidi Cadete Silva**.

A atividade constrói uma suíte de testes unitários para o serviço de checkout de um e-commerce simulado. O código de produção em `src/` foi fornecido por [Cleiton Silva no repositório original](https://github.com/CleitonSilvaT/test-pattern). Este fork acrescenta os padrões de teste, as suítes e o relatório acadêmico.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `src/domain/` e `src/services/` | Entidades de negócio, checkout e contratos das dependências do projeto-base |
| `__tests__/CheckoutService.test.js` | Testes do checkout com dublês injetados |
| `__tests__/Builders.test.js` | Testes de criação e isolamento dos dados |
| `__tests__/builders/` | `UserMother.js` e `CarrinhoBuilder.js` |
| `entrega/` | [Relatório acadêmico em PDF](entrega/Relatorio_Test_Patterns_Luidi_Cadete_Silva.pdf) |
| `docs/` | [Fonte do relatório](docs/Relatorio_Test_Patterns_Luidi_Cadete_Silva.md) e [auditoria pré-publicação](docs/AUDITORIA_PRE_PUSH.md) |

## Padrões aplicados

- **Object Mother** fornece usuários padrão e Premium com os dados fixos de cada perfil.
- **Data Builder** monta um carrinho real com valores padrão e customização fluente de usuário e itens, incluindo carrinho vazio.
- **Stub** controla o resultado da cobrança e simula o retorno da persistência. A recusa permite verificar que o checkout retorna `null`.
- **Mock** permite verificar as interações do checkout. O dublê de e-mail registra a chamada e seus argumentos. A função `jest.fn()` também oferece essas verificações nos Stubs quando a interação faz parte do contrato.

## Cenários

| Cenário | Verificação |
| --- | --- |
| Pagamento recusado | Tentativa de cobrança com valor e cartão corretos, retorno `null` e ausência de persistência e e-mail |
| Cliente padrão | Cobrança de R$ 200, persistência do pedido processado e envio da confirmação com o ID salvo |
| Cliente Premium | Cobrança de R$ 180 sobre R$ 200, persistência do pedido processado e confirmação enviada uma vez com o destinatário, assunto, ID e total corretos |
| Falha de e-mail | Registro da falha e retorno do pedido salvo |
| Dados de teste | Usuários reais e independentes, carrinho vazio com total zero e isolamento entre builders |

## Execução

Requer Node.js e npm. A validação local usou Node.js 24.14.1, npm 11.11.0 e Jest 29.7.0. Faça um fork e clone-o para trabalhar em sua própria cópia. Para executar a suíte, rode os comandos na raiz de um clone.

```bash
npm install
npm test -- --runInBand
npm run coverage -- --runInBand
```

Para acompanhar alterações durante o desenvolvimento, execute `npm test -- --watch`. As duas suítes passaram com sete testes aprovados e zero reprovados nos comandos de teste e cobertura. O Jest reportou 100% de instruções, funções e linhas e 66,66% de ramos nos arquivos instrumentados.

O Jest usa o preset Babel já declarado para transformar os imports ES durante os testes. A descoberta considera os arquivos `*.test.js` em `__tests__/`, e os módulos de dados são importados por essas suítes.
