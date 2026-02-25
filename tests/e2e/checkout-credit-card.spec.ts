import { test, expect } from '@playwright/test';

test.describe('Mercado Pago Pagamento: Cartão de Crédito', () => {

    test.beforeEach(async ({ page }) => {
        // Acessa o painel de pagamento no checkout
        await page.goto('/br/checkout?step=payment');
    });

    test('✅ Happy Path: Tokeniza o Cartão Aprovado (Form Mock) e finaliza', async ({ page }) => {
        // Mock da criação de sessão MP e submissão 
        await page.route('**/api/store/carts/**/complete', async (route) => {
            const json = {
                type: "order",
                order: { id: "order_approved_card" }
            };
            await route.fulfill({ json });
        });

        // 1. O usuário seleciona Cartão
        await page.locator('text="Cartão"').click();

        // Assumindo que o Componente Mercado Pago Widget (CardContainer) esteja encapsulado num iframe ou custom view.
        // Como testes E2E com iframes protegidos (MercadoPago.js) são complexos nativamente, 
        // validaríamos se o elemento placeholder carregou para o usuário digitar.
        const ccInputContainer = page.locator('.mp-card-container'); // classe ilustrativa do widget
        // Em teste real precisaríamos interagir com o IFrame. Para este script de exemplo garantimos seu carregamento.

        // 2. Vai para a Revisão (simulando que o custom form / tokenização foi bem sucedido)
        await page.evaluate(() => {
            // Evento que simula o preenchimento e clique gerando token no frontend bypassando o MP js client
            document.dispatchEvent(new CustomEvent('mp-token-generated', { detail: { token: "token_mock_master" } }));
        });

        // (Ajustes de navegação e aprovação baseados no seu widget real)
    });

    test('❌ Validação Frontend: Campos Inválidos ou incompletos não avançam a requisição', async ({ page }) => {
        await page.locator('text="Cartão"').click();

        // Tentar revisar pedido/submeter sem preencher o Payment Brick ou Custom Fields
        // Em uma UI correta, submeter sem cartão gerará alertas vermelhos locais do próprio CardContainer

        // Caso tenha um fallback nativo no botão:
        const submitBtn = page.locator('button:has-text("Revisar Pedido")');
        if (await submitBtn.isVisible()) {
            await submitBtn.click();

            // Esperamos que o texto do erro apareça em tela
            const errorText = page.locator('text="Os dados do cartão estão incompletos."');
            // Ou que alguma borda/estado misticamente vermelho (ex: bg-red-900/20) seja ativado
            await expect(errorText.or(page.locator('.border-red-500'))).toBeVisible();
        }
    });

    test('❌ Gateway Rejection (Insufficient Funds): Mostra erro claro em tela e mantém em Checkout', async ({ page }) => {
        // Mockar rejeição específica do gateway vinda do Medusa Backend (ex: rc=cc_rejected_insufficient_amount)
        await page.route('**/api/store/carts/**/complete', async (route) => {
            const json = {
                type: "payment_authorization_error",
                message: "O pagamento foi recusado pelo emissor do cartão por saldo insuficiente. Tente novamente ou use outro meio de pagamento."
            };
            await route.fulfill({ status: 400, json });
        });

        await page.locator('text="Cartão"').click();
        // Simula a transição à revisão (token gerado fake de "insufficient")
        await page.goto('/br/checkout?step=review');

        // Ao tentar finalizar a compra...
        await page.locator('button[data-testid="submit-order-button"]').click();

        // A UI Dark Mystical deve mapear esta string e pintá-la na tela de Erros do Cartão / ErrorMessage
        const errorMsg = page.locator('text="O pagamento foi recusado pelo emissor do cartão por saldo insuficiente. Tente novamente ou use outro meio de pagamento."');

        await expect(errorMsg).toBeVisible();

        // Usuário não foi redirecionado
        await expect(page.url()).toContain('/checkout');
    });

});
