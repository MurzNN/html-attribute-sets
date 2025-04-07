function applyAttributesSet({
  set,
  context = document,
  setsList = undefined,
  attributeName = 'data-attr-sets',
  onlyEmpty = false,
}: {
  set: string;
  context?: Document | HTMLElement;
  setsList?: string[];
  attributeName?: string;
  onlyEmpty?: boolean;
}): void {
  function parseSettings(string: string): Record<string, any> | undefined {
    let settingsRaw: Record<string, any>;
    try {
      settingsRaw = JSON.parse(string);
    } catch (e) {
      console.error(`Error parsing AttributesSets JSON settings from the string`, string);
      return;
    }

    const settings: Record<string, any> = {};
    for (const setData in settingsRaw) {
      // Support comma-separated list of keys.
        const setNames = setData.split(',');
      setNames.forEach(key => {
        if (setsList) {
          if (key.endsWith('+')) {
            const keyRaw = key.slice(0, -1);
            const keysAll = setsList;
            const startIndex = keysAll.indexOf(keyRaw);
            if (startIndex !== -1) {
              keysAll.slice(startIndex).forEach(k => {
                settings[k.trim()] = settingsRaw[key];
              });
            }
            return;
          } if (key.endsWith('-')) {
            const keyRaw = key.slice(0, -1);
            const keysAll = setsList;
            const endIndex = keysAll.indexOf(keyRaw);
            if (endIndex !== -1) {
              keysAll.slice(0, endIndex + 1).forEach(k => {
                settings[k.trim()] = settingsRaw[key];
              });
            }
            return;
          }
        }
        settings[key.trim()] = settingsRaw[key];
      });
    }
    return settings;
  }

  context.querySelectorAll(`[${attributeName}]`).forEach(el => {
    const settings = parseSettings(el.getAttribute(attributeName) || '');
    if (!settings || settings[set] === undefined) {
      return;
    }
    let attributes = settings[set];

    // If the attributes list is a string, precess it as the class attribute.
    if (typeof attributes === 'string') {
      attributes = { class: attributes };
    }

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (onlyEmpty && el.hasAttribute(key)) {
          continue;
        }
        const value = attributes[key];
        if (value === null) {
          el.removeAttribute(key);
        } else {
          el.setAttribute(key, value);
        }
      }
    }
  });
}

export default applyAttributesSet;
