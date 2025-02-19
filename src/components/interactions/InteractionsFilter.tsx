import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { DesktopDatePicker } from '@mui/lab';
import { endOfDay, isValid } from 'date-fns';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InteractionsFilterParams } from '../../types';
import PhoneInput from '../phone-input/PhoneInput';
import NumberInput from '../number-input/NumberInput';
import MIN_DATE from '../../utils/constants/min-date';

const validationSchema = yup.object().shape(
  {
    callId: yup.number().optional(),
    segmentId: yup.string().optional(),
    ani: yup.string().test('phone-number', 'Phone number is not valid', (value) => !value || value.length === 10),
    dnis: yup.string().test('phone-number', 'Phone number is not valid', (value) => !value || value.length === 10),
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
});

interface Props {
  callId?: string | null;
  segmentId?: string | null;
  ani?: string | null;
  dnis?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  onSubmit: (filterParams: InteractionsFilterParams) => void;
}

function InteractionsFilter({ callId, segmentId, ani, dnis, dateFrom, dateTo, onSubmit }: Props) {
  const classes = useStyles();
  const [formError, setFormError] = useState('');

  const formik = useFormik<any>({
    initialValues: {
      callId: callId || '',
      segmentId: segmentId || '',
      ani: ani || '',
      dnis: dnis || '',
      dateFrom: dateFrom ? new Date(dateFrom) : null,
      dateTo: dateTo ? new Date(dateTo) : null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!(values.callId || values.segmentId || values.ani || values.dnis || values.dateFrom)) {
        setFormError(
          values.dateTo ? 'At least one additional field should be filled' : 'At least one field should be filled',
        );
        return;
      }
      onSubmit({
        callId: values.callId || null,
        segmentId: values.segmentId?.trim() || null,
        ani: values.ani || null,
        dnis: values.dnis || null,
        dateFrom: values.dateFrom ? values.dateFrom.toISOString() : null,
        dateTo: values.dateTo ? endOfDay(values.dateTo).toISOString() : null,
      });
    },
  });

  useEffect(() => {
    setFormError('');
  }, [formik.values]);

  return (
    <form onSubmit={formik.handleSubmit} data-testid="interactions-filter">
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
            id="segmentId"
            name="segmentId"
            label="Segment Id"
            fullWidth
            value={formik.values.segmentId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.segmentId && Boolean(formik.errors.segmentId)}
            helperText={formik.touched.segmentId && formik.errors.segmentId}
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

InteractionsFilter.defaultProps = {
  callId: '',
  segmentId: '',
  ani: '',
  dnis: '',
  dateFrom: null,
  dateTo: null,
};

export default InteractionsFilter;
