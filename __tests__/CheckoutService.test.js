import { Item } from '../src/domain/Item.js';
import { Pedido } from '../src/domain/Pedido.js';
import { CheckoutService } from '../src/services/CheckoutService.js';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { UserMother } from './builders/UserMother.js';

const cartaoCredito = 'cartao-de-teste';

describe('quando o pagamento falha', () => {
    test('retorna null sem persistir pedido nem enviar e-mail', async () => {
        // Arrange
        const carrinho = new CarrinhoBuilder().build();
        const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: false }) };
        const repositoryDouble = { salvar: jest.fn() };
        const emailDouble = { enviarEmail: jest.fn() };
        const checkoutService = new CheckoutService(gatewayStub, repositoryDouble, emailDouble);

        // Act
        const pedido = await checkoutService.processarPedido(carrinho, cartaoCredito);

        // Assert — verificação de estado seguida das verificações de comportamento.
        expect(pedido).toBeNull();
        expect(gatewayStub.cobrar).toHaveBeenCalledTimes(1);
        expect(gatewayStub.cobrar).toHaveBeenCalledWith(50, cartaoCredito);
        expect(repositoryDouble.salvar).not.toHaveBeenCalled();
        expect(emailDouble.enviarEmail).not.toHaveBeenCalled();
    });
});

describe('quando um cliente padrão finaliza a compra', () => {
    test('cobra o total integral, persiste o pedido e envia a confirmação', async () => {
        // Arrange
        const usuarioPadrao = UserMother.umUsuarioPadrao();
        const carrinho = new CarrinhoBuilder()
            .comUser(usuarioPadrao)
            .comItens([new Item('Produto', 200)])
            .build();
        const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: true }) };
        const pedidoSalvo = new Pedido('PAD-101', carrinho, 200, 'PROCESSADO');
        const repositoryStub = { salvar: jest.fn().mockResolvedValue(pedidoSalvo) };
        const emailMock = { enviarEmail: jest.fn().mockResolvedValue(undefined) };
        const checkoutService = new CheckoutService(gatewayStub, repositoryStub, emailMock);

        // Act
        const resultado = await checkoutService.processarPedido(carrinho, cartaoCredito);

        // Assert
        expect(gatewayStub.cobrar).toHaveBeenCalledTimes(1);
        expect(gatewayStub.cobrar).toHaveBeenCalledWith(200, cartaoCredito);
        expect(repositoryStub.salvar).toHaveBeenCalledTimes(1);
        const [pedidoPreparado] = repositoryStub.salvar.mock.calls[0];
        expect(pedidoPreparado).toBeInstanceOf(Pedido);
        expect(pedidoPreparado).toEqual(new Pedido(null, carrinho, 200, 'PROCESSADO'));
        expect(resultado).toBe(pedidoSalvo);
        expect(resultado.totalFinal).toBe(200);
        expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
        expect(emailMock.enviarEmail).toHaveBeenCalledWith(
            'padrao@email.com',
            'Seu Pedido foi Aprovado!',
            'Pedido PAD-101 no valor de R$200'
        );
    });
});

describe('quando um cliente Premium finaliza a compra', () => {
    test('aplica 10% de desconto, persiste o pedido e envia o e-mail com o ID salvo', async () => {
        // Arrange
        const usuarioPremium = UserMother.umUsuarioPremium();
        const carrinho = new CarrinhoBuilder()
            .comUser(usuarioPremium)
            .comItens([new Item('Produto A', 120), new Item('Produto B', 80)])
            .build();
        const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: true }) };
        const pedidoSalvo = new Pedido('PRE-202', carrinho, 180, 'PROCESSADO');
        const repositoryStub = { salvar: jest.fn().mockResolvedValue(pedidoSalvo) };
        const emailMock = { enviarEmail: jest.fn().mockResolvedValue(undefined) };
        const checkoutService = new CheckoutService(gatewayStub, repositoryStub, emailMock);

        // Act
        const resultado = await checkoutService.processarPedido(carrinho, cartaoCredito);

        // Assert
        expect(carrinho.calcularTotal()).toBe(200);
        expect(gatewayStub.cobrar).toHaveBeenCalledTimes(1);
        expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartaoCredito);
        expect(repositoryStub.salvar).toHaveBeenCalledTimes(1);
        const [pedidoPreparado] = repositoryStub.salvar.mock.calls[0];
        expect(pedidoPreparado).toBeInstanceOf(Pedido);
        expect(pedidoPreparado).toEqual(new Pedido(null, carrinho, 180, 'PROCESSADO'));
        expect(resultado).toBe(pedidoSalvo);
        expect(resultado.totalFinal).toBe(180);
        expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
        expect(emailMock.enviarEmail).toHaveBeenCalledWith(
            'premium@email.com',
            'Seu Pedido foi Aprovado!',
            'Pedido PRE-202 no valor de R$180'
        );
    });
});

describe('quando o envio da confirmação falha', () => {
    test('registra a falha e retorna o pedido salvo', async () => {
        // Arrange
        const carrinho = new CarrinhoBuilder().build();
        const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: true }) };
        const pedidoSalvo = new Pedido('PAD-303', carrinho, 50, 'PROCESSADO');
        const repositoryStub = { salvar: jest.fn().mockResolvedValue(pedidoSalvo) };
        const erro = new Error('Serviço de e-mail indisponível');
        const emailMock = { enviarEmail: jest.fn().mockRejectedValue(erro) };
        const checkoutService = new CheckoutService(gatewayStub, repositoryStub, emailMock);
        const logErro = jest.spyOn(console, 'error').mockImplementation(() => {});

        try {
            // Act
            const resultado = await checkoutService.processarPedido(carrinho, cartaoCredito);

            // Assert
            expect(resultado).toBe(pedidoSalvo);
            expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
            expect(logErro).toHaveBeenCalledWith('Falha ao enviar e-mail', erro.message);
        } finally {
            logErro.mockRestore();
        }
    });
});
