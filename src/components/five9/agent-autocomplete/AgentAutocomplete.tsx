import React, { useEffect, useMemo } from 'react';
import { Autocomplete, CircularProgress, debounce, Grid, TextField, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { makeStyles } from '@mui/styles';
import { Agent } from '../../../types';
import five9Service from '../../../services/five9.service';
import useAgent from '../../../utils/useAgent';
import getAgentFullName from '../../../utils/getAgentFullName';

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

function AgentAutocomplete({ onSelect, value }: any) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Agent[] | null>(null);
  const [inputValue, setInputValue] = React.useState<string>('');
  const loading = open && !options;
  const classes = useStyles();
  const [agent, addAgent] = useAgent(value);

  const debouncedChangeHandler = useMemo(
    () =>
      debounce(
        async (newInputValue: string) =>
          setOptions(
            await five9Service.searchAgents(
              newInputValue
                .split(' ')
                .map((s) => s.trim())
                .filter(Boolean),
            ),
          ),
        300,
      ),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedChangeHandler.clear();
    };
  }, []);

  return !value || agent ? (
    <Autocomplete
      id="agentId"
      open={open}
      getOptionLabel={() => getAgentFullName(agent?.firstName, agent?.lastName)}
      onOpen={() => {
        if (!inputValue.trim()) return;
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      filterOptions={(x) => x}
      autoComplete
      blurOnSelect
      includeInputInList
      isOptionEqualToValue={(option, val) => +option.id === +val}
      options={options || []}
      loading={loading}
      value={value}
      inputValue={inputValue}
      onChange={(event: any, val: Agent | string | null) => {
        if (typeof val === 'string') return;

        setOpen(false);
        if (val) {
          addAgent(val);

          onSelect(val.id.toString());
        } else {
          onSelect(null);
        }
      }}
      onInputChange={async (event, newInputValue, reason) => {
        setInputValue(newInputValue);
        setOptions(null);
        if (!newInputValue.trim()) {
          setOpen(false);
        } else {
          if (reason === 'input') setOpen(true);
          debouncedChangeHandler(newInputValue);
        }
      }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            <Grid container alignItems="center">
              <Grid item>
                <PersonIcon className={classes.icon} fontSize="large" />
              </Grid>
              <Grid item xs>
                <Typography variant="body1">{getAgentFullName(option.firstName, option.lastName)}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {option.email}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Agent"
          name="agent"
          onFocus={() => inputValue.trim() && setOpen(true)}
          onBlur={() => {
            setOpen(false);
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  ) : (
    <div className={classes.loaderContainer}>
      <CircularProgress data-testid="agents-loading" />
    </div>
  );
}

export default AgentAutocomplete;
