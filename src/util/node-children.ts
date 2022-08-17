export function nodeChildren(node: Node): Node[] {
  const descendants: Node[] = [];

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    descendants.push(child);
    nodeChildren(child);
  }

  return descendants;
}
