import applyAttributesSet from '../src/index';

describe('applyAttributesSet', () => {

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

    applyAttributesSet({ set: 'set1' });
    expect(el.className).toBe('test-class');

    applyAttributesSet({ set: 'set2' });
    expect(el.className).toBe('test-class2');

    applyAttributesSet({ set: 'set1' });
    expect(el.className).toBe('test-class');
  });

  it('applies attributes with the custom attribute name', () => {
    document.body.innerHTML = /*html*/ `
      <div id="nomatch" data-attr-sets='{"my-set1": {"class": "test-class1"}}'></div>
      <div id="match" my-attrs='{"my-set1": {"class": "test-class2"}}'></div>
      `;
    const elNoMatch = document.querySelector('#nomatch')!;
    const elMatch = document.querySelector('#match')!;

    applyAttributesSet({ set: 'my-set1', attributeName: 'my-attrs' });
    expect(elNoMatch.className).toBe('');
    expect(elMatch.className).toBe('test-class2');
  });

  // @todo Write more tests.

});
