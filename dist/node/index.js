"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Applies a set of attributes to elements based on a specified set name.
 *
 * The attributes are defined in a JSON string stored in a data attribute on the elements.
 * The function can be used to apply attributes to elements in a specific context (e.g.,
 * a specific part of the document) and can handle multiple sets of attributes.
 *
 * @param {Object} options - The options for applying the attributes set.
 * @param {string} options.set - The name of the set to apply.
 * @param {Document|Element} [options.context=document] - The context in which to apply the attributes.
 * @param {string[]} [options.setsList=undefined] - A list of all possible sets to handle special cases
 * (e.g., `set+` to apply all sets starting from a specific set,
 * `set-` to apply all sets up to a specific set).
 * @param {string} [options.attributeName='data-attr-sets'] - The name of the data attribute that contains the JSON string with the attributes.
 * @param {boolean} [options.mode='overwrite'|'append'|'create'] - If false, disables overwriting existing attributes if they are already set.
 * Useful to keep the predefined attributes intact.
 */
function applyAttributesSet({ set, context = document, setsList = undefined, attributeName = 'data-attr-sets', mode = 'overwrite', }) {
    // An attribute name to store the applied flag, that indicates that the attributes sets applied to the element.
    const attrNameApplied = `${attributeName}-applied`;
    // An attribute name to store the initial value of the attribute before first applying.
    const attrNameInitial = `${attributeName}-initial`;
    function parseSettings(string) {
        let settingsRaw;
        try {
            settingsRaw = JSON.parse(string);
        }
        catch (e) {
            console.error(`Error parsing Attributes Sets JSON settings from the string`, string);
            return;
        }
        const settings = {};
        for (const setOriginalName in settingsRaw) {
            // Support comma-separated list of keys.
            const setNames = setOriginalName.split(',');
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
                    }
                    if (key.endsWith('-')) {
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
                settings[key.trim()] = settingsRaw[setOriginalName];
            });
        }
        return settings;
    }
    context.querySelectorAll(`[${attributeName}]`).forEach(el => {
        const modeLocal = el.getAttribute(`${attributeName}-mode`) || mode;
        const settings = parseSettings(el.getAttribute(attributeName) || '');
        if (!settings || settings[set] === undefined) {
            return;
        }
        let attributesSet = settings[set];
        // If the attributes list is a string, precess it as the class attribute.
        if (typeof attributesSet === 'string') {
            attributesSet = { class: attributesSet };
        }
        let attributesInitial;
        let attributesInitialSet = false;
        if (el.hasAttribute(attrNameInitial)) {
            attributesInitial = JSON.parse(el.getAttribute(attrNameInitial) || '{}');
            attributesInitialSet = true;
        }
        else {
            attributesInitial = {};
        }
        for (const key in attributesSet) {
            const attrValue = el.getAttribute(key);
            if (!attributesInitialSet) {
                attributesInitial[key] = attrValue;
            }
            // Skip processing if the attribute is not empty.
            if (modeLocal == 'create'
                && (attrValue != null && attrValue !== '')) {
                continue;
            }
            if (attributesSet[key] === null) {
                el.removeAttribute(key);
            }
            else {
                if (modeLocal === 'append' && attrValue) {
                    // Append the new value to the existing one.
                    el.setAttribute(key, `${attributesInitial[key]} ${attributesSet[key]}`);
                }
                else {
                    // Overwrite the existing value or set a new one.
                    el.setAttribute(key, attributesSet[key]);
                }
            }
        }
        el.setAttribute(attrNameApplied, '1');
        if (!attributesInitialSet) {
            el.setAttribute(attrNameInitial, JSON.stringify(attributesInitial));
        }
    });
}
// Export for module usage (Jest tests, etc.) - only when modules are supported
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS environment
    module.exports = applyAttributesSet;
    module.exports.default = applyAttributesSet;
}
else if (typeof window !== 'undefined' && typeof window.define === 'function' && window.define.amd) {
    // AMD environment
    window.define([], function () {
        return applyAttributesSet;
    });
}
