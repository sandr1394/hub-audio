package web.hub.audio.dao.specification.filter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static web.hub.audio.dao.specification.QueryOperator.EQUALS;
import static web.hub.audio.dao.specification.QueryOperator.GREATER_THAN_OR_EQUAL;
import static web.hub.audio.dao.specification.QueryOperator.IN;
import static web.hub.audio.dao.specification.QueryOperator.IS_NOT_NULL;
import static web.hub.audio.dao.specification.QueryOperator.LESS_THAN_OR_EQUAL;
import static web.hub.audio.dao.specification.filter.FilterAttribute.AGENT_ID;
import static web.hub.audio.dao.specification.filter.FilterAttribute.ANI;
import static web.hub.audio.dao.specification.filter.FilterAttribute.CALL_ID;
import static web.hub.audio.dao.specification.filter.FilterAttribute.CAMPAIGN_ID;
import static web.hub.audio.dao.specification.filter.FilterAttribute.DATE_OF_CALL;
import static web.hub.audio.dao.specification.filter.FilterAttribute.DNIS;
import static web.hub.audio.dao.specification.filter.FilterAttribute.GCP_FILE_KEY;
import static web.hub.audio.dao.specification.filter.FilterAttribute.IS_MIGRATED;
import static web.hub.audio.dao.specification.filter.FilterAttribute.SEGMENT_ID;
import static web.hub.audio.dao.specification.filter.FilterAttribute.SESSION_ID;
import static web.hub.audio.util.Constants.ONE;

public class Filter {

    private Filter(FilterBuilder builder) {
        this.filters = builder.filters;
    }

    List<SearchCriteria> filters;

    public List<SearchCriteria> getFilters() {
        return filters;
    }

    public static class FilterBuilder {
        List<SearchCriteria> filters = new ArrayList<>();

        public FilterBuilder() {
        }

        public FilterBuilder withCallId(String callId) {
            if (callId != null) {
                SearchCriteria searchCriteria = new SearchCriteria();
                searchCriteria.setField(CALL_ID.getValue());
                searchCriteria.setOperator(EQUALS);
                searchCriteria.setValue(Long.valueOf(callId));
                this.filters.add(searchCriteria);
            }
            return this;
        }

        public FilterBuilder withSessionId(String sessionId) {
            if (sessionId != null) {
                SearchCriteria searchCriteria = new SearchCriteria();
                searchCriteria.setField(SESSION_ID.getValue());
                searchCriteria.setOperator(EQUALS);
                searchCriteria.setValue(sessionId);
                this.filters.add(searchCriteria);
            }
            return this;
        }

        public FilterBuilder withSegmentId(String segmentId) {
            if (segmentId != null) {
                SearchCriteria searchCriteria = new SearchCriteria();
                searchCriteria.setField(SEGMENT_ID.getValue());
                searchCriteria.setOperator(EQUALS);
                searchCriteria.setValue(segmentId);
                this.filters.add(searchCriteria);
            }
            return this;
        }

        public FilterBuilder withAni(String ani) {
            if (ani != null) {
                SearchCriteria searchCriteria = new SearchCriteria();
                searchCriteria.setField(ANI.getValue());
                searchCriteria.setOperator(IN);

                String aniWithOne = ONE.concat(ani);
                searchCriteria.setValue(List.of(Long.valueOf(ani), Long.valueOf(aniWithOne)));
                this.filters.add(searchCriteria);
            }
            return this;
        }

        public FilterBuilder withDnis(String dnis) {
            if (dnis != null) {
                SearchCriteria searchCriteria = new SearchCriteria();
                searchCriteria.setField(DNIS.getValue());
                searchCriteria.setOperator(EQUALS);
                searchCriteria.setValue(Long.valueOf(dnis));
                this.filters.add(searchCriteria);
            }
            return this;
        }

        public FilterBuilder withAgentId(Integer agentId) {
            if (agentId != null) {
                SearchCriteria searchCriteria = new SearchCriteria();
                searchCriteria.setField(AGENT_ID.getValue());
                searchCriteria.setOperator(EQUALS);
                searchCriteria.setValue(agentId);
                this.filters.add(searchCriteria);
            }
            return this;
        }

        public FilterBuilder withCampaignId(Integer campaignId) {
            if (campaignId != null) {
                SearchCriteria searchCriteria = new SearchCriteria();
                searchCriteria.setField(CAMPAIGN_ID.getValue());
                searchCriteria.setOperator(EQUALS);
                searchCriteria.setValue(campaignId);
                this.filters.add(searchCriteria);
            }
            return this;
        }

        public FilterBuilder withDateFrom(LocalDateTime dateFrom) {
            if (dateFrom != null) {
                SearchCriteria searchCriteria = new SearchCriteria();
                searchCriteria.setField(DATE_OF_CALL.getValue());
                searchCriteria.setOperator(GREATER_THAN_OR_EQUAL);
                searchCriteria.setValue(dateFrom);
                this.filters.add(searchCriteria);
            }
            return this;
        }

        public FilterBuilder withDateTo(LocalDateTime dateTo) {
            if (dateTo != null) {
                SearchCriteria searchCriteria = new SearchCriteria();
                searchCriteria.setField(DATE_OF_CALL.getValue());
                searchCriteria.setOperator(LESS_THAN_OR_EQUAL);
                searchCriteria.setValue(dateTo);
                this.filters.add(searchCriteria);
            }
            return this;
        }

        public FilterBuilder withIsMigratedIsTrue() {
            SearchCriteria searchCriteria = new SearchCriteria();
            searchCriteria.setField(IS_MIGRATED.getValue());
            searchCriteria.setOperator(EQUALS);
            searchCriteria.setValue(true);
            this.filters.add(searchCriteria);
            return this;
        }

        public FilterBuilder withGcpFileKeyIsNotNull() {
            SearchCriteria searchCriteria = new SearchCriteria();
            searchCriteria.setField(GCP_FILE_KEY.getValue());
            searchCriteria.setOperator(IS_NOT_NULL);
            this.filters.add(searchCriteria);
            return this;
        }

        public Filter build() {
            return new Filter(this);
        }
    }

}
