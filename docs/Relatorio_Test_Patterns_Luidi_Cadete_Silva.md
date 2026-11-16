# Implementando Padrões de Teste

(Test Patterns)

PUC Minas

Disciplina — Testes de Software

Aluno — Luidi Cadete Silva

Matrícula — a informar

16 de novembro de 2026

<!-- pagebreak -->

# Criação de dados de teste

O `CheckoutService` recebe um carrinho com um usuário e uma lista de itens. A suíte usa as classes reais do domínio para exercitar a identificação do cliente Premium e a soma dos preços dos itens.

## Object Mother e Data Builder

Uma Object Mother fornece objetos de teste conhecidos por meio de métodos de fábrica nomeados. `UserMother.umUsuarioPadrao()` e `UserMother.umUsuarioPremium()` representam as duas categorias usadas pelo checkout. Cada chamada cria um `User` novo. Assim, identidade, nome e e-mail ficam em um só lugar, e alterar um usuário durante um teste preserva os dados preparados para outros casos.

O Data Builder parte de valores válidos e permite alterar cada aspecto do objeto antes de construí-lo. `CarrinhoBuilder` começa com um usuário padrão e um item de R$ 50. A API fluente permite combinar `.comUser(user)`, `.comItens(itens)` ou `.vazio()` antes de `.build()`. Um `CarrinhoMother` com métodos para cada combinação de tipo de usuário, composição de itens e carrinho vazio cresceria a cada novo caso. No Builder, essas variações são configuradas pelos mesmos métodos.

## Antes — montagem manual do carrinho Premium

```js
const usuarioPremium = new User(
    2, 'Cliente Premium', 'premium@email.com', 'PREMIUM'
);
const produtoA = new Item('Produto A', 120);
const produtoB = new Item('Produto B', 80);
const carrinho = new Carrinho(usuarioPremium, [produtoA, produtoB]);
```

## Depois — trecho do teste Premium

```js
const usuarioPremium = UserMother.umUsuarioPremium();
const carrinho = new CarrinhoBuilder()
    .comUser(usuarioPremium)
    .comItens([new Item('Produto A', 120), new Item('Produto B', 80)])
    .build();
```

Os dois trechos montam o mesmo carrinho de R$ 200. O segundo deixa à vista os fatores que explicam a expectativa de R$ 180: a categoria Premium e os preços de R$ 120 e R$ 80. Os detalhes de construção e os dados comuns ficam centralizados, o que reduz o risco de Obscure Setup e concentra futuras alterações na preparação dos objetos.

<!-- pagebreak -->

# Dublês e verificações do checkout

## Stubs e Mock no teste Premium

O `GatewayPagamento` atua principalmente como Stub. A resposta `{ success: true }` permite que o serviço avance para persistência e notificação. O `PedidoRepository` também é Stub: devolve o `Pedido` preparado para o teste, com o ID `PRE-202`. O teste verifica o pedido recebido pelo repositório e se o checkout devolve a mesma instância retornada por ele.

```js
const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: true }) };
const pedidoSalvo = new Pedido('PRE-202', carrinho, 180, 'PROCESSADO');
const repositoryStub = { salvar: jest.fn().mockResolvedValue(pedidoSalvo) };
const emailMock = { enviarEmail: jest.fn().mockResolvedValue(undefined) };
```

O `EmailService` atua como Mock porque a expectativa recai sobre a interação: uma chamada para `premium@email.com` com o assunto de aprovação e o corpo que combina o ID salvo e o total com desconto. `jest.fn()` permite controlar respostas e registrar chamadas na mesma função. A finalidade do dublê no cenário determina seu papel.

## Estado e comportamento

A verificação de estado confere o resultado observável. No teste de recusa, `expect(pedido).toBeNull()` verifica o retorno. No teste Premium, a identidade de `resultado` e seu `totalFinal` mostram o que o checkout entrega ao chamador. A verificação de comportamento observa as interações: o gateway recebe R$ 180 e o cartão, e o e-mail é enviado com os argumentos abaixo.

```js
expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartaoCredito);
expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
expect(emailMock.enviarEmail).toHaveBeenCalledWith(
    'premium@email.com',
    'Seu Pedido foi Aprovado!',
    'Pedido PRE-202 no valor de R$180'
);
```

## Conclusão

Os builders reduzem a repetição no Arrange e tornam explícitos os dados que influenciam cada cenário. Os dublês eliminam a dependência de rede, banco e envio de mensagens na execução da suíte. Com asserções sobre retornos e interações de negócio, uma falha aponta para um contrato identificável e a suíte continua fácil de manter quando novos cenários forem adicionados.
