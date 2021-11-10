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
import {getCurrentSprintId} from '../backEnd/DataBaseQueries';


const Board = () => {
    const newColumnRef = useRef(null);
    const [stageTitles, setStageTitles] = useState([]);
    const [sprintId, setSprintId] = useState('');
    const [sprint, setSprint] = useState(null);
    const [sprintStories, setSprintStories] = useState([]);
    const [taskView, setTaskView] = useState();
    const [stageTitleComponents, setStageTitleComponents] = useState([]);
    const { product } = useContext(UserContext);
    const productId = product ? product.id : null;
    const userStoryRef = firestore.collection('userStory');



    /// ----- Set up hooks for user story data -----
    // set observers, these are used to stop listening to the onSnapshot functions 
    var sprintObserver = null;
    var backlogStoriesObserver = null;
    // set up auto select current sprint
    useEffect(async () => {
      setSprintId(await getCurrentSprintId(productId))
    }, [])

    // Set up hook for sprint inside useEffect watching sprint id state
    useEffect(() => {
      if (sprintId === '') return
      // Stop listening to the previous snapshot call back
      if (sprintObserver != null) { sprintObserver() }
      // set new query / reference using new sprintId
      let sprintRef = firestore.collection('sprints').doc(sprintId);
      // set up new callback function using new sprintRef
      sprintObserver = sprintRef.onSnapshot((snapShot) => {
        setSprint(snapShot);
      });
    }, [sprintId]);

    // Set up hook for sprint stories inside useEffect watching sprint state
    useEffect(async () => {
      if (sprint === null) return;
      let tempSprintStories = [];
      for (const storyId of sprint.data().userStories) {
        await firestore
          .collection('userStory')
          .doc(storyId)
          .get()
          .then((doc) => {
            tempSprintStories.push(doc);
          })
          .catch((e) => {
            console.log('There was an error!!!');
            console.log(e);
          });
      }
      setSprintStories(tempSprintStories);
    }, [sprint]);

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
            <StageMenu stage={stageTitle} userStoryIds={sprintStories.map(story => story.id)}/>
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

          <SprintSelector sx={{ position: 'absolute', marginTop: "10px" }} sprintId={sprintId} setSprintId={setSprintId} />

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
                  {sprintStories.sort((firstDoc, secondDoc) => firstDoc.data().priority - secondDoc.data().priority)
                      .map(doc => <UserStoryRow key={doc.id} id={doc.id} data={doc.data()} stageTitles={stageTitles}/>)}
                </Box>
              }
            
              {(!loadingStories && !loadingProduct) && (sprintStories.length===0) &&
                <h3>There are no user stories for this board</h3>}
        </Container >)
      :
        <div>You must select a project to view the board</div>
      }</>)
}

export default Board
