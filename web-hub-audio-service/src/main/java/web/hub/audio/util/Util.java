package web.hub.audio.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import web.hub.audio.dao.specification.filter.FilterAttribute;
import web.hub.audio.dao.specification.filter.SearchCriteria;

import java.util.List;

import static org.springframework.data.domain.Sort.Direction.DESC;
import static web.hub.audio.dao.specification.filter.FilterAttribute.DATE_OF_CALL;

public class Util {

    public static String getFilterData(List<SearchCriteria> searchCriteria) {
        StringBuilder builder = new StringBuilder();
        searchCriteria.forEach(filter -> builder
                .append("[")
                .append(filter.getField().equals(DATE_OF_CALL.getValue()) ? "DateBoundary" : filter.getField())
                .append(" : ")
                .append(filter.getValue())
                .append("]")
                .append(" -//- "));
        return builder.toString();
    }

    public static Pageable getPageable(Integer page, Integer size, String sortField, FilterAttribute sortDirection) {
        return PageRequest.of(page, size);
        /*return DESC.toString().equals(sortDirection.getValue()) ?
                PageRequest.of(page, size, Sort.by(sortField).descending()) :
                PageRequest.of(page, size, Sort.by(sortField).ascending());*/
    }

    public static Authentication getAuthenticationContext() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

}
