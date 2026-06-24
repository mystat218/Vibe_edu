import { fetchFestivals } from '@/lib/api';
import DashboardClient from '@/components/DashboardClient';

export const revalidate = 3600; // Revalidate data at most every hour

export default async function Home() {
  const festivals = await fetchFestivals();

  return (
    <DashboardClient initialFestivals={festivals} />
  );
}

