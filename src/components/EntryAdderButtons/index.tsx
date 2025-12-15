import { memo } from 'react';
import { Box } from '@mui/material';
import { TABS } from '../../atoms/selectedTabAtom';
import config from '../../config';
import DataTab from '../../tabs/DataTab';
import EntryAdderButton from '../EntryAdderButton';

function EntryAdderButtons() {
  // --- GRID LOGIC ---
  const items = TABS.filter(tab => config[tab].TabComponent === DataTab);
  const count = items.length;

  const chooseBestCols = (count: number) => {
    let best = { cols: 1, rows: count, score: Infinity };
    for (let cols = 1; cols <= 5; cols++) {
      const rows = Math.ceil(count / cols);
      const fullInLastRow = count % cols === 0 ? cols : count % cols;
      const balancePenalty = (cols - fullInLastRow) / cols;
      const score = rows + balancePenalty;
      if (score < best.score) {
        best = { cols, rows, score };
      }
    }
    return best.cols;
  };

  const cols = chooseBestCols(count);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      {items.map((tab, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const totalRows = Math.ceil(count / cols);

        const isTop = row === 0;
        const isBottom = row === totalRows - 1;
        const isLeft = col === 0;
        const isRight = col === cols - 1 || index === count - 1;

        return (
          <Box key={tab} sx={{ width: `${100 / cols}%` }}>
            <EntryAdderButton
              tab={tab}
              sx={{
                border: '1px solid rgba(255,255,255,0.4)',
                borderTop: isTop ? '1px solid rgba(255,255,255,0.4)' : '0',
                borderLeft: isLeft ? '1px solid rgba(255,255,255,0.4)' : '0',
                borderRight: isRight
                  ? '1px solid rgba(255,255,255,0.4)'
                  : '1px solid rgba(255,255,255,0.4)',
                borderBottom: isBottom
                  ? '1px solid rgba(255,255,255,0.4)'
                  : '1px solid rgba(255,255,255,0.4)',
                borderRadius: 0,
                ...(isTop && isLeft && { borderTopLeftRadius: '6px' }),
                ...(isTop && isRight && { borderTopRightRadius: '6px' }),
                ...(isBottom && isLeft && { borderBottomLeftRadius: '6px' }),
                ...(isBottom && isRight && { borderBottomRightRadius: '6px' }),
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}

export default memo(EntryAdderButtons);
