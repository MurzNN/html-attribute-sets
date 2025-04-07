declare function applyAttributesSet({ set, context, setsList, attributeName, onlyEmpty, }: {
    set: string;
    context?: Document | HTMLElement;
    setsList?: string[];
    attributeName?: string;
    onlyEmpty?: boolean;
}): void;
export default applyAttributesSet;
