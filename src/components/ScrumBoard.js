import React, {useState, useContext, useRef, useEffect} from 'react';
import {firestore} from './fire';
import UserContext from './UserContext';
import {useCollectionData,
  useDocumentData} from 'react-firebase-hooks/firestore';
import UserStoryRow from "./UserStoryRow"
import { doc, getDoc, updateDoc} from "firebase/firestore";
import { Container, Button, Box, TextField, FormControl, Select, InputLabel, MenuItem} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import StageMenu from './StageMenu';
import SprintSelector from './SprintSelector';


const Board = () => {
    const newColumnRef = useRef(null);
    const [stageTitles, setStageTitles] = useState([]);
    const [sprint, setSprint] = useState();
    const [taskView, setTaskView] = useState();
    const [stageTitleComponents, setStageTitleComponents] = useState([]);
    const { product } = useContext(UserContext);
    const userStoryRef = firestore.collection('userStory');
    let userStoriesQuery;
    if(product) {
      userStoriesQuery = userStoryRef.where('productId', '==', product.id);
    } else {
      userStoriesQuery = userStoryRef.where('productId', '==', '0');
    }
    const [UserStories,
      loadingStories] = useCollectionData(userStoriesQuery, {idField: 'id'});
    
    let pid;
    if(product) {
      pid = product.id;
    } else {
      pid = '0';
    }
    const [productData,
      loadingProduct] = useDocumentData(firestore
        .collection('products')
        .doc(pid), {idField: 'id'});

    let sprintQuery;
    const sprintRef = firestore.collection('userStory');
    if (product) {
      sprintQuery = sprintRef.where('productId', '==', product.id);
    } else {
      sprintQuery = sprintRef.where('productId', '==', '0');
    }
    const [sprints,
      loadingSprints] = useDocumentData(firestore
        .collection('sprints')
        .doc(pid), { idField: 'id' });

    //this is for adding a new stage to the database,
    //this function will force the use effect function to be called since
    //the product will be updated,
    const addColumn = async (e) => {
      if (newColumnRef.current.value.length === 0) return;
      if (productData.stages.includes(newColumnRef.current.value.length)) return;
      if (newColumnRef.current.value.length === 'Queue') return;
      if (newColumnRef.current.value.length === 'Complete') return;
      e.preventDefault();
      if (productData.stages){
        await updateDoc(doc(firestore, "products", productData.id), {
          stages: [...productData.stages, newColumnRef.current.value]
        });
      }
    }

    //a use effect function is used here,
    //so that anytime the stages of a product are changed
    //the board will rerender with the changed stages
    useEffect(() => {
      if (!product || loadingProduct || !productData || loadingStories) return;
      //add the mandatory titles
      let tempStageTitles = ["Queue"];
      let tempStageTitleComponents = [<Box sx={{ minWidth: '100px', boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px' }} key={0}></Box>,
        <Box sx={{ minWidth: '200px' ,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px'}}key={1}>User Stories</Box>,
        <Box sx={{ minWidth: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px' }}key={2}>Queue</Box>];
      //add the custom titles from the db
      if (productData.stages){
        tempStageTitleComponents = tempStageTitleComponents
          .concat(productData.stages
          .map((stageTitle, i) => 
          (<Box sx={{ minWidth: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px' }} key={i+3}>
            {stageTitle}
            <StageMenu stage={stageTitle} userStoryIds={UserStories.map(story => story.id)}/>
          </Box>)));
        tempStageTitles = tempStageTitles.concat(productData.stages);
      }
      //add the mandatory Complete title
      tempStageTitleComponents.push(<Box sx={{ minWidth: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 0px 1px' }} key={tempStageTitleComponents.length+2}>Complete</Box>);
      tempStageTitles.push("Complete")
      setStageTitleComponents(tempStageTitleComponents);
      setStageTitles(tempStageTitles);
    }, [product, loadingProduct, productData]);

    return (<>{
      product ?
        (<Container sx={{marginTop: "10px", overflowX: 'scroll', overflowY: 'hidden', maxHeight: '90vh'}}>

          <Box sx={{ position: 'absolute', marginTop: "10px" }}>
            <FormControl size="sm">
                <InputLabel id="demo-simple-select-label">
                    View Sprint
                </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={0}
                    label="Age"
                    sx={{maxHeight:"30px"}}
                    
                >
                  {!loadingSprints && sprints &&
                  sprints.map((sprint, i) => <MenuItem key={sprint.id} value={i}>sprints need a name field</MenuItem>)
                  }
                {!loadingSprints && !sprints && <MenuItem value={0}>There are no sprints for this product</MenuItem>}
                </Select>
            </FormControl>  
          </Box>

            {/* <Box sx={{ position: 'absolute', marginTop: "10px", marginLeft: '120px'}}>
            <FormControl size="sm">
              <InputLabel id="demo-simple-select-label">
                View Tasks
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={1}
                label="Age"
                sx={{maxHeight:"30px"}}
              >
                <MenuItem value={1}>Your tasks</MenuItem>
                <MenuItem value={2}>member 2</MenuItem>
                <MenuItem value={3}>member 3</MenuItem>
                <MenuItem value={4}>Unassigned Tasks</MenuItem>
              </Select>
            </FormControl>
          </Box> */}
          
          <Box sx={{display: 'flex', marginTop: '50px'}}>

            {stageTitleComponents}
            <Box sx={{display: 'flex', minWidth: '300px'}}>
              <TextField inputRef={newColumnRef} id="standard-basic" label="Add Stage" variant="standard" />
              <Button variant="outlined" onClick={addColumn} disabled={loadingProduct}>
                + add
              </Button>
            </Box>
            
          </Box>  


              {(loadingStories || loadingProduct) &&
                <Box ><CircularProgress/></Box> }

              {/*load the user stories into user story rows*/}
              
              {(!loadingStories && !loadingProduct) &&
                <Box sx={{minWidth: `${stageTitles.length * 200 + 300}px`, maxHeight: '80vh', overflowY: 'scroll', overflowX: 'hidden'}}>
                  {UserStories.sort((firstDoc, secondDoc) => firstDoc.priority - secondDoc.priority)
                      .map(doc => <UserStoryRow key={doc.id} id={doc.id} data={doc} stageTitles={stageTitles}/>)}
                </Box>
              }
            
              {(!loadingStories && !loadingProduct) && (UserStories.length===0) &&
                <h3>There are no user stories for this board</h3>}
        </Container >)
      :
        <div>You must select a project to view the board</div>
      }</>)
}

export default Board
