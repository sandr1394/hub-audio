import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CacheContext from './cache-context';
import { ListElement, Source } from '../types';

const AUDIO_CACHE_SIZE = 10;

function useAudio() {
  const { audio, setAudio, audioElement, currentAudio, cache } = useContext(CacheContext);
  const source = useParams<{ source: string }>().source as Source;

  const play = async (item: ListElement<typeof source>) => {
    const src = `/audio/api/v1/${source}/getaudio/${item.id}`;
    currentAudio.current = { ...item };
    if (src !== audio.src) {
      if (audioElement.current) audioElement.current.src = '';
      setAudio({
        src,
        playing: false,
        loading: true,
      });

      let blob;
      if (cache.current.has(src)) {
        blob = cache.current.get(src);
      } else {
        blob = await axios.get<any, any>(src, { responseType: 'blob' }).then((response) => response.data);
        cache.current.set(src, blob);
        if (cache.current.size > AUDIO_CACHE_SIZE) {
          cache.current.delete(Array.from(cache.current.keys())[0]);
        }
      }

      if (currentAudio.current?.id !== item.id) return;
      audioElement.current = new Audio(URL.createObjectURL(blob));
      audioElement.current.onended = () => {
        setAudio({
          src,
          playing: false,
          loading: false,
        });
      };
    }
    audioElement.current
      ?.play()
      .then(() => {
        setAudio({
          src,
          playing: true,
          loading: false,
        });
      })
      .catch(() => {
        setAudio({
          src,
          playing: false,
          loading: false,
        });
      });
  };

  // Stream experimental
  // const play = (item: ListElement<typeof source>) => {
  //   const src = `/audio/api/v1/${source}/getaudiostream/${item.id}`;
  //   let { audioElement } = audio;
  //   if (src !== audio.src) {
  //     if (audioElement) audioElement.src = '';
  //     audioElement = new Audio(src);
  //     audioElement.onplaying = () => {
  //       setAudio({
  //         src,
  //         audioElement,
  //         currentAudio: item,
  //         playing: true,
  //         loading: false,
  //       });
  //     };
  //     audioElement.onended = () => {
  //       setAudio({
  //         src,
  //         audioElement,
  //         currentAudio: item,
  //         playing: false,
  //         loading: false,
  //       });
  //     };
  //     audioElement.onwaiting = () => {
  //       setAudio({
  //         src,
  //         audioElement,
  //         currentAudio: item,
  //         playing: false,
  //         loading: true,
  //       });
  //     };
  //   } else if (audioElement && audioElement.ended) {
  //     audioElement.load();
  //   }
  //   setAudio({
  //     src,
  //     audioElement,
  //     currentAudio: item,
  //     playing: false,
  //     loading: true,
  //   });
  //   audioElement?.play();
  // };

  const pause = () => {
    audioElement.current?.pause();
    setAudio({
      ...audio,
      playing: false,
      loading: false,
    });
  };

  const toggle = (item: ListElement<typeof source>) => {
    if (currentAudio.current?.id === item.id && audio.playing) pause();
    if (currentAudio.current?.id === item.id && !audio.playing) play(item);
    if (currentAudio.current?.id !== item.id) play(item);
  };

  const clear = () => {
    if (audioElement.current) audioElement.current.src = '';
    audioElement.current = null;
    currentAudio.current = null;
    setAudio({
      src: null,
      playing: false,
      loading: false,
    });
  };

  return {
    ...audio,
    audioElement: audioElement.current,
    currentAudio: currentAudio.current,
    play,
    pause,
    toggle,
    clear,
  };
}

export default useAudio;
