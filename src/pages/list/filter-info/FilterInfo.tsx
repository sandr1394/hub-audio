import React from 'react';
import { FilterParams, Source } from '../../../types';
import InteractionsFilterInfo from '../../../components/interactions/InteractionsFilterInfo';
import Five9FilterInfo from '../../../components/five9/Five9FilterInfo';

interface Props {
  source: Source;
  filterParams: FilterParams;
}

function FilterInfo({ source, filterParams }: Props) {
  return (
    <>
      {source === Source.INTERACTIONS && (
        <InteractionsFilterInfo
          callId={filterParams.callId}
          segmentId={filterParams.segmentId}
          ani={filterParams.ani}
          dnis={filterParams.dnis}
          dateFrom={filterParams.dateFrom || ''}
          dateTo={filterParams.dateTo || ''}
        />
      )}
      {source === Source.FIVE9 && (
        <Five9FilterInfo
          callId={filterParams.callId}
          sessionId={filterParams.sessionId}
          ani={filterParams.ani}
          dnis={filterParams.dnis}
          agentId={filterParams.agentId}
          campaignId={filterParams.campaignId}
          dateFrom={filterParams.dateFrom || ''}
          dateTo={filterParams.dateTo || ''}
        />
      )}
    </>
  );
}

export default FilterInfo;
