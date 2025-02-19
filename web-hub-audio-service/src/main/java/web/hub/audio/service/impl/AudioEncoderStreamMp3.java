package web.hub.audio.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import web.hub.audio.service.AudioEncoderStream;
import web.hub.audio.service.CommandLauncherStream;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;

@Service
public class AudioEncoderStreamMp3 implements AudioEncoderStream {
    private static final Logger LOGGER = LoggerFactory.getLogger(AudioEncoderStreamMp3.class);
    private CommandLauncherStream commandLauncher;

    @Autowired
    public AudioEncoderStreamMp3(CommandLauncherStream commandLauncher) {
        this.commandLauncher = commandLauncher;
    }

    @Value("${hub-audio-service.audio-encoding.encoder-path}")
    private String encoderPath;

    @Value("${hub-audio-service.audio-encoding.samplerate}")
    private String sampleRate;

    @Value("${hub-audio-service.audio-encoding.bitrate}")
    private String bitRate;

    @Value("${hub-audio-service.audio-encoding.format}")
    private String encodingFormat;

    @Override
    public InputStream getConvertedAudioStream(InputStream inputAudio) {
        LOGGER.info("Started converting WAV to MP3");
        if (inputAudio != null) {
            final String ffmpegCmdLine = String.format("%s -i pipe:0 -ar %s -ac 1 -b:a %s -f %s pipe:1", encoderPath, sampleRate, bitRate, encodingFormat);
            LOGGER.info("Preparing ffmpeg cmd: {}", ffmpegCmdLine);
            List<String> toExec = Arrays.asList(ffmpegCmdLine.split("\\s+"));
            return commandLauncher.executeStream(toExec, inputAudio);
        } else {
            return inputAudio;
        }
    }

}
