export interface IServer {
  name: string;
  depth: number;
  root: boolean;
  requiredHackingLevel: number;
  requiredOpenPorts: number;

  neighbors: string[]
}
