import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FilterParams, Five9FilterParams, InteractionsFilterParams, Source } from '../../../types';
import InteractionsFilter from '../../../components/interactions/InteractionsFilter';
import Five9Filter from '../../../components/five9/Five9Filter';
import getInteractionsListUrl from '../../../utils/getInteractionsListUrl';
import getFive9ListUrl from '../../../utils/getFIve9List';

interface Props {
  source: Source;
  filterParams: FilterParams;
  submit: () => void;
  close: () => void;
}

function ListDialogContent({ source, filterParams, submit, close }: Props) {
  const history = useHistory();
  const location = useLocation();

  const submitInteractions = (params: InteractionsFilterParams) => {
    const newUrl = getInteractionsListUrl(params);
    close();
    if (`${location.pathname}${location.search}` === newUrl) return;
    submit();
    history.push(newUrl);
  };
  const submitFive9 = (params: Five9FilterParams) => {
    const newUrl = getFive9ListUrl(params);
    close();
    if (`${location.pathname}${location.search}` === newUrl) return;
    submit();
    history.push(newUrl);
  };

  return (
    <>
      {source === Source.INTERACTIONS && (
        <InteractionsFilter
          callId={filterParams.callId}
          segmentId={filterParams.segmentId}
          ani={filterParams.ani}
          dnis={filterParams.dnis}
          dateFrom={filterParams.dateFrom}
          dateTo={filterParams.dateTo}
          onSubmit={submitInteractions}
        />
      )}
      {source === Source.FIVE9 && (
        <Five9Filter
          callId={filterParams.callId}
          sessionId={filterParams.sessionId}
          ani={filterParams.ani}
          dnis={filterParams.dnis}
          agentId={filterParams.agentId}
          campaignId={filterParams.campaignId}
          dateFrom={filterParams.dateFrom}
          dateTo={filterParams.dateTo}
          onSubmit={submitFive9}
        />
      )}
    </>
  );
}

export default ListDialogContent;
