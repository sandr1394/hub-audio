package web.hub.audio.service;

import org.apache.commons.lang3.tuple.ImmutablePair;
import web.hub.audio.enums.AuditActionType;

import java.io.InputStream;

public interface CallObtainer {
    //key - audio file name
    //value - audio stream
    ImmutablePair<String, InputStream> getStream(Integer id, AuditActionType actionType);

}
