package web.hub.audio.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public interface AudioEncoderStream {
    InputStream getConvertedAudioStream(InputStream inputAudio) throws IOException;
}
