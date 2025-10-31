// src/components/FileExplorer.js
import * as React from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import CustomTreeItem from './FileExplorerItem'; // your custom tree item logic
import { ITEMS } from '../data/itemsData';

export default function FileExplorer({ items = ITEMS, onSelectItem }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100%',
        flexGrow: 1,
        overflowY: 'auto',
      }}
    >
      <RichTreeView
        items={items}
        defaultExpandedItems={['1', '1.1']}
        defaultSelectedItems="1.1"
        onSelectedItemsChange={(event, ids) => {
            const id = Array.isArray(ids) ? ids[0] : ids;
            onSelectItem(id);
        }}
        sx={{
          color: theme.palette.text.primary,
        }}
        slots={{ item: CustomTreeItem }}
        itemChildrenIndentation={24}
      />
    </Box>
  );
}
