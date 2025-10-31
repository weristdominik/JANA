// src/data/itemsData.js
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';

export const ITEMS = [
  {
    id: '1',
    label: 'Documents',
    children: [
      {
        id: '1.1',
        label: 'Company',
        children: [
          { id: '1.1.1', label: 'Invoice', fileType: 'doc', content: 'Invoice PDF content...' },
          { id: '1.1.2', label: 'Meeting notes', fileType: 'doc', content: 'Meeting details and decisions.' },
          { id: '1.1.3', label: 'Tasks list', fileType: 'doc', content: '1. Do this\n2. Do that' },
        ],
      },
      { id: '1.2', label: 'Personal', fileType: 'folder', children: [] },
      { id: '1.3', label: 'Group photo', fileType: 'image' },
    ],
  },
  {
    id: '2',
    label: 'Bookmarked',
    fileType: 'pinned',
    children: [
      { id: '2.1', label: 'Learning materials', fileType: 'doc' },
      { id: '2.2', label: 'News', fileType: 'doc' },
      { id: '2.3', label: 'Forums', fileType: 'doc' },
      { id: '2.4', label: 'Travel documents', fileType: 'pdf', content: 'Travel doc content...' },
    ],
  },
  { id: '3', label: 'History', fileType: 'folder', children: [] },
  { id: '4', label: 'Trash', fileType: 'trash', children: [] },
];
