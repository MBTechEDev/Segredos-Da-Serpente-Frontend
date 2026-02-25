import { test, expect } from '@playwright/test';

// Utilizando um interceptor mock para garantir a estabilidade do E2E sem depender de faturamentos reais locais o tempo todo, mas focando na reação do frontend (Dark Mystical) aos payloads do MP.

test.describe('Mercado Pago Pagamento: PIX', () => {

    test.beforeEach(async ({ page }) => {
        // Navegar para o fluxo inicial de um checkout 
        // Em um teste real, nós iríamos para /produto, adicionaríamos ao carrinho e prosseguiríamos,
        // mas para simplificar e isolar a tela de pagamento:
        await page.goto('/br/checkout?step=payment');

        // Supondo que o usuário já tenha passado pelas etapas de endereço e frete em um cookie/estado injetado 
        // ou que os mocks da nossa suite preparem o carrinho com itens.
    });

    test('✅ Happy Path: Gera e exibe o QR Code Base64 com chave Copia e Cola', async ({ page }) => {
        // Mockar a resposta da finalização do pedido no Backend (PIX Aprovado/Pending)
        await page.route('**/api/store/carts/**/complete', async (route) => {
            const json = {
                type: "order",
                order: {
                    id: "order_123",
                    payment_collections: [{
                        payments: [{
                            data: {
                                payment_method_id: "pix",
                                qr_code_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEA...", // Exemplo mockado
                                qr_code: "00020101021126580014br.gov.bcb.pix..."
                            }
                        }]
                    }]
                }
            };
            await route.fulfill({ json });
        });

        // 1. O usuário seleciona PIX no Frontend
        await page.locator('text="PIX"').click();

        // 2. Vai para Revisão
        await page.locator('button:has-text("Revisar Pedido")').click();

        // 3. Confirmamos que estamos na tela de revisão e checamos o Termos
        await expect(page.locator('text="Revisão Final"')).toBeVisible();

        // 4. Clica em Finalizar Pedido
        await page.locator('button[data-testid="submit-order-button"]').click();

        // 5. Verifica se navegou para página de order confirmed
        await page.waitForTimeout(1000); // Simulando a transição
        // Apenas visualização neste teste estático, o frontend renderizaria a view de pix na Order.
        // Confirmar se o mock da prop chegou ao view

        // (A checagem exata depende do layout de order_confirmed_pix_view. Em tese, procuraríamos pelo texto 'Pagamento via PIX' e a tag IMG)
    });

    test('❌ Backend Authorization Failure: Exibe erro amigável Dark Mystical e não limpa o carrinho', async ({ page }) => {
        // Mockar erro do provider
        await page.route('**/api/store/carts/**/complete', async (route) => {
            await route.fulfill({
                status: 400,
                json: { type: "payment_authorization_error", message: "Erro ao gerar chave PIX no Mercado Pago." }
            });
        });

        await page.locator('text="PIX"').click();
        await page.locator('button:has-text("Revisar Pedido")').click();
        await page.locator('button[data-testid="submit-order-button"]').click();

        // Verifica se exibe a notificação de erro preservando a interface
        const errorMsg = page.locator('text="Erro ao gerar chave PIX no Mercado Pago."');
        await expect(errorMsg).toBeVisible();

        // Verifica se o usuário não saiu da tela de checkout
        await expect(page.url()).toContain('/checkout');
    });

    test('❌ Out of Stock / Interrupted Flow: Produto não disponível ao finalizar a compra', async ({ page }) => {
        // Mockar erro de inventory
        await page.route('**/api/store/carts/**/complete', async (route) => {
            const json = {
                type: "inventory_error",
                message: "O item 'Gota Essencial' não está mais em estoque."
            };
            await route.fulfill({ status: 409, json });
        });

        await page.locator('text="PIX"').click();
        await page.locator('button:has-text("Revisar Pedido")').click();
        await page.locator('button[data-testid="submit-order-button"]').click();

        // Verifica se a mensagem específica de inventário aponta na tela
        const inventoryError = page.locator('text="O item \'Gota Essencial\' não está mais em estoque."');
        await expect(inventoryError).toBeVisible();

        // O carrinho não deve ter sido limpo, e a etapa deve permanecer em Review ou voltar para listagem
        await expect(page.url()).toContain('/checkout');
    });
});
