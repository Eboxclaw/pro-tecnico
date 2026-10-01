import test from 'node:test';
import assert from 'node:assert/strict';
import { paymentMethods, enabledPaymentMethods, paymentMethodById } from '../src/lib/payments/index.ts';

test('the payment registry covers exactly the six agreed methods with providers', () => {
  const ids = paymentMethods().map(m => m.id).sort();
  assert.deepEqual(ids, ['applepay', 'card', 'crypto', 'googlepay', 'mbway', 'paypal']);
  for (const method of paymentMethods()) {
    assert.ok(['stripe', 'ifthenpay', 'coinbase'].includes(method.provider), `${method.id} provider`);
    assert.ok(method.label.length > 2 && method.notePt.length > 10, `${method.id} copy`);
    assert.equal(typeof method.enabled, 'function');
  }
  assert.equal(paymentMethodById('mbway')?.provider, 'ifthenpay');
  assert.equal(paymentMethodById('crypto')?.provider, 'coinbase');
  assert.equal(paymentMethodById('card')?.provider, 'stripe');
});

test('without keys every method stays disabled and nothing breaks', () => {
  const previousPk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const previousPaypal = import.meta.env.VITE_STRIPE_PAYPAL_ENABLED;
  const previousIfthenpay = import.meta.env.VITE_IFTHENPAY_ENABLED;
  const previousCoinbase = import.meta.env.VITE_COINBASE_ENABLED;
  try {
    delete import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    delete import.meta.env.VITE_STRIPE_PAYPAL_ENABLED;
    delete import.meta.env.VITE_IFTHENPAY_ENABLED;
    delete import.meta.env.VITE_COINBASE_ENABLED;
    assert.equal(enabledPaymentMethods().length, 0);
  } finally {
    if (previousPk !== undefined) import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = previousPk;
    if (previousPaypal !== undefined) import.meta.env.VITE_STRIPE_PAYPAL_ENABLED = previousPaypal;
    if (previousIfthenpay !== undefined) import.meta.env.VITE_IFTHENPAY_ENABLED = previousIfthenpay;
    if (previousCoinbase !== undefined) import.meta.env.VITE_COINBASE_ENABLED = previousCoinbase;
  }
});

test('a stripe key activates card, apple pay and google pay but paypal needs its own switch', () => {
  const previousPk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const previousPaypal = import.meta.env.VITE_STRIPE_PAYPAL_ENABLED;
  try {
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = 'pk_test_example';
    delete import.meta.env.VITE_STRIPE_PAYPAL_ENABLED;
    const ids = enabledPaymentMethods().map(m => m.id).sort();
    assert.deepEqual(ids, ['applepay', 'card', 'googlepay']);
    import.meta.env.VITE_STRIPE_PAYPAL_ENABLED = 'true';
    assert.ok(enabledPaymentMethods().some(m => m.id === 'paypal'));
  } finally {
    if (previousPk !== undefined) import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = previousPk;
    else delete import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (previousPaypal !== undefined) import.meta.env.VITE_STRIPE_PAYPAL_ENABLED = previousPaypal;
    else delete import.meta.env.VITE_STRIPE_PAYPAL_ENABLED;
  }
});
