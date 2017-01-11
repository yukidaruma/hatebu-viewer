export default function (filterText) {
  const filterComment = (line) => {
    if (/^\s*$/.test(line) || /^#/.test(line)) return false;
    return true;
  };
  const parseFilter = (str) => {
    const matches = str.match(/^\/(.+)\/$/);
    if (matches) {
      return {
        type: 'regexp',
        value: matches[1],
      };
    }
    return {
      type: 'string',
      value: str,
    };
  };

  return filterText.split('\n')
    .filter(filterComment)
    .map(parseFilter);
}
