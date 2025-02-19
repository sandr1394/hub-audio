import React from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import { Five9FilterParams } from '../../types';
import useAgent from '../../utils/useAgent';
import useCampaigns from '../../utils/useCampaigns';
import { phoneMask } from '../phone-input/PhoneInput';
import getAgentFullName from '../../utils/getAgentFullName';

type Props = Five9FilterParams;

function Five9FilterInfo({ callId, sessionId, ani, dnis, agentId, campaignId, dateTo, dateFrom }: Props) {
  const [agent] = useAgent(agentId);
  const campaigns = useCampaigns();

  return (
    <Grid container spacing={2}>
      {callId && (
        <Grid item xs={6}>
          <Typography>
            <b>Call Id:</b> {callId}
          </Typography>
        </Grid>
      )}
      {sessionId && (
        <Grid item xs={6}>
          <Typography>
            <b>Session Id:</b> {sessionId}
          </Typography>
        </Grid>
      )}
      {agentId && (
        <Grid item xs={6}>
          <Typography>
            <b>Agent:</b>{' '}
            {agent ? (
              getAgentFullName(agent.firstName, agent.lastName)
            ) : (
              <CircularProgress data-testid="filter-info-agent-loading" size={16} />
            )}
          </Typography>
        </Grid>
      )}
      {campaignId && (
        <Grid item xs={6}>
          <Typography>
            <b>Campaign:</b>{' '}
            {campaigns ? (
              campaigns.find((d) => +d.id === +campaignId)?.campaignName
            ) : (
              <CircularProgress data-testid="filter-info-campaign-loading" size={16} />
            )}
          </Typography>
        </Grid>
      )}
      {ani && (
        <Grid item xs={6}>
          <Typography>
            <b>Phone Number (ANI):</b> {phoneMask(ani)}
          </Typography>
        </Grid>
      )}
      {dnis && (
        <Grid item xs={6}>
          <Typography>
            <b>DNIS:</b> {phoneMask(dnis)}
          </Typography>
        </Grid>
      )}
      {dateFrom && (
        <Grid item xs={6}>
          <Typography>
            <b>Date:</b> {`from ${format(new Date(dateFrom), 'MM/dd/yyyy')} to `}
            {format(dateTo ? new Date(dateTo) : new Date(), 'MM/dd/yyyy')}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default Five9FilterInfo;
