import { useState, useEffect, useCallback } from 'react';
import { services } from '@/application/services';
import { DashboardUseCases, TodayDashboardData } from '@/application/useCases/dashboardUseCases';

const dashboardUseCases = new DashboardUseCases(services);

export function useDashboard() {
  const [data, setData] = useState<TodayDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const dashboard = await dashboardUseCases.getTodayDashboard();
      setData(dashboard);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    loading,
    refresh,
    speak: (text: string) => services.speech.speak(text),
  };
}
