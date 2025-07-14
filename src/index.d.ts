declare const AttributeSetApply: ({
  set,
  context,
  setsList,
  attributeName,
  mode,
}: {
  set: string;
  context?: Document | Element;
  setsList?: string[];
  attributeName?: string;
  mode?: 'overwrite'|'append'|'create';
}) => void;

export default AttributeSetApply;
