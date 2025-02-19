package web.hub.audio.service;

import org.springframework.data.domain.Page;
import web.hub.audio.dao.specification.filter.SearchCriteria;
import web.hub.audio.dto.FilterResultDto;
import web.hub.audio.dao.specification.filter.FilterAttribute;

import java.util.List;

public interface FilterService {

    /**
     * @param <R> - describes Result type (Five9ResultDto or InteractionsResultDto)
     */
    <R> FilterResultDto<R> getAudioMetadata(List<SearchCriteria> filters,
                                            Integer page,
                                            Integer size,
                                            String sortField,
                                            FilterAttribute sortDirection);

    /**
     *
     * @param <C> - describes Call type (InteractionsCall or Five9Call)
     * @param <R> - describes Result type (Five9ResultDto or InteractionsResultDto)
     */
    <C, R> FilterResultDto<R> getResponse(Page<C> pageable);
}
