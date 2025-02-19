import { useContext, useEffect } from 'react';
import CacheContext from './cache-context';
import five9Service from '../services/five9.service';

function useCampaigns() {
  const { campaigns, setCampaigns } = useContext(CacheContext);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!campaigns) {
        const result = await five9Service.getCampaigns();
        setCampaigns(result);
      }
    };

    fetchCampaigns();
  }, [campaigns]);

  return campaigns;
}

export default useCampaigns;
