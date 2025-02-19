import React from 'react';
import { makeStyles } from '@mui/styles';
import { Autocomplete, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Campaign } from '../../../types';
import useCampaigns from '../../../utils/useCampaigns';

const useStyles = makeStyles((theme: any) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
    marginTop: 10,
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
}));

function CampaignAutocomplete({ onSelect, value }: any) {
  const campaigns = useCampaigns();
  const [inputValue, setInputValue] = React.useState<string>('');
  const classes = useStyles();

  return campaigns ? (
    <Autocomplete
      fullWidth
      id="campaignId"
      getOptionLabel={(option) => option.campaignName}
      options={campaigns}
      value={value ? campaigns.find((d) => +d.id === +value) : null}
      inputValue={inputValue}
      onChange={(event: any, val: Campaign | string | null) => {
        if (typeof val === 'string') return;
        onSelect(val ? val.id.toString() : '');
      }}
      renderInput={(params) => <TextField {...params} label="Campaign" name="campaignId" />}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
    />
  ) : (
    <div className={classes.loaderContainer}>
      <CircularProgress data-testid="campaigns-loading" />
    </div>
  );
}

export default CampaignAutocomplete;
