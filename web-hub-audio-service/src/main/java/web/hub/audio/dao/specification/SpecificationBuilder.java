package web.hub.audio.dao.specification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import web.hub.audio.dao.specification.filter.SearchCriteria;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SpecificationBuilder<T> {

    public Specification<T> getSpecificationFromFilter(List<SearchCriteria> searchCriteria) {
        Specification<T> resultSpecification = Specification.where(createSpecification(searchCriteria.get(0)));
        for (int i = 1; i < searchCriteria.size(); i++) {
            resultSpecification = resultSpecification.and(createSpecification(searchCriteria.get(i)));
        }
        return resultSpecification;
    }

    private Specification<T> createSpecification(SearchCriteria searchCriteria) {
        return switch (searchCriteria.getOperator()) {
            case EQUALS -> ((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get(searchCriteria.getField()),
                            searchCriteria.getValue()));
            case IS_NOT_NULL -> ((root, query, criteriaBuilder) ->
                    criteriaBuilder.isNotNull(root.get(searchCriteria.getField())));
            case LIKE -> ((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get(searchCriteria.getField()),
                            "%" + searchCriteria.getValue() + "%"));
            case IN -> ((root, query, criteriaBuilder) ->
                    criteriaBuilder.in(root.get(searchCriteria.getField())).value(searchCriteria.getValue()));
            case GREATER_THAN_OR_EQUAL -> ((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get(searchCriteria.getField()), (LocalDateTime) searchCriteria.getValue()));
            case LESS_THAN_OR_EQUAL -> ((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get(searchCriteria.getField()), (LocalDateTime) searchCriteria.getValue()));
        };
    }

}
