export interface IServer {
  name: string;
  depth: number;
  root: boolean;
  path: string[];
  requiredHackingLevel: number;
  requiredOpenPorts: number;
}
