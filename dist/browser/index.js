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
function applyAttributesSet(_a) {
    var set = _a.set, _b = _a.context, context = _b === void 0 ? document : _b, _c = _a.setsList, setsList = _c === void 0 ? undefined : _c, _d = _a.attributeName, attributeName = _d === void 0 ? 'data-attr-sets' : _d, _e = _a.mode, mode = _e === void 0 ? 'overwrite' : _e;
    // An attribute name to store the applied flag, that indicates that the attributes sets applied to the element.
    var attrNameApplied = "".concat(attributeName, "-applied");
    // An attribute name to store the initial value of the attribute before first applying.
    var attrNameInitial = "".concat(attributeName, "-initial");
    function parseSettings(string) {
        var settingsRaw;
        try {
            settingsRaw = JSON.parse(string);
        }
        catch (e) {
            console.error("Error parsing Attributes Sets JSON settings from the string", string);
            return;
        }
        var settings = {};
        var _loop_1 = function (setOriginalName) {
            // Support comma-separated list of keys.
            var setNames = setOriginalName.split(',');
            setNames.forEach(function (key) {
                if (setsList) {
                    if (key.endsWith('+')) {
                        var keyRaw = key.slice(0, -1);
                        var keysAll = setsList;
                        var startIndex = keysAll.indexOf(keyRaw);
                        if (startIndex !== -1) {
                            keysAll.slice(startIndex).forEach(function (k) {
                                settings[k.trim()] = settingsRaw[key];
                            });
                        }
                        return;
                    }
                    if (key.endsWith('-')) {
                        var keyRaw = key.slice(0, -1);
                        var keysAll = setsList;
                        var endIndex = keysAll.indexOf(keyRaw);
                        if (endIndex !== -1) {
                            keysAll.slice(0, endIndex + 1).forEach(function (k) {
                                settings[k.trim()] = settingsRaw[key];
                            });
                        }
                        return;
                    }
                }
                settings[key.trim()] = settingsRaw[setOriginalName];
            });
        };
        for (var setOriginalName in settingsRaw) {
            _loop_1(setOriginalName);
        }
        return settings;
    }
    context.querySelectorAll("[".concat(attributeName, "]")).forEach(function (el) {
        var modeLocal = el.getAttribute("".concat(attributeName, "-mode")) || mode;
        var settings = parseSettings(el.getAttribute(attributeName) || '');
        if (!settings || settings[set] === undefined) {
            return;
        }
        var attributesSet = settings[set];
        // If the attributes list is a string, precess it as the class attribute.
        if (typeof attributesSet === 'string') {
            attributesSet = { class: attributesSet };
        }
        var attributesInitial;
        var attributesInitialSet = false;
        if (el.hasAttribute(attrNameInitial)) {
            attributesInitial = JSON.parse(el.getAttribute(attrNameInitial) || '{}');
            attributesInitialSet = true;
        }
        else {
            attributesInitial = {};
        }
        for (var key in attributesSet) {
            var attrValue = el.getAttribute(key);
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
                    el.setAttribute(key, "".concat(attributesInitial[key], " ").concat(attributesSet[key]));
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
window.applyAttributesSet = applyAttributesSet;
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
