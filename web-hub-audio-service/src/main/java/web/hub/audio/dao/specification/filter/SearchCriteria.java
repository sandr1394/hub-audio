package web.hub.audio.dao.specification.filter;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import web.hub.audio.dao.specification.QueryOperator;

@Getter
@Setter
@NoArgsConstructor
public class SearchCriteria {

    private String field;
    private QueryOperator operator;
    private Object value;
}
