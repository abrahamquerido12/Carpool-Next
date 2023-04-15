export function formatPlaca(val: string): string {
  let value = val;

  // Verificar si la longitud es igual a tres
  if (value.length === 3) {
    // Agregar guión al final del valor
    value = value + '-';
  }

  return value;
}
