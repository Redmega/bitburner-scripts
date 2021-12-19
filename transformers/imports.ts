import { createRemapImportsTransformer } from "@ts-tools/robotrix";

export default createRemapImportsTransformer({
  remapTarget(target: string, containingFile: string): string {
    if (/^\w/.test(target[0])) return "/" + target;
    return target;
  },
});
