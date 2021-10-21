import React, { useState, useContext, useRef, useEffect  } from 'react'
import { firestore } from './fire';
import UserContext from './UserContext';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import UserStoryRow from "./UserStoryRow"
import { doc, updateDoc } from "firebase/firestore";
import { Container, Button, Box, TextField, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';



const Board = () => {
    const newColumnRef = useRef(null);
    const [numStages, setNumStages] = useState(0);
    const [stageTitles, setStageTitles] = useState(0);
    let { product } = useContext(UserContext);

    const userStoryRef = firestore.collection('userStory');
    let query;
    if(product){
        query = userStoryRef.where('productID', '==', product.id);
    } else {
        query = userStoryRef.where('productID', '==', '0');
    }
    let [UserStories, loading] = useCollectionData(query);


    const addColumn = async (e) => {
        if (newColumnRef.current.value.length === 0) return;
        e.preventDefault();
        const productRef = doc(firestore, "products", product.id);
        await updateDoc(productRef, {
            stages: [...product.stages, newColumnRef.current.value]
        });
    }

    useEffect(() => {
        console.log("in use effect");
        if(!product) {
            console.log("product is null");
            return;
        }
        console.log("PRODUCT NOT NULL! :)");
        let tempStageTitles = [<Box sx={{
                scrollSnapAlign: "start", 
                paddingTop: "10px",
                textAlign: "center",
                minWidth: "100px",
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                maxHeight:"30px" }}
            key={0}>User Stories</Box>, 
            <Box sx={{ 
                scrollSnapAlign: "start",
                paddingTop: "10px",
                textAlign: "center",
                minWidth: "200px",
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                maxHeight: "30px" }}
            key={1}>To Do</Box>];
        if(product.stages){
            tempStageTitles = tempStageTitles.concat(product.stages
                .map((stageTitle, i) => <Box sx={{ paddingTop: "10px",
                    scrollSnapAlign: "start",
                    textAlign: "center",
                    minWidth: "200px",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                    maxHeight: "30px"  }}
                    key={i + 2}>{stageTitle}<MenuIcon sx={{marginLeft:"10px",maxHeight:'15px', maxWidth:'15px'}}/></Box>));
        }
        tempStageTitles.push(<Box sx={{scrollSnapAlign: "start", 
                                    paddingTop: "10px",
                                    textAlign: "center",
                                    minWidth: "200px",
                                    borderBottom: "1px solid black",
                                    maxHeight: "30px" }}
            key={tempStageTitles.length}>Completed</Box>);
        setNumStages(tempStageTitles.length);
        setStageTitles(tempStageTitles);
    }, [product]);

    return (<>{
        product ?
            (<Container sx={{ overflowX: "scroll",
                              scrollSnapType:"x mandatory",
                              scrollPadding:"5px",
                              background: "aliceBlue",
                              height: "91vh" }}>
                <FormControl size="sm" sx={{ position: "fixed", maxWidth:"300px", marginTop:"15px"}}>
                    <InputLabel id="demo-simple-select-label">Sprint</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={0}
                        label="Age"
                        sx={{maxHeight:"30px"}}
                        // onChange={handleChange}
                    >
                        <MenuItem value={0}>sprint 1</MenuItem>
                        <MenuItem value={0}>sprint 2</MenuItem>
                        <MenuItem value={0}>sprint 3</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{display: 'inline-flex',
                          marginTop: "60px",
                          maxHeight:"40px" }}>
                    {stageTitles}
                    <Box sx={{paddingLeft: "50px",
                              minWidth: "200px",
                              paddingRight:"100px"}}>
                        <TextField inputRef={newColumnRef} id="outlined-basic" label="Add Stage" variant="outlined" />
                        <Button variant="outlined" onClick={addColumn}>
                            + add stage
                        </Button>
                    </Box>
                </Box>
                <Box sx={{width: "100%"}}>
                    {loading && <div>user stories are loading</div> }
                    {!loading && UserStories
                                    ?.map((story, i) => { 
                                        return (<UserStoryRow key={i} doc={story} numStages={numStages}/>)})}
                </Box>
            </Container >)
        :
            <div>You must select a project to view the board</div>
        }</>)
}

export default Board
