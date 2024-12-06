
export interface Cache<K,T> {
  check(key: K): boolean;
  save(data: T, name: string): void;
  load(key: K): T;
}
