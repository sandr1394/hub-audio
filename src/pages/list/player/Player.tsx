import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  ClickAwayListener,
  Fab,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Tooltip,
  tooltipClasses,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import PauseIcon from '@mui/icons-material/Pause';
import PlayIcon from '@mui/icons-material/PlayArrow';
import { format } from 'date-fns';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SpeedIcon from '@mui/icons-material/Speed';
import Check from '@mui/icons-material/Check';
import useAudio from '../../../utils/useAudio';
import { phoneMask } from '../../../components/phone-input/PhoneInput';
import timeFromSeconds from '../../../utils/timeFromSeconds';
import getAgentFullName from '../../../utils/getAgentFullName';

const useStyles = makeStyles({
  card: {
    padding: 24,
    height: 180,
    width: '70%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    opacity: 0.8,
    boxShadow: 'none',
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  durationCard: {
    padding: '12px 24px 10px 24px',
    height: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  durationContainer: {
    alignSelf: 'flex-end',
  },
  volumeTooltip: {
    [`& .${tooltipClasses.tooltip}`]: {
      width: 200,
      padding: '5px 10px 0px 10px',
    },
  },
  noCallSelected: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});

function Player() {
  const classes = useStyles();
  const { play, pause, currentAudio, audioElement, playing, loading } = useAudio();
  const [time, setTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>();
  const requestRef = useRef<number>(0);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [rate, setRate] = useState(1);
  const [rateAnchorEl, setRateAnchorEl] = React.useState<any>(null);
  const rateOpen = Boolean(rateAnchorEl);

  const animate = () => {
    if (!audioElement?.paused) {
      const currentTime = Math.floor(audioElement?.currentTime || 0);
      setTime(() => currentTime);
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  const forward = () => {
    if (audioElement && currentAudio) {
      const newTime = time + 10 > currentAudio.callDuration ? currentAudio.callDuration : time + 10;
      audioElement.currentTime = newTime;
      setTime(newTime);
    }
  };

  const replay = () => {
    if (audioElement) {
      audioElement.currentTime = time - 10;
      setTime(time - 10);
    }
  };

  const seek = (val: number) => {
    if (audioElement) audioElement.currentTime = val;
    setTime(val);
  };

  useEffect(() => {
    setTime(0);
    if (audioElement) audioElement.volume = volume;
    if (audioElement?.playbackRate) setRate(audioElement.playbackRate);
    if (currentAudio) setDuration(currentAudio.callDuration);
    if (currentAudio && audioElement) requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, [audioElement, currentAudio]);

  const changeVolume = (value: number) => {
    if (audioElement) audioElement.volume = value;
    setVolume(value);
  };

  const changeRate = (value: number) => {
    if (audioElement) audioElement.playbackRate = value;
    setRate(value);
    setRateAnchorEl(null);
  };

  return (
    <>
      <Card className={classes.card} data-testid="player-info">
        <div className={classes.noCallSelected}>
          {currentAudio ? (
            <>
              <Typography>
                <b>
                  {currentAudio.callId}-{currentAudio.segmentId || currentAudio.sessionId}
                </b>
              </Typography>
              <Typography textAlign="center">
                ANI: {phoneMask(currentAudio.ani)}{' '}
                {currentAudio.agentFirstName &&
                  `/ Agent: ${getAgentFullName(currentAudio.agentFirstName, currentAudio.agentLastName)}`}
              </Typography>
              <Typography variant="body2" textAlign="center">
                Time of call: {format(new Date(currentAudio.dateOfCall), 'MM/dd/yyyy HH:mm:ss')}
              </Typography>
            </>
          ) : (
            <Typography>
              <b>No call selected.</b>
            </Typography>
          )}
        </div>
        <Grid container spacing={5} justifyContent="center" alignItems="center">
          <Grid item>
            <ClickAwayListener onClickAway={() => setVolumeOpen(false)}>
              <div>
                <Tooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  onClose={() => setVolumeOpen(false)}
                  open={volumeOpen}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  arrow
                  classes={{ popper: classes.volumeTooltip }}
                  placement="top"
                  title={
                    <Slider
                      value={volume}
                      min={0}
                      max={1}
                      step={0.1}
                      aria-label="Volume"
                      onChange={(e, val) => !Array.isArray(val) && changeVolume(val)}
                    />
                  }
                >
                  <Fab
                    size="small"
                    color="secondary"
                    onClick={() => setVolumeOpen(true)}
                    disabled={!currentAudio || loading}
                    data-testid="volume"
                  >
                    {volume >= 0.7 && <VolumeUpIcon />}
                    {volume < 0.7 && volume > 0 && <VolumeDownIcon />}
                    {volume === 0 && <VolumeOffIcon />}
                  </Fab>
                </Tooltip>
              </div>
            </ClickAwayListener>
          </Grid>
          <Grid item>
            <Fab
              size="medium"
              color="secondary"
              onClick={replay}
              disabled={!currentAudio || loading}
              data-testid="replay"
            >
              <Replay10Icon sx={{ fontSize: 30 }} />
            </Fab>
          </Grid>
          <Grid item>
            {currentAudio && playing ? (
              <Fab color="secondary" onClick={() => pause()} data-testid="pause">
                <PauseIcon fontSize="large" />
              </Fab>
            ) : (
              <Fab
                color="secondary"
                onClick={() => currentAudio && play(currentAudio)}
                disabled={!currentAudio || loading}
                data-testid="play"
              >
                <PlayIcon fontSize="large" />
              </Fab>
            )}
          </Grid>
          <Grid item>
            <Fab
              size="medium"
              color="secondary"
              onClick={forward}
              disabled={!currentAudio || loading}
              data-testid="forward"
            >
              <Forward10Icon sx={{ fontSize: 30 }} />
            </Fab>
          </Grid>
          <Grid item>
            <Tooltip title="Playback speed">
              <Fab
                id="rate-button"
                size="small"
                color="secondary"
                onClick={(event) => setRateAnchorEl(event.currentTarget)}
                disabled={!currentAudio || loading}
                data-testid="rate"
              >
                <SpeedIcon />
              </Fab>
            </Tooltip>
            <Menu
              id="rate-menu"
              anchorEl={rateAnchorEl}
              open={rateOpen}
              onClose={() => setRateAnchorEl(null)}
              MenuListProps={{
                'aria-labelledby': 'rate-button',
              }}
            >
              {[0.5, 0.8, 1, 1.5, 2].map((rateValue) => (
                <MenuItem key={rateValue} onClick={() => changeRate(rateValue)}>
                  <ListItemIcon>{rate === rateValue && <Check />}</ListItemIcon>
                  <ListItemText>{rateValue}x</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>
      </Card>
      <Card className={classes.durationCard}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Typography data-testid="player-current-time">{timeFromSeconds(time)}</Typography>
          <Slider
            size="small"
            id="player-slider"
            value={time}
            min={0}
            disabled={!currentAudio || loading}
            max={duration}
            onChange={(e, val) => !Array.isArray(val) && seek(val)}
          />
          <Typography textAlign="right" data-testid="player-duration">
            {duration && timeFromSeconds(duration)}
          </Typography>
        </Stack>
      </Card>
    </>
  );
}

export default Player;
