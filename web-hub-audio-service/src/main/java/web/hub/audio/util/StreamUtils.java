package web.hub.audio.util;

import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class StreamUtils {
    public static String getStringFromStreamAndClose(InputStream inputStream) throws IOException {
        try {
            return IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        } finally {
            IOUtils.closeQuietly(inputStream);
        }
    }
}