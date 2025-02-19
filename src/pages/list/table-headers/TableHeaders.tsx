import React from 'react';
import { useParams } from 'react-router-dom';
import { TableCell, TableHead, TableRow } from '@mui/material';
import { Source } from '../../../types';

interface Props {
  canDownload: boolean;
}

function TableHeaders({ canDownload }: Props) {
  const source = useParams<{ source: string }>().source as Source;

  return (
    <TableHead>
      <TableRow>
        <TableCell>Call Id</TableCell>
        {source === Source.INTERACTIONS && <TableCell>Segment Id</TableCell>}
        {source === Source.FIVE9 && <TableCell>Session Id</TableCell>}
        {source === Source.FIVE9 && <TableCell>Agent</TableCell>}
        {source === Source.FIVE9 && <TableCell>Campaign</TableCell>}
        <TableCell>Ani</TableCell>
        <TableCell>Date of Call</TableCell>
        <TableCell />
        <TableCell />
        {canDownload && <TableCell />}
      </TableRow>
    </TableHead>
  );
}

export default TableHeaders;
