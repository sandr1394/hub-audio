package web.hub.audio.enums;

import java.util.Arrays;
import java.util.List;

public enum AuditActionType {

    METADATA_LOOKUP,
    AUDIO_DOWNLOADING,
    AUDIO_REPLAYING;

    public static List<AuditActionType> actionTypes() {
        return Arrays.asList(AuditActionType.values());
    }
}
