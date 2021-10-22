import React, { useState, useContext, useRef, useEffect  } from 'react'
import { firestore } from './fire';
import UserContext from './UserContext';
import { useCollection } from 'react-firebase-hooks/firestore';
import UserStoryRow from "./UserStoryRow"
import { doc, updateDoc } from "firebase/firestore";
import { Container, Button, Box, TextField, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Board = () => {
    const newColumnRef = useRef(null);
    const [stageTitles, setStageTitles] = useState([]);
    const [stageTitleComponents, setStageTitleComponents] = useState([]);
    let { product } = useContext(UserContext);

    const userStoryRef = firestore.collection('userStory');
    let query;
    if(product){
        query = userStoryRef.where('productID', '==', product.id);
    } else {
        query = userStoryRef.where('productID', '==', '0');
    }
    let [UserStories, loading] = useCollection(query);

    const addColumn = async (e) => {
        if (newColumnRef.current.value.length === 0) return;
        e.preventDefault();
        const productRef = doc(firestore, "products", product.id);
        await updateDoc(productRef, {
            stages: [...product.stages, newColumnRef.current.value]
        });
    }

    useEffect(() => {
        if(!product || loading) return;
        let tempStageTitles = ["To Do"];
        let tempStageTitleComponents = [<Box sx={{
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
            tempStageTitleComponents = tempStageTitleComponents.concat(product.stages
                .map((stageTitle, i) => <Box sx={{ paddingTop: "10px",
                        scrollSnapAlign: "start",
                        textAlign: "center",
                        minWidth: "200px",
                        borderBottom: "1px solid black",
                        borderRight: "1px solid black",
                        maxHeight: "30px"  }}
                    key={i+2}>{stageTitle}<MenuIcon sx={{ marginLeft: "10px", maxHeight: '15px', maxWidth: '15px', cursor: "pointer"}}/></Box>));
            tempStageTitles = tempStageTitles.concat(product.stages);
        }

        tempStageTitleComponents.push(<Box sx={{scrollSnapAlign: "start",
                                                paddingTop: "10px",
                                                textAlign: "center",
                                                minWidth: "200px",
                                                borderBottom: "1px solid black",
                                                maxHeight: "30px" }}
                                        key={tempStageTitles.length+1}>Completed</Box>);

        tempStageTitles.push("Completed")
        setStageTitleComponents(tempStageTitleComponents);
        setStageTitles(tempStageTitles);
    }, [product, loading]);

    return (<>{
        product ?
            (<Container sx={{ overflowX: "scroll",
                              overflowY: "hidden",
                              scrollSnapType:"x mandatory",
                              scrollPadding:"5px",
                              background: "aliceBlue",
                              height: "90vh" }}>
                <FormControl size="sm" sx={{ position: "fixed",
                                             maxWidth:"300px",
                                             marginTop:"2%"}}>
                    <InputLabel id="demo-simple-select-label">
                        Sprint
                    </InputLabel>
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
                          marginTop: "6%",
                          maxHeight:"40px",}}>
                    {stageTitleComponents}
                    <Box sx={{paddingLeft: "50px",
                              minWidth: "200px",
                              paddingRight:"100px"}}>
                        <TextField inputRef={newColumnRef} id="outlined-basic" label="Add Stage" variant="outlined" />
                        <Button variant="outlined" onClick={addColumn}>
                            + add stage
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ width: `${(stageTitles.length * 200) + 100}px`,
                           height: "85%",
                           overflowY: "scroll",
                           overflowX: "hidden",
                           scrollSnapType: "y mandatory"}}>
                    {loading && <div>user stories are loading</div> }
                    {!loading && UserStories.docs.map(doc => { 
                                        return (<UserStoryRow key={doc.id} id={doc.id} data={doc.data()} stageTitles={stageTitles}/>)
                    })}
                </Box>
            </Container >)
        :
            <div>You must select a project to view the board</div>
        }</>)
}

export default Board
