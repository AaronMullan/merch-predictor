export async function fetchCatalogItems() {
  const response = await fetch('/api/catalog-items');
  if (!response.ok) {
    throw new Error('Failed to fetch catalog items');
  }
  const data = await response.json();
  return data.items;
}
