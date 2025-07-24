export function containsSpecialCharacters(text: string): boolean {
  const regex = /[^a-zA-Z0-9]/;
  return regex.test(text);
}