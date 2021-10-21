import React from 'react'

const UserStoryRow = (props) => {
    //this component will query the tasks collection to get all the tasks associated with this user story
    //will be adding soon
    return (
        <div>
            {props.doc.testing}
        </div>
    )
}

export default UserStoryRow
