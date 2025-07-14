// Make this file a module
export {};

// Import for Jest testing - use dynamic require to work around module: "none" limitation
const AttributeSetApplyModule = require('../src/index.ts');
const AttributeSetApply = AttributeSetApplyModule.default || AttributeSetApplyModule;

describe('AttributeSetApply', () => {

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('applies attributes based on the set parameter', () => {
    document.body.innerHTML = /*html*/ `
      <div data-attr-sets='{
        "set1": {"class": "test-class"},
        "set2": {"class": "test-class2"}
      }'>
      </div>
      `;
    const el = document.querySelector('div')!

    AttributeSetApply({ set: 'set1' });
    expect(el.className).toBe('test-class');

    AttributeSetApply({ set: 'set2' });
    expect(el.className).toBe('test-class2');

    AttributeSetApply({ set: 'set1' });
    expect(el.className).toBe('test-class');
  });

  it('applies attributes with the custom attribute name', () => {
    document.body.innerHTML = /*html*/ `
      <div id="nomatch" data-attr-sets='{"my-set1": {"class": "test-class1"}}'></div>
      <div id="match" my-attrs='{"my-set1": {"class": "test-class2"}}'></div>
      `;
    const elNoMatch = document.querySelector('#nomatch')!;
    const elMatch = document.querySelector('#match')!;

    AttributeSetApply({ set: 'my-set1', attributeName: 'my-attrs' });
    expect(elNoMatch.className).toBe('');
    expect(elMatch.className).toBe('test-class2');
  });

  it('overwrites existing attributes in overwrite mode (default)', () => {
    document.body.innerHTML = /*html*/ `
      <div class="existing-class" data-attr-sets='{"set1": {"class": "new-class"}}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1', mode: 'overwrite' });
    expect(el.className).toBe('new-class');
  });

  it('appends to existing attributes in append mode', () => {
    document.body.innerHTML = /*html*/ `
      <div class="existing-class" data-attr-sets='{"set1": {"class": "new-class"}}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1', mode: 'append' });
    expect(el.className).toBe('existing-class new-class');
  });

  it('does not overwrite existing attributes in create mode', () => {
    document.body.innerHTML = /*html*/ `
      <div class="existing-class" data-attr-sets='{"set1": {"class": "new-class"}}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1', mode: 'create' });
    expect(el.className).toBe('existing-class');
  });

  it('sets new attributes in create mode when they do not exist', () => {
    document.body.innerHTML = /*html*/ `
      <div data-attr-sets='{"set1": {"class": "new-class", "id": "test-id"}}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1', mode: 'create' });
    expect(el.className).toBe('new-class');
    expect(el.id).toBe('test-id');
  });

  it('removes attributes when value is null', () => {
    document.body.innerHTML = /*html*/ `
      <div class="existing-class" data-attr-sets='{"set1": {"class": null}}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1' });
    expect(el.hasAttribute('class')).toBe(false);
  });

  it('handles string values as class attribute', () => {
    document.body.innerHTML = /*html*/ `
      <div data-attr-sets='{"set1": "string-class"}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1' });
    expect(el.className).toBe('string-class');
  });

  it('respects element-specific mode attribute', () => {
    document.body.innerHTML = /*html*/ `
      <div class="existing-class" data-attr-sets='{"set1": {"class": "new-class"}}' data-attr-sets-mode="append">
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1', mode: 'overwrite' });
    expect(el.className).toBe('existing-class new-class');
  });

  it('handles comma-separated set names', () => {
    document.body.innerHTML = /*html*/ `
      <div data-attr-sets='{"set1,set2": {"class": "shared-class"}}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1' });
    expect(el.className).toBe('shared-class');

    AttributeSetApply({ set: 'set2' });
    expect(el.className).toBe('shared-class');
  });

  it('handles setsList with plus notation', () => {
    document.body.innerHTML = /*html*/ `
      <div data-attr-sets='{"set2+": {"class": "test-class"}}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({
      set: 'set3',
      setsList: ['set1', 'set2', 'set3', 'set4']
    });
    expect(el.className).toBe('test-class');
  });

  it('handles setsList with minus notation', () => {
    document.body.innerHTML = /*html*/ `
      <div data-attr-sets='{"set3-": {"class": "test-class"}}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({
      set: 'set2',
      setsList: ['set1', 'set2', 'set3', 'set4']
    });
    expect(el.className).toBe('test-class');
  });

  it('ignores invalid JSON in data attribute', () => {
    document.body.innerHTML = /*html*/ `
      <div data-attr-sets='invalid-json'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1' });
    expect(el.className).toBe('');
  });

  it('sets applied and initial attributes', () => {
    document.body.innerHTML = /*html*/ `
      <div class="initial-class" data-attr-sets='{"set1": {"class": "new-class"}}'>
      </div>
      `;
    const el = document.querySelector('div')!;

    AttributeSetApply({ set: 'set1' });
    expect(el.hasAttribute('data-attr-sets-applied')).toBe(true);
    expect(el.getAttribute('data-attr-sets-initial')).toBe('{"class":"initial-class"}');
  });

  it('applies attributes within specified context', () => {
    document.body.innerHTML = /*html*/ `
      <div id="context">
        <div class="target" data-attr-sets='{"set1": {"class": "new-class"}}'>
        </div>
      </div>
      <div class="outside" data-attr-sets='{"set1": {"class": "should-not-change"}}'>
      </div>
      `;
    const context = document.querySelector('#context')!;
    const target = document.querySelector('.target')!;
    const outside = document.querySelector('.outside')!;

    AttributeSetApply({ set: 'set1', context });
    expect(target.className).toBe('new-class');
    expect(outside.className).toBe('outside');
  });

});
