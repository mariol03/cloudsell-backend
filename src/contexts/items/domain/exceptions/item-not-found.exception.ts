export class ItemNotFoundException extends Error {
  constructor(name:string, value: string) {
    super(`Item with "${name}" "${value}" not found`);
    this.name = 'ItemNotFoundException';
  }
}   