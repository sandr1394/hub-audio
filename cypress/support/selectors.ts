export const interactionsFilter = {
  callId: '#callId',
  segmentId: '#segmentId',
  ani: '#ani',
  dateFrom: '#dateFrom',
  dateTo: '#dateTo',
};

export const five9Filter = {
  callId: '#callId',
  sessionId: '#sessionId',
  ani: '#ani',
  agent: '#agentId',
  agentLoading: '[data-testid="agents-loading"]',
  campaign: '#campaignId',
  campaignLoading: '[data-testid="campaigns-loading"]',
  dateFrom: '#dateFrom',
  dateTo: '#dateTo',
};

export const filterInfo = {
  container: '[data-testid="filter-info"]',
  agentLoading: '[data-testid="filter-info-agent-loading"]',
  campaignLoading: '[data-testid="filter-info-campaign-loading"]',
};

export const interactionsTable = {
  row: 'table tbody tr',
  callIdCell: 'td[data-testid="call-id"]',
  segmentIdCell: 'td[data-testid="segment-id"]',
  aniCell: 'td[data-testid="ani"]',
  dateCell: 'td[data-testid="date-of-call"]',
  playButton: 'td[data-testid="play-container"] button',
  duration: 'td[data-testid="play-container"] [data-testid="audio-duration"]',
  playIcon: 'td[data-testid="play-container"] [data-testid="PlayArrowIcon"]',
  pauseIcon: 'td[data-testid="play-container"] [data-testid="PauseIcon"]',
  shareButton: 'td[data-testid="sharing"] button',
  downloadButton: 'td[data-testid="download"] button',
};

export const five9Table = {
  row: 'table tbody tr',
  callIdCell: 'td[data-testid="call-id"]',
  sessionIdCell: 'td[data-testid="session-id"]',
  agentCell: 'td[data-testid="agent"]',
  campaignCell: 'td[data-testid="campaign"]',
  aniCell: 'td[data-testid="ani"]',
  dateCell: 'td[data-testid="date-of-call"]',
  playButton: 'td[data-testid="play-container"] button',
  duration: 'td[data-testid="play-container"] [data-testid="audio-duration"]',
  playIcon: 'td[data-testid="play-container"] [data-testid="PlayArrowIcon"]',
  pauseIcon: 'td[data-testid="play-container"] [data-testid="PauseIcon"]',
  shareButton: 'td[data-testid="sharing"] button',
  downloadButton: 'td[data-testid="download"] button',
};

export const common = {
  snackbar: '.MuiSnackbar-root .MuiPaper-root',
};

export const player = {
  info: '[data-testid="player-info"]',
  volume: 'button[data-testid="volume"]',
  replay10: 'button[data-testid="replay"]',
  play: 'button[data-testid="play"]',
  pause: 'button[data-testid="pause"]',
  forward10: 'button[data-testid="forward"]',
  rate: 'button[data-testid="rate"]',
  currentTime: '[data-testid="player-current-time"]',
  duration: '[data-testid="player-duration"]',
  sliderRail: '#player-slider .MuiSlider-rail',
  sliderInput: '#player-slider input',
};
