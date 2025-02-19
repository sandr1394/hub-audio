package web.hub.audio.config.lookup;

import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.stereotype.Component;
import web.hub.audio.service.impl.LookupEntitySyncService;

@Component
public class LookupEntityConfiguration implements SmartInitializingSingleton {

    private final LookupEntitySyncService lookupEntitySyncService;

    public LookupEntityConfiguration(LookupEntitySyncService lookupEntitySyncService) {
        this.lookupEntitySyncService = lookupEntitySyncService;
    }

    @Override
    public void afterSingletonsInstantiated() {
        lookupEntitySyncService.syncAuditActions();
        lookupEntitySyncService.syncVendors();
    }
}
