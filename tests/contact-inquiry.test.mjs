import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { rfq } from '../src/i18n/rfq.mjs';

const routes = { en: '/en/rfq/', id: '/id/rfq/', zh: '/zh-cn/rfq/' };

for (const [locale, path] of Object.entries(routes)) {
  test(`${locale} contact links to the official RFQ page`, () => {
    const page = readFileSync(new URL(`../src/pages/${locale}/contact.astro`, import.meta.url), 'utf8');
    assert.match(page, new RegExp(`const locale = '${locale}';`));
    assert.match(page, /import ContactInquiry from '\.\.\/\.\.\/components\/ContactInquiry\.astro'/);
    assert.match(page, /<ContactInquiry \{locale\} \/>/);
    assert.doesNotMatch(page, /<form\b/);
    assert.equal(rfq[locale].href, `https://biosphere-ai.com${path}`);
    assert.ok(rfq[locale].action.trim());
  });
}

test('the shared inquiry link is a native anchor with localized text', () => {
  const component = readFileSync(new URL('../src/components/ContactInquiry.astro', import.meta.url), 'utf8');
  assert.match(component, /const copy = rfq\[locale\]/);
  assert.match(component, /<a href=\{copy\.href\}[^>]*>\{copy\.action\}<\/a>/);
  assert.equal(new Set(Object.values(rfq).map(({ action }) => action)).size, 3);
  assert.doesNotMatch(component, /<form\b|<script\b/);
});
