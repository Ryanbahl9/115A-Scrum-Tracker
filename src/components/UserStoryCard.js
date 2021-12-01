import React from 'react'
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button
} from '@mui/material'

const UserStoryCard = props => {
  const {storyID, storyName, onClick, btnText} = props
  return (
    <Card variant="elevation" elevation={4} sx={{ width: 275 }} >
      <CardContent>
        <Typography variant="h5" component="div">
          {storyName}
        </Typography>
        {/* <Typography variant="body" component="div">
          {storyID}
        </Typography> */}
      </CardContent>
      <CardActions>
        <Button onClick={() => onClick(storyID)} size="small">{btnText}</Button>
      </CardActions>
    </Card>
  )
}

export default UserStoryCard
