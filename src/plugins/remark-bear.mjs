function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function transformText(node) {
  if (node.type !== 'text' || !node.value.includes('==')) return [node];

  const result = [];
  const pattern = /==([^=\n]+?)==/g;
  let cursor = 0;
  let match;

  while ((match = pattern.exec(node.value)) !== null) {
    if (match.index > cursor) {
      result.push({ type: 'text', value: node.value.slice(cursor, match.index) });
    }

    result.push({
      type: 'html',
      value: `<mark>${escapeHtml(match[1])}</mark>`,
    });
    cursor = match.index + match[0].length;
  }

  if (cursor === 0) return [node];
  if (cursor < node.value.length) {
    result.push({ type: 'text', value: node.value.slice(cursor) });
  }

  return result;
}

function transformNode(node, file) {
  if (
    node.type === 'delete' &&
    node.position?.start?.offset !== undefined &&
    node.position?.end?.offset !== undefined
  ) {
    const raw = String(file.value).slice(
      node.position.start.offset,
      node.position.end.offset,
    );

    if (raw.startsWith('~') && !raw.startsWith('~~') && raw.endsWith('~')) {
      return [{
        type: 'html',
        value: `<u>${escapeHtml(raw.slice(1, -1))}</u>`,
      }];
    }
  }

  if (node.children) {
    node.children = node.children.flatMap((child) => transformNode(child, file));
  }

  return transformText(node);
}

export default function remarkBear() {
  return (tree, file) => {
    transformNode(tree, file);
  };
}
