package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Organization;
import de.njsm.versusvirus.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

@Service
public class UpdateService {

    private final OrganizationRepository organizationRepository;

    public UpdateService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public long getLatestUpdate() {
        return organizationRepository.findById(1).map(Organization::getUpdateOffset).orElse(-1L);
    }

    public void setLatestUpdate(long value) {
        organizationRepository.findById(1).ifPresent(o -> {
            o.setUpdateOffset(value);
        });
    }

}
