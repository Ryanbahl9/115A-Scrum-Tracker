import React from 'react'
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button
} from '@mui/material'

const UserStoryCard = props => {
  const {storyID, storyName, storyDescription, onClick, btnText} = props
  return (
    <Card variant="outlined" sx={{ width: 275 }} >
      <CardContent>
        <Typography variant="h5" component="div">
          {storyDescription}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => onClick(storyID)} size="small">{btnText}</Button>
      </CardActions>
    </Card>
  )
}

export default UserStoryCard
