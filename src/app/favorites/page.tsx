import { fetchFestivals } from '@/lib/api';
import FavoritesClient from '@/components/FavoritesClient';

export const revalidate = 3600;

export default async function FavoritesPage() {
  const festivals = await fetchFestivals();

  return <FavoritesClient initialFestivals={festivals} />;
}
