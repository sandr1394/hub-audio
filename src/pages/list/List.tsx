/* eslint-disable jsx-a11y/media-has-caption, @typescript-eslint/no-var-requires */
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Snackbar,
  Tooltip,
  IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadingIcon from '@mui/icons-material/Downloading';
import CircularProgress from '@mui/material/CircularProgress';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import interactionsService from '../../services/interactions.service';
import { ListElement, Pageable, Source } from '../../types';
import Player from './player/Player';
import five9Service from '../../services/five9.service';
import ListDialogContent from './dialog-content/ListDialogContent';
import FilterInfo from './filter-info/FilterInfo';
import TableHeaders from './table-headers/TableHeaders';
import useAudio from '../../utils/useAudio';
import { phoneMask } from '../../components/phone-input/PhoneInput';
import timeFromSeconds from '../../utils/timeFromSeconds';
import getAgentFullName from '../../utils/getAgentFullName';
import useCanDownload from '../../utils/useCanDownload';
import commonService from '../../services/common.service';

const useStyles = makeStyles((theme: any) => ({
  container: {
    marginTop: 50,
    height: 'calc(100vh - 90px)',
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    marginTop: 10,
    padding: 24,
  },
  filterInfo: {
    flex: 1,
    alignSelf: 'center',
  },
  table: {
    marginTop: 24,
    flex: 1,
    scrollBehavior: 'smooth',
  },
  selectedRow: {
    backgroundColor: `${theme.palette.primary.main}55`,
  },
  longIdCell: {
    [theme.breakpoints.down('lg')]: {
      maxWidth: 150,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  aniCell: {
    whiteSpace: 'nowrap',
  },
  loadingWrapper: {
    paddingTop: 50,
    borderBottom: 'none',
  },
  dialogContent: {
    paddingTop: '10px!important',
  },
  loadingFab: {
    position: 'absolute',
  },
}));

function List<T extends Source>() {
  const classes = useStyles();
  const source = useParams<{ source: string }>().source as T;
  const { search, pathname } = useLocation();
  const history = useHistory();
  const [list, setList] = useState<Record<number, ListElement<T>[]>>({});
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [page, setPage] = useState<number>(0);
  const [openChangeFilterDialog, setOpenChangeFilterDialog] = useState<boolean>(false);
  const { toggle, clear, currentAudio, playing, loading } = useAudio();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<number[]>([]);
  const canDownload = useCanDownload();
  const tableRef = useRef<HTMLTableSectionElement>(null);

  const urlSearchParams = new URLSearchParams(search);

  const filterParams = {
    callId: urlSearchParams.get('callId'),
    segmentId: urlSearchParams.get('segmentId'),
    sessionId: urlSearchParams.get('sessionId'),
    ani: urlSearchParams.get('ani'),
    dnis: urlSearchParams.get('dnis'),
    agentId: urlSearchParams.get('agentId'),
    campaignId: urlSearchParams.get('campaignId'),
    dateFrom: urlSearchParams.get('dateFrom'),
    dateTo: urlSearchParams.get('dateTo'),
  };

  useEffect(() => {
    const updateList = async () => {
      if (list[page]) return;
      const service = source === Source.INTERACTIONS ? interactionsService : five9Service;
      setTotal((page + 1) * pageSize);
      const res = (await service.getAudioList(new URLSearchParams(search), page, pageSize)) as Pageable<ListElement<T>>;
      setList({ ...list, [page]: res.content });
      setTotal(res.content.length < res.page.size ? res.page.page * res.page.size + res.content.length : -1);
    };

    updateList();
  }, [search, page, pageSize]);

  useEffect(() => {
    tableRef.current?.scrollTo({ top: 0 });
  }, [page]);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setPage(0);
    setList({});
    setPageSize(parseInt(event.target.value, 10));
  };
  const back = () => {
    clear();
    history.push(`/audio/${source}`);
  };

  const copySingleItemLink = (el: ListElement<T>) => {
    const params = new URLSearchParams();
    params.set('callId', el.callId);
    if (el.segmentId) params.set('segmentId', el.segmentId);
    if (el.sessionId) {
      params.set('sessionId', el.sessionId);
      params.set('id', el.id.toString());
    }
    navigator.clipboard
      .writeText(`${window.location.protocol}//${window.location.host}${pathname}?${params.toString()}`)
      .then(() => setSnackbarOpen(true));
  };

  const downloadAudio = async (el: ListElement<T>) => {
    setDownloading([...downloading, el.id]);
    await commonService.downloadAudio(source, el.id);
    setDownloading((prevState) => prevState.filter((item) => item !== el.id));
  };

  return (
    <>
      <Container className={classes.container}>
        <Stack direction="row" spacing={0} sx={{ width: '100%', alignItems: 'center' }} justifyContent="space-between">
          <Button onClick={back} startIcon={<ArrowBackIcon />}>
            Back to Search
          </Button>
          <Typography variant="body2" textAlign="center">
            <b>You&apos;re looking through {source === Source.FIVE9 ? 'Five9' : 'Interactions'} files</b>
          </Typography>
        </Stack>
        <Card className={classes.card}>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center" data-testid="filter-info">
            <Grid item className={classes.filterInfo}>
              <FilterInfo source={source} filterParams={filterParams} />
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={() => setOpenChangeFilterDialog(true)}>
                Update Parameters
              </Button>
            </Grid>
          </Grid>
        </Card>
        <TableContainer className={classes.table} ref={tableRef}>
          <Table>
            <TableHeaders canDownload={canDownload} />
            <TableBody>
              {list && list[page] && !list[page].length && (
                <TableRow>
                  <TableCell
                    colSpan={source === Source.INTERACTIONS ? 6 : 8}
                    align="center"
                    className={classes.loadingWrapper}
                  >
                    No Content
                  </TableCell>
                </TableRow>
              )}
              {list && list[page] ? (
                list[page].map((el) => (
                  <TableRow key={el.id} className={currentAudio?.id === el.id ? classes.selectedRow : ''}>
                    <TableCell data-testid="call-id">{el.callId}</TableCell>
                    {source === Source.INTERACTIONS && (
                      <TableCell className={classes.longIdCell} data-testid="segment-id">
                        {el.segmentId}
                      </TableCell>
                    )}
                    {source === Source.FIVE9 && (
                      <TableCell className={classes.longIdCell} data-testid="session-id">
                        {el.sessionId}
                      </TableCell>
                    )}
                    {source === Source.FIVE9 && (
                      <TableCell data-testid="agent">{getAgentFullName(el.agentFirstName, el.agentLastName)}</TableCell>
                    )}
                    {source === Source.FIVE9 && <TableCell data-testid="campaign">{el.campaign}</TableCell>}
                    <TableCell className={classes.aniCell} data-testid="ani">
                      {el.ani ? phoneMask(el.ani) : '-'}
                    </TableCell>
                    <TableCell data-testid="date-of-call">
                      {format(new Date(el.dateOfCall), 'MM/dd/yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell data-testid="play-container">
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Typography data-testid="audio-duration">{timeFromSeconds(el.callDuration)}</Typography>
                        <Fab
                          size="small"
                          color="secondary"
                          onClick={() => toggle(el)}
                          disabled={currentAudio?.id === el.id && loading}
                        >
                          {currentAudio?.id === el.id ? (
                            <>
                              {loading && (
                                <>
                                  <DownloadingIcon />
                                  <CircularProgress className={classes.loadingFab} />
                                </>
                              )}
                              {!loading && playing && <PauseIcon />}
                              {!loading && !playing && <PlayIcon />}
                            </>
                          ) : (
                            <PlayIcon />
                          )}
                        </Fab>
                      </Stack>
                    </TableCell>
                    <TableCell data-testid="sharing">
                      <Tooltip title="Copy link to this audio">
                        <IconButton color="secondary" aria-label="copy link" onClick={() => copySingleItemLink(el)}>
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    {canDownload && (
                      <TableCell data-testid="download">
                        <Tooltip title="Download audio file">
                          <IconButton
                            color="secondary"
                            aria-label="download file"
                            onClick={() => downloadAudio(el)}
                            disabled={downloading.includes(el.id)}
                          >
                            <FileDownloadIcon />
                            {downloading.includes(el.id) && (
                              <CircularProgress color="secondary" className={classes.loadingFab} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={source === Source.INTERACTIONS ? 6 : 8}
                    align="center"
                    className={classes.loadingWrapper}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Player />
      </Container>
      <Dialog
        open={openChangeFilterDialog}
        onClose={() => setOpenChangeFilterDialog(false)}
        maxWidth="md"
        aria-labelledby="change-filter-dialog-title"
      >
        <DialogTitle id="change-filter-dialog-title">Change Filter</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <ListDialogContent
            source={source}
            filterParams={filterParams}
            close={() => setOpenChangeFilterDialog(false)}
            submit={() => {
              setPage(0);
              setList({});
            }}
          />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied"
      />
    </>
  );
}

export default List;
