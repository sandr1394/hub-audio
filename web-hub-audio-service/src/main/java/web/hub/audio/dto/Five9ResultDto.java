package web.hub.audio.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Five9ResultDto {

    private Integer id;
    private String callId;
    private String sessionId;
    private String ani;
    private String dnis;
    private String agentFirstName;
    private String agentLastName;
    private String agentEmail;
    private String campaign;
    private Integer callDuration;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime dateOfCall;
}
