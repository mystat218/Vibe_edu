import { fetchFestivals } from '@/lib/api';
import MapClient from '@/components/MapClient';

export const revalidate = 3600;

export default async function MapPage() {
  const festivals = await fetchFestivals();

  return <MapClient initialFestivals={festivals} />;
}
