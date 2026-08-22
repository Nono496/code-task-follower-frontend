export type Size = {
  width: number;
  height: number;
}

export function sizeIsEqual(s1: Size | undefined, s2: Size | undefined): boolean {
  if (s1 === undefined && s2 === undefined) return true;
  if (s1 === undefined || s2 === undefined) return false;
  
  return s1.height === s2.height && s1.width === s2.width;
}