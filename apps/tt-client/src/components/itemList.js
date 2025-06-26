'use client'
import { Box, Button, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";

export default function ItemList({items, title, action, itemAction, canDo, handleClick}) {

 return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ mx: 3, mt:3  }}>{title}</Typography>
        {canDo && (<Button variant='contained' color='primary' id={action} sx={{ mx: 3, mt:3, px: 3 }} onClick={handleClick}>{action}</Button>)}
      </Box>
      <Paper elevation={2} sx={{
        p: 2,
        m: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <List sx={{py: 0, my: 0}} disablePadding >
          {items?.map(item => (
            <ListItem key={item?.id} secondaryAction={item?.itemAction && (<Button variant='outlined' color='primary' sx={{ px: 2.5 }} id={`${itemAction}-${item?.id}`} onClick={handleClick}>{itemAction}</Button>)} disableGutters>
              <ListItemButton sx={{ py: 0, my: 0 }} divider>
                <Box sx={{ flexGrow: 1, py: 0, my: 0 }} onClick={() => handleClick(item?.id)}>
                  <ListItemText primary={`${item?.primary}`} 
                  secondary={`${item?.secondary}`}/>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
}
