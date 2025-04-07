function applyAttributesSet(_a) {
    var set = _a.set, _b = _a.context, context = _b === void 0 ? document : _b, _c = _a.setsList, setsList = _c === void 0 ? undefined : _c, _d = _a.attributeName, attributeName = _d === void 0 ? 'data-attr-sets' : _d, _e = _a.onlyEmpty, onlyEmpty = _e === void 0 ? false : _e;
    function parseSettings(string) {
        var settingsRaw;
        try {
            settingsRaw = JSON.parse(string);
        }
        catch (e) {
            console.error("Error parsing AttributesSets JSON settings from the string", string);
            return;
        }
        var settings = {};
        for (var setData in settingsRaw) {
            // Support comma-separated list of keys.
            var setNames = setData.split(',');
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
                settings[key.trim()] = settingsRaw[key];
            });
        }
        return settings;
    }
    context.querySelectorAll("[".concat(attributeName, "]")).forEach(function (el) {
        var settings = parseSettings(el.getAttribute(attributeName) || '');
        if (!settings || settings[set] === undefined) {
            return;
        }
        var attributes = settings[set];
        // If the attributes list is a string, precess it as the class attribute.
        if (typeof attributes === 'string') {
            attributes = { class: attributes };
        }
        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                if (onlyEmpty && el.hasAttribute(key)) {
                    continue;
                }
                var value = attributes[key];
                if (value === null) {
                    el.removeAttribute(key);
                }
                else {
                    el.setAttribute(key, value);
                }
            }
        }
    });
}
export default applyAttributesSet;
