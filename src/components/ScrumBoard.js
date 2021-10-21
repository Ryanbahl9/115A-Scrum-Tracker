import React, { useState, useContext, useRef, useReducer } from 'react'
import { firestore } from './fire';
import UserContext from './UserContext';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import UserStoryRow from "./UserStoryRow"
import { doc, updateDoc } from "firebase/firestore";
import { Container, Button, Box, TextField } from '@mui/material';


const Board = () => {
    const newColumnRef = useRef();
    const [numStages, setNumStages] = useState();
    let { product } = useContext(UserContext);

    const userStoryRef = firestore.collection('userStory');
    let query;
    if(product){
        query = userStoryRef.where('productID', '==', product.id);
    } else {
        query = userStoryRef.where('productID', '==', '0');
    }
    let [UserStories, loading, error] = useCollectionData(query);


    const addColumn = async (e) => {
        if (newColumnRef.current.value.length === 0) return;
        e.preventDefault();
        const productRef = doc(firestore, "products", product.id);
        await updateDoc(productRef, {
            stages: [...product.stages, newColumnRef.current.value]
        });
    }

    const renderStageTitles = () => {
        let StageTitles = [<Box sx={{ paddingTop: "30px", textAlign: "center", width: "200px", borderBottom: "1px solid black", borderRight: "1px solid black" }} key={0}>User Stories</Box>, <Box sx={{ paddingTop: "30px", textAlign: "center",width: "200px", borderBottom: "1px solid black", borderRight: "1px solid black" }} key={1}>To Do</Box>];
        if(product.stages){

            StageTitles = StageTitles.concat(product.stages.map((stageTitle, i) => <Box sx={{ paddingTop: "30px", textAlign: "center",width: "200px", borderBottom: "1px solid black", borderRight: "1px solid black"  }} key={i+2}>{stageTitle}</Box>));
        }
        StageTitles.push(<Box sx={{ paddingTop: "30px", textAlign: "center",width: "200px", borderBottom: "1px solid black" }} key={StageTitles.length}>Completed</Box>);
        return StageTitles;
    }

    return (<>{
        product ?
            (<Container sx={{background:"aliceBlue", height:"91vh", width:"100vw"}}>
                <div>
                    sprint selector
                </div>
                <Box sx={{width:"100%", display:'flex', justifyContent:"center", marginTop:"20px"}}>
                    {renderStageTitles()}
                    <Box sx={{ paddingLeft:"50px"}}>
                        <TextField id="outlined-basic" label="Add Stage" variant="outlined" />
                        <Button variant="outlined" onClick={addColumn}>
                            + add column
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ width: "100%"}}>
                    {loading && <div>user stories are loading</div> }
                    {!loading && UserStories?.map((story, i) => { return (<UserStoryRow key={i} doc={story}></UserStoryRow>) })}
                </Box>
            </Container >)
        :
            <div>You must select a project to view the board</div>
        }</>)
}

export default Board
