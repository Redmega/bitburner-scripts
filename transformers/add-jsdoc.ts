import * as ts from "typescript";

const generateJsDocParamLine = (name: string, type: string) =>
  `* @param {${type}} ${name}`;

const generateJsDocReturnLine = (type: string) => `* @returns {${type}}\n`;

const addJsdocTransformer = (program: ts.Program, config) => {
  const typeChecker = program.getTypeChecker();

  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      const text = sourceFile.getFullText();
      let prevCommentPos = -1;
      const visitor = (node: ts.Node): ts.Node => {
        if (ts.isSourceFile(node))
          return ts.visitEachChild(node, visitor, context);

        if (
          ts.isFunctionDeclaration(node) //&&
          // ["getServers", "findLastIndex"].includes(node.name.getText())
        ) {
          const hasComments = !!ts.getLeadingCommentRanges(text, node.pos);
          if (hasComments) {
            ts.forEachLeadingCommentRange(
              text,
              node.getFullStart(),
              (pos, end, kind, hasTrailingNewline) => {
                if (pos === prevCommentPos) return;
                let commentContent =
                  kind === ts.SyntaxKind.MultiLineCommentTrivia
                    ? sourceFile.text.slice(pos + 2, end - 2)
                    : sourceFile.text.slice(pos + 2, end);

                prevCommentPos = pos;
                // Strip the comment out
                sourceFile.text =
                  sourceFile.text.slice(0, pos).padEnd(end, " ") +
                  sourceFile.text.slice(end);

                if (!hasTrailingNewline) commentContent += "\n";

                for (let i = 0; i < node.parameters.length; i++) {
                  const parameter = node.parameters[i];
                  const name = parameter.name?.getText();
                  const type = parameter.type?.getText();
                  commentContent += generateJsDocParamLine(name, type);
                  commentContent += "\n";
                }

                const returnType = typeChecker
                  .getSignatureFromDeclaration(node)
                  // @ts-ignore
                  .getReturnType().intrinsicName;
                if (returnType)
                  commentContent += generateJsDocReturnLine(returnType);
                ts.addSyntheticLeadingComment(
                  node,
                  kind,
                  commentContent,
                  hasTrailingNewline
                );
              }
            );
          } else {
            let commentContent = "";

            for (let i = 0; i < node.parameters.length; i++) {
              const parameter = node.parameters[i];
              const name = parameter.name?.getText();
              const type = parameter.type?.getText();
              commentContent += generateJsDocParamLine(name, type);
              if (i < node.parameters.length - 1) commentContent += "\n";
            }

            const returnType = typeChecker
              .getSignatureFromDeclaration(node)
              // @ts-ignore
              .getReturnType().intrinsicName;
            if (returnType)
              commentContent += generateJsDocReturnLine(returnType);

            // @ts-ignore
            if (node.parameters.length + !!returnType > 1)
              commentContent += "\n";

            ts.addSyntheticLeadingComment(
              node,
              ts.SyntaxKind.MultiLineCommentTrivia,
              commentContent,
              true
            );
          }
        }
        return ts.visitEachChild(node, visitor, context);
      };

      return ts.visitNode(sourceFile, visitor);
    };
  };
};

export default addJsdocTransformer;
