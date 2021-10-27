import React, { useState, useContext, useRef, useEffect  } from 'react'
import { firestore } from './fire';
import UserContext from './UserContext';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import UserStoryRow from "./UserStoryRow"
import { doc, updateDoc } from "firebase/firestore";
import { Container, Button, Box, TextField, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './ScrumBoard.module.css'
import BasicMenu from './StageMenu';

const Board = () => {
    const newColumnRef = useRef(null);
    const [stageTitles, setStageTitles] = useState([]);
    const [stageTitleComponents, setStageTitleComponents] = useState([]);
    const { product } = useContext(UserContext);
    const userStoryRef = firestore.collection('userStory');
    let userStoriesQuery;
    if(product){
        userStoriesQuery = userStoryRef.where('productID', '==', product.id);
    } else {
        userStoriesQuery = userStoryRef.where('productID', '==', '0');
    }
    const [UserStories, loadingStories] = useCollectionData(userStoriesQuery, { idField: 'id' });

    let pid;
    if (product) {
        pid = product.id;
    } else {
        pid = '0';
    }
    const [productData, loadingProduct] = useDocumentData(firestore.collection('products').doc(pid), { idField: 'id' });


    const addColumn = async (e) => {
        if (newColumnRef.current.value.length === 0) return;
        e.preventDefault();
        const productRef = doc(firestore, "products", product.id);
        await updateDoc(productRef, {
            stages: [...product.stages, newColumnRef.current.value]
        });
    }

    useEffect(() => {
        if (!product || loadingProduct || !productData) return;
        let tempStageTitles = ["To Do"];
        let tempStageTitleComponents = [<Box className={styles.firstStageTitle} key={0}>User Stories</Box>,
                                        <Box className={styles.stageTitle} key={1}>To Do</Box>];
        if (productData.stages){
            tempStageTitleComponents = tempStageTitleComponents
                .concat(productData.stages
                .map((stageTitle, i) => <Box className={styles.stageTitle} key={i+2}>
                                            {stageTitle}
                    <BasicMenu className={styles.titleIcon}/>
                                        </Box>));
            tempStageTitles = tempStageTitles.concat(productData.stages);
        }

        tempStageTitleComponents.push(<Box className={styles.lastStageTitle} key={tempStageTitleComponents.length+1}>Completed</Box>);
        tempStageTitles.push("Completed")
        setStageTitleComponents(tempStageTitleComponents);
        setStageTitles(tempStageTitles);
    }, [product, loadingProduct, productData]);



    return (<>{
        product ?
            (<Container className={styles.boardContainer}>
                {/* Probably should make this its own component

                <FormControl size="sm" className={styles.sprintSelector}>
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
                </FormControl> */}

                <Box className={styles.stageTitlesContainer}>
                    {stageTitleComponents}
                    <Box className={styles.addStage}>
                        <TextField sx={{ maxHeight: "50px" }}inputRef={newColumnRef} id="standard-basic" label="Add Stage" variant="standard" />
                        <Button sx={{ maxHeight: "50px" }} variant="outlined" onClick={addColumn} disabled={loadingProduct}>
                            + add
                        </Button>
                    </Box>
                </Box>

                <Box sx={{width: `${(stageTitles.length * 200) + 100}px`}} className={styles.userStoriesContainer}>
                    {(loadingStories || loadingProduct) && <Box sx={{ width: "100%", display: "flex"}}><CircularProgress/></Box> }
                    {(!loadingStories && !loadingProduct) && UserStories.map(doc => {
                        return (<UserStoryRow key={doc.id} id={doc.id} data={doc} stageTitles={stageTitles}/>)
                    })}
                    {(!loadingStories && !loadingProduct) && (UserStories.length===0) && <h3>There are no user stories for this board</h3>}
                </Box>
            </Container >)
        :
            <div>You must select a project to view the board</div>
        }</>)
}

export default Board
