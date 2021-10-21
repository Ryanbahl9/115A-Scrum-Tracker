import React, { useContext } from 'react'
import { firestore } from './fire';
import UserContext from './UserContext';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import UserStoryRow from "./UserStoryRow"


const Board = () => {
    let { product } = useContext(UserContext);
    const userStoryRef = firestore.collection('userStory');
    const query = userStoryRef
        .where('productID', '==', product.id);
    let [UserStories, loading, error] = useCollectionData(query);

    const addColumn = () => {
        //functionality to add a 'stage' goes here
    }

    const renderStageTitles = () => {
        if (!product) return
        let StageTitles = [<div key={0}>User Stories</div>, <div key={1}>To Do</div>];
        if(product.stages){
            StageTitles = StageTitles.concat(product.stages.map((stageTitle) => <div>{stageTitle}</div>));
        }
        StageTitles.push(<div key={StageTitles}>Completed</div>);
        return StageTitles;
    }

    return (<>{
        product ?
            (<div>
                <div>
                    sprint selector
                </div>
                <div>
                    {renderStageTitles()}
                    <div onClick={addColumn}>
                        + add column
                    </div>
                </div>
                <div>
                    {loading && <div>user stories are loading</div> }
                    {!loading && UserStories?.map((story, i) => { return (<UserStoryRow key={i} doc={story}></UserStoryRow>) })}
                </div>
            </div >)
        :
            <div>You must select a project to view the board</div>
        }</>)
}

export default Board
