package web.hub.audio.dao.repository.audit;

import org.springframework.data.repository.CrudRepository;
import web.hub.audio.dao.entity.audit.Vendor;

import java.util.Optional;

public interface VendorRepository extends CrudRepository<Vendor, Integer> {

    Optional<Vendor> getVendorByVendorName(String vendorName);
}
