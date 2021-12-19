import * as ts from "typescript";

const removeTypesTransformer: ts.TransformerFactory<ts.SourceFile> = (
  context
) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node => {
      if (
        // ts.isTypeOnlyImportOrExportDeclaration(node)
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text.startsWith("types")
      )
        return undefined;

      // Remove convenience typescript interfaces
      if (ts.isInterfaceDeclaration(node)) return undefined;

      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitNode(sourceFile, visitor);
  };
};

export default removeTypesTransformer;
