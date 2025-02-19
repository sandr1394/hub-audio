import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { JwtToken } from '../types';

const ROLE_DOWNLOADER = 'Audio Download User';

function useCanDownload() {
  const [canDownload, setCanDownload] = useState(false);
  const jwt = localStorage.getItem('hub-jwt');
  if (!jwt) return false;

  useEffect(() => {
    const getRoles = async () => {
      const jwtToken = jwtDecode<JwtToken>(jwt);
      const roles = jwtToken.roles.map((a: any) => a.name);
      setCanDownload(roles.some((role: string) => role === ROLE_DOWNLOADER));
    };

    getRoles();
  }, [jwt]);

  return canDownload;
}

export default useCanDownload;
