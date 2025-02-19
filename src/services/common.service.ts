import axios from 'axios';
import { Source } from '../types';

const downloadAudio = (source: Source, id: number): Promise<void> =>
  axios.get(`/audio/api/v1/${source}/downloadaudio/${id}`, { responseType: 'blob' }).then((response) => {
    const blob = response.data;
    const filename = response.headers['content-disposition'].split('filename=')[1].split(';')[0];
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });

const commonService = {
  downloadAudio,
};

export default commonService;
