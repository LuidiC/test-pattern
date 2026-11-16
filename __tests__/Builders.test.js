import { Carrinho } from '../src/domain/Carrinho.js';
import { Item } from '../src/domain/Item.js';
import { User } from '../src/domain/User.js';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { UserMother } from './builders/UserMother.js';

describe('dados de teste do checkout', () => {
    test('a Object Mother cria usuários reais e independentes', () => {
        // Arrange & Act
        const padrao = UserMother.umUsuarioPadrao();
        const premium = UserMother.umUsuarioPremium();

        // Assert
        expect(padrao).toBeInstanceOf(User);
        expect(padrao.isPremium()).toBe(false);
        expect(premium).toBeInstanceOf(User);
        expect(premium.isPremium()).toBe(true);
        expect(premium.email).toBe('premium@email.com');
        expect(padrao).not.toBe(UserMother.umUsuarioPadrao());
        expect(premium).not.toBe(UserMother.umUsuarioPremium());
    });

    test('o Builder cria um carrinho vazio com total zero', () => {
        // Arrange
        const builder = new CarrinhoBuilder();

        // Act
        const carrinho = builder.vazio().build();

        // Assert
        expect(carrinho).toBeInstanceOf(Carrinho);
        expect(carrinho.itens).toEqual([]);
        expect(carrinho.calcularTotal()).toBe(0);
    });

    test('alterar um carrinho padrão não afeta outro builder', () => {
        // Arrange
        const primeiro = new CarrinhoBuilder().build();
        const segundoBuilder = new CarrinhoBuilder();

        // Act
        primeiro.user.email = 'alterado@email.com';
        primeiro.itens[0].preco = 90;
        primeiro.itens.push(new Item('Outro item', 10));
        const segundo = segundoBuilder.build();

        // Assert
        expect(segundo.user.email).toBe('padrao@email.com');
        expect(segundo.itens).toEqual([new Item('Item padrão', 50)]);
        expect(segundo.calcularTotal()).toBe(50);
    });
});
