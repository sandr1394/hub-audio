package web.hub.audio.service.impl;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.hub.audio.exception.AudioDownloadingException;
import web.hub.audio.service.AudioEncoderStream;
import web.hub.audio.service.CallObtainer;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.time.Instant;

import static web.hub.audio.enums.AuditActionType.AUDIO_DOWNLOADING;
import static web.hub.audio.enums.AuditActionType.AUDIO_REPLAYING;

@Service
public class CallService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CallService.class);

    private final AudioEncoderStream audioEncoderStream;

    @Autowired
    public CallService(AudioEncoderStream audioEncoderStream) {
        this.audioEncoderStream = audioEncoderStream;
    }

    public byte[] getConvertedAudioBytes(Integer recordId, CallObtainer obtainer) throws IOException {
        Instant start = Instant.now();
        try {
            InputStream stream = getAudioStreamById(recordId, obtainer);
            if (stream != null) {
                return IOUtils.toByteArray(audioEncoderStream.getConvertedAudioStream(stream));
            } else {
                return new byte[0];
            }
        } finally {
            Instant finish = Instant.now();
            long timeElapsed = Duration.between(start, finish).toMillis();
            LOGGER.info("Time taken totally: {} ms", timeElapsed);
        }
    }

    public InputStream getAudioStreamById(Integer recordId, CallObtainer obtainer) {
        return obtainer.getStream(recordId, AUDIO_REPLAYING).getRight();
    }

    public ImmutablePair<String, byte[]> getAudioBytes(Integer recordId, CallObtainer obtainer) {
        try {
            ImmutablePair<String, InputStream> pair = obtainer.getStream(recordId, AUDIO_DOWNLOADING);
            return new ImmutablePair<>(pair.getLeft(), IOUtils.toByteArray(pair.getRight()));
        } catch (Exception e) {
            LOGGER.error("Error occurred trying to download audio file with recordId: {}", recordId, e);
            throw new AudioDownloadingException(e);
        }
    }

    public void setContentDisposition(HttpServletResponse response, String fileName) {
        response.addHeader("Content-Disposition",
                String.format("attachment; filename=%s;", fileName));
    }

}
