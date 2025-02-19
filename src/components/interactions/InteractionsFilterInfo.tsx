import React from 'react';
import { Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import { InteractionsFilterParams } from '../../types';
import { phoneMask } from '../phone-input/PhoneInput';

type Props = InteractionsFilterParams;

function InteractionsFilterInfo({ callId, segmentId, ani, dnis, dateTo, dateFrom }: Props) {
  return (
    <Grid container spacing={2}>
      {callId && (
        <Grid item xs={6}>
          <Typography>
            <b>Call Id:</b> {callId}
          </Typography>
        </Grid>
      )}
      {segmentId && (
        <Grid item xs={6}>
          <Typography>
            <b>Segment Id:</b> {segmentId}
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

export default InteractionsFilterInfo;
