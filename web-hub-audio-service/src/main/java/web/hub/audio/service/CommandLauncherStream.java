package web.hub.audio.service;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

public interface CommandLauncherStream {
    InputStream executeStream(List<String> commandToExec, InputStream inputStream);
}
