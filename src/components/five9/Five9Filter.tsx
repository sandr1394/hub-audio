import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { DesktopDatePicker } from '@mui/lab';
import { endOfDay, isValid } from 'date-fns';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Five9FilterParams } from '../../types';
import PhoneInput from '../phone-input/PhoneInput';
import NumberInput from '../number-input/NumberInput';
import AgentAutocomplete from './agent-autocomplete/AgentAutocomplete';
import MIN_DATE from '../../utils/constants/min-date';
import CampaignAutocomplete from './campaign-autocomplete/CampaignAutocomplete';

const validationSchema = yup.object().shape(
  {
    callId: yup.number().optional(),
    sessionId: yup.string().optional(),
    ani: yup.string().test('phone-number', 'Phone number is not valid', (value) => !value || value.length === 10),
    dnis: yup.string().test('phone-number', 'Phone number is not valid', (value) => !value || value.length === 10),
    agentId: yup.string().nullable().optional(),
    campaignId: yup.string().optional(),
    dateFrom: yup
      .date()
      .nullable()
      .typeError('Please enter a valid date (MM/DD/YYYY)')
      .min(new Date(MIN_DATE), 'Search is available only for the last 7 years')
      .when('dateTo', (dateTo: any, schema: any) =>
        isValid(dateTo)
          ? schema.max(dateTo, 'Date should be before Date To')
          : schema.optional().max(new Date(), 'Please enter a date from the past'),
      ),
    dateTo: yup
      .date()
      .nullable()
      .typeError('Please enter a valid date (MM/DD/YYYY)')
      .max(endOfDay(new Date()), 'Please enter a date from the past')
      .when('dateFrom', (dateFrom: any, schema: any) =>
        isValid(dateFrom)
          ? schema.min(dateFrom, 'Date should be after Date From')
          : schema.min(new Date(MIN_DATE), 'Search is available only for the last 7 years'),
      ),
  },
  [['dateFrom', 'dateTo']],
);

const useStyles = makeStyles({
  divider: {
    marginTop: 24,
    marginBottom: 24,
    marginLeft: -24,
    marginRight: -24,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
});

interface Props {
  callId?: string | null;
  sessionId?: string | null;
  ani?: string | null;
  dnis?: string | null;
  agentId?: string | null;
  campaignId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  onSubmit: (filterParams: Five9FilterParams) => void;
}

interface FormikValues {
  callId: string;
  sessionId: string;
  ani: string;
  dnis: string;
  agentId: string | null;
  campaignId: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}

function Five9Filter({ callId, sessionId, ani, dnis, agentId, campaignId, dateFrom, dateTo, onSubmit }: Props) {
  const classes = useStyles();
  const [formError, setFormError] = useState('');

  const formik = useFormik<FormikValues>({
    initialValues: {
      callId: callId || '',
      sessionId: sessionId || '',
      ani: ani || '',
      dnis: dnis || '',
      agentId: agentId || null,
      campaignId: campaignId || '',
      dateFrom: dateFrom ? new Date(dateFrom) : null,
      dateTo: dateTo ? new Date(dateTo) : null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (
        !(
          values.callId ||
          values.sessionId ||
          values.agentId ||
          values.campaignId ||
          values.ani ||
          values.dnis ||
          values.dateFrom
        )
      ) {
        setFormError(
          values.dateTo ? 'At least one additional field should be filled' : 'At least one field should be filled',
        );
        return;
      }
      onSubmit({
        callId: values.callId || null,
        sessionId: values.sessionId?.trim() || null,
        ani: values.ani || null,
        dnis: values.dnis || null,
        agentId: values.agentId || null,
        campaignId: values.campaignId || null,
        dateFrom: values.dateFrom?.toISOString() || null,
        dateTo: values.dateTo ? endOfDay(values.dateTo).toISOString() : null,
      });
    },
  });

  useEffect(() => {
    setFormError('');
  }, [formik.values]);

  return (
    <form onSubmit={formik.handleSubmit} data-testid="five9-filter">
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <NumberInput
            id="callId"
            name="callId"
            label="Call Id"
            maxLength={19}
            fullWidth
            value={formik.values.callId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.callId && Boolean(formik.errors.callId)}
            helperText={formik.touched.callId && formik.errors.callId}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="sessionId"
            name="sessionId"
            label="Session Id"
            fullWidth
            value={formik.values.sessionId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.sessionId && Boolean(formik.errors.sessionId)}
            helperText={formik.touched.sessionId && formik.errors.sessionId}
          />
        </Grid>
        <Grid item xs={6}>
          <AgentAutocomplete
            value={formik.values.agentId}
            onSelect={(value: string) => formik.setFieldValue('agentId', value)}
          />
        </Grid>
        <Grid item xs={6}>
          <CampaignAutocomplete
            value={formik.values.campaignId}
            onSelect={(value: string) => formik.setFieldValue('campaignId', value)}
          />
        </Grid>
        <Grid item xs={6}>
          <PhoneInput
            id="ani"
            name="ani"
            label="Phone Number (ANI)"
            fullWidth
            value={formik.values.ani}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.ani && Boolean(formik.errors.ani)}
            helperText={formik.touched.ani && formik.errors.ani}
          />
        </Grid>
        <Grid item xs={6}>
          <PhoneInput
            id="dnis"
            name="dnis"
            label="DNIS"
            fullWidth
            value={formik.values.dnis}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dnis && Boolean(formik.errors.dnis)}
            helperText={formik.touched.dnis && formik.errors.dnis}
          />
        </Grid>
        <Grid item xs={6}>
          <DesktopDatePicker<Date>
            label="Date from"
            value={formik.values.dateFrom}
            onChange={(date) => formik.setFieldValue('dateFrom', date)}
            minDate={MIN_DATE}
            maxDate={formik.values.dateTo || new Date()}
            renderInput={(params) => (
              <TextField
                {...params}
                id="dateFrom"
                name="dateFrom"
                fullWidth
                onBlur={formik.handleBlur}
                error={formik.touched.dateFrom && Boolean(formik.errors.dateFrom)}
                helperText={formik.touched.dateFrom && formik.errors.dateFrom}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <DesktopDatePicker<Date>
            label="Date to"
            value={formik.values.dateTo}
            onChange={(date) => formik.setFieldValue('dateTo', date)}
            minDate={formik.values.dateFrom || MIN_DATE}
            maxDate={new Date()}
            renderInput={(params) => (
              <TextField
                {...params}
                id="dateTo"
                name="dateTo"
                fullWidth
                onBlur={formik.handleBlur}
                error={formik.touched.dateTo && Boolean(formik.errors.dateTo)}
                helperText={formik.touched.dateTo && formik.errors.dateTo}
              />
            )}
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Stack direction="row" justifyContent="flex-end" spacing={5} alignItems="center">
        {formError && <Typography color="error">{formError}</Typography>}
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

Five9Filter.defaultProps = {
  callId: '',
  sessionId: '',
  ani: '',
  dnis: '',
  agentId: null,
  campaignId: null,
  dateFrom: null,
  dateTo: null,
};

export default Five9Filter;
