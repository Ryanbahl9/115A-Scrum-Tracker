import React from 'react'
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button
} from '@mui/material'

const UserStoryCard = props => {
  const {storyID, storyName, storyDescription} = props
  return (
    <Card variant="outlined" sx={{ width: 275 }} >
      <CardContent>
        <Typography variant="h5" component="div">
          {storyName}
        </Typography>
        <Typography variant="body1">
          {storyDescription}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Move To Sprint</Button>
      </CardActions>
    </Card>
  )
}

export default UserStoryCard
