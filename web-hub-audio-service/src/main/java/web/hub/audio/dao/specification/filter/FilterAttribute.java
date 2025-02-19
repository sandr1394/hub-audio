package web.hub.audio.dao.specification.filter;

public enum FilterAttribute {

    CALL_ID("callId"),
    SEGMENT_ID("segmentId"),
    ANI("ani"),
    DNIS("dnis"),
    DATE_FROM("dateFrom"),
    DATE_TO("dateTo"),
    DATE_OF_CALL("dateOfCall"),
    DESC("DESC"),
    ASC("ASC"),
    SESSION_ID("sessionId"),
    AGENT_ID("agentId"),
    EMAIL("email"),
    CAMPAIGN_ID("campaignId"),
    IS_MIGRATED("isMigrated"),
    GCP_FILE_KEY("gcpFileKey");

    private final String filterAttributeName;

    FilterAttribute(String filterAttributeName) {
        this.filterAttributeName = filterAttributeName;
    }

    public String getValue() {
        return this.filterAttributeName;
    }
}
