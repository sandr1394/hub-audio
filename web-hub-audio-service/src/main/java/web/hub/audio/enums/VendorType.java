package web.hub.audio.enums;


import java.util.Arrays;
import java.util.List;

public enum VendorType {

    INTERACTIONS,
    FIVE9;

    public static List<VendorType> vendors() {
        return Arrays.asList(VendorType.values());
    }
}
