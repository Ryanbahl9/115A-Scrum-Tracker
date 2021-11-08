https://drive.google.com/drive/folders/1XXzd-v9JbkFUW6CsYhOH7jyEZODidgS2?usp=sharing
```
DataBase structure:
products:   {
                id: Auto Set Up by FireBase
                productName: "str",
                uid, //who created it
                users: []// array of users who have access
                stages: [],
                sprints: 0 //int how many current sprints
            }
users:      {
                email: @,
                uid,
                curProduct: id,
                color: 'color',
                invites: []
            }
userStory:  {
                id: Auto Set Up by FireBase
                productId: id,
                description: "str"
                priority: #,
                state: "productBacklog", "sprintBacklog", or "completed"
            }
sprints:    {
                id: Auto Set Up by FireBase
                productID: id,
                userStories: [id,..],
                startDate: date,
                length: dateDuration,

            }
tasks:      {
                id: Auto Set Up by Firebase
                userId: uid,
                userStoryId: id,
                description: "str"
                stage/stage: "str"
            }


```