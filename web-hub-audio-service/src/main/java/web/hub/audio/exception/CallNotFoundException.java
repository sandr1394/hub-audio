package web.hub.audio.exception;

public class CallNotFoundException extends RuntimeException {
    public CallNotFoundException(String message) {
        super(message);
    }
}