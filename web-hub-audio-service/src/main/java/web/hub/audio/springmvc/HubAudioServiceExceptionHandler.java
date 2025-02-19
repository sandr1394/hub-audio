package web.hub.audio.springmvc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import web.hub.audio.exception.AgentNotFoundException;
import web.hub.audio.exception.CallNotFoundException;

/**
 * Cross-cutting controller-advice, that handles all the various types of exceptions within the middle tier, and converts them to
 * applicable responses. Note, only application or specific exceptions are handled here. Other exceptions are handled by the framework
 * more appropriately.
 *
 * @see [com.prosper.platform.springboot.exception.PlatformSecurityExceptionHandler]
 * @see [com.prosper.platform.springboot.exception.PlatformExceptionHandler]
 */
@ControllerAdvice
public class HubAudioServiceExceptionHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(HubAudioServiceExceptionHandler.class);

    @ExceptionHandler(CallNotFoundException.class)
    public ResponseEntity<String> handleCallNotFoundException(CallNotFoundException ex) {
        LOGGER.error("Handling CallNotFoundException, message: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(AgentNotFoundException.class)
    public ResponseEntity<String> handleAgentNotFoundException(CallNotFoundException ex) {
        LOGGER.error("Handling AgentNotFoundException, message: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}