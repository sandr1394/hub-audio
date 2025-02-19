package web.hub.audio.controller;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.hub.audio.service.impl.CallObtainerFive9;
import web.hub.audio.service.impl.CallObtainerInteractions;
import web.hub.audio.service.impl.CallService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("api/v1/")
public class AudioController {

    private final CallService callService;

    private final CallObtainerFive9 audioObtainerFive9;
    private final CallObtainerInteractions audioObtainerInteractions;

    @Autowired
    public AudioController(CallService callService,
                           CallObtainerFive9 audioObtainerFive9, CallObtainerInteractions audioObtainerInteractions) {
        this.callService = callService;
        this.audioObtainerFive9 = audioObtainerFive9;
        this.audioObtainerInteractions = audioObtainerInteractions;
    }

    @PreAuthorize("hasAuthority('ROLE_AUDIO_DOWNLOAD_USER')")
    @GetMapping(value = "interactions/downloadaudio/{recordId}", produces = "audio/wave")
    public byte[] downloadInteractionsAudio(@PathVariable("recordId") Integer recordId, HttpServletResponse response) {
        ImmutablePair<String, byte[]> pair = callService.getAudioBytes(recordId, audioObtainerInteractions);
        callService.setContentDisposition(response, pair.getLeft());
        return pair.getRight();
    }

    @PreAuthorize("hasAuthority('ROLE_AUDIO_DOWNLOAD_USER')")
    @GetMapping(value = "five9/downloadaudio/{recordId}", produces = "audio/wave")
    public byte[] downloadFive9Audio(@PathVariable("recordId") Integer recordId, HttpServletResponse response) {
        ImmutablePair<String, byte[]> pair = callService.getAudioBytes(recordId, audioObtainerFive9);
        callService.setContentDisposition(response, pair.getLeft());
        return pair.getRight();
    }

    @PreAuthorize("hasAnyAuthority('ROLE_AUDIO_USER', 'ROLE_AUDIO_DOWNLOAD_USER')")
    @GetMapping(value = "interactions/getaudio/{recordId}", produces = "audio/mpeg")
    public byte[] getAudioInteractions(@PathVariable("recordId") Integer recordId) throws IOException {
        return callService.getConvertedAudioBytes(recordId, audioObtainerInteractions);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_AUDIO_USER', 'ROLE_AUDIO_DOWNLOAD_USER')")
    @GetMapping(value = "five9/getaudio/{recordId}", produces = "audio/mpeg")
    public byte[] getAudioFive9(@PathVariable("recordId") Integer recordId) throws IOException {
        return callService.getConvertedAudioBytes(recordId, audioObtainerFive9);
    }
}
