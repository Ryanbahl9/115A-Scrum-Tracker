DataBase structure:
products:   {
                id: Auto Set Up by FireBase
                productName: "str",
                uid, //who created it
                users: []// array of users who have access
            }
users:      {
                email: @,
                uid,
                curProduct: id,
                color: 'color'
            }
userStory:  {
                id: Auto Set Up by FireBase
                productId: id,
                description: "str"
                tasks: [id,..],
                priority: #
            }
tasks:      {
                id: Auto Set Up by Firebase
                userId: uid,
                userStoryId: id,
                description: "str"
            }

