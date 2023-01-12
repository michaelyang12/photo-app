import './App.css';
import ImageGallery from './ImageGallery';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const per_page = 15;
  const apikey = '563492ad6f91700001000001e6dd2468d3274968906aa629c7ade98f';

  const [images, setImages] = useState([]); //images array for image display
  
  const [query, setQuery] = useState(''); //search input string

  const [showSearched, setShowSearched] = useState(false); //determine whether to display search results
  const [showingCurated, setShowingCurated] = useState(true); //determine whether to display curated images

  const [nextPage, setNextPage] = useState(''); //next page URL for API call
  const [prevPage, setPrevPage] = useState(''); //previous page URL for API call
  const [currentPage, setCurrentPage] = useState(0); //current page number

  const [expandSource, setExpandSource] = useState(''); //url of expanded photo
  const [expanded, setExpanded] = useState(false); //is photo expanded

  const [author, setAuthor] = useState(''); //photographer for current photo

  function displayCuratedPhotos() { //display curated photos
    console.log('showing curated photos...');
    const url = "https://api.pexels.com/v1/curated";   
    axios.get(url, {
        headers: {  
            'Authorization': `${apikey}`  
        }
    }).then(data => {
        let result = data.data.photos;
        console.log(result);
        setImages(result);
        setNextPage(data.data.next_page);
        setShowingCurated(true);
        setShowSearched(false);
        setCurrentPage(data.data.page);
    })
  }

  function displaySearchPhotos(event) { //display photos based off search query
    if (event) {
      event.preventDefault();
    }
    console.log('searching...');
    // let data = client.photos.search({query, per_page: 1 });
    const url = "https://api.pexels.com/v1/search?query=" + query + "&per_page=" + per_page;   
    axios.get(url, {
        headers: {  
            'Authorization': `${apikey}`  
        }
    }).then(data => {
        console.log(data); 
        let result = data.data.photos;
        console.log(result);
        setImages(result);
        setNextPage(data.data.next_page ?? '');
        setPrevPage(data.data.prev_page ?? '');
        setCurrentPage(data.data.page);
        console.log('search complete');
        setShowSearched(true);
        setShowingCurated(false);
    })
  }

  function handleSelection(event) { //switch selection states to toggle curated/search display
    if (event.target.id === 'photos') {
      setShowSearched(false);
      setShowingCurated(true);
      displayCuratedPhotos();
    } else if (event.target.id === 'collections') {
      setShowingCurated(false);
      setShowSearched(true);
      displaySearchPhotos();
    }
  }

  function showNextPage() { //show next page images (if not null)
    if (nextPage || nextPage !== '') {
      if (showSearched) {
        const url = nextPage;   
        axios.get(url, {
            headers: {  
                'Authorization': `${apikey}`  
            }
        }).then(data => {
            console.log(data); 
            let result = data.data.photos;
            console.log(result);
            setImages(result);
            setNextPage(data.data.next_page ?? '');
            setPrevPage(data.data.prev_page ?? '');
            setCurrentPage(data.data.page);
            console.log('search complete');
            setShowSearched(true);
            setShowingCurated(false);
        })
      } else if (showingCurated) {
        const url = nextPage;
        axios.get(url, {
            headers: {  
                'Authorization': `${apikey}`  
            }
        }).then(data => {
            let result = data.data.photos;
            console.log(result);
            setImages(result);
            setNextPage(data.data.next_page ?? '');
            setPrevPage(data.data.prev_page ?? '');
            setCurrentPage(data.data.page);
        })
      }
    }
  }

  function showPrevPage() { //show previous page images (if not null)
    if (prevPage !== '' && prevPage) {
      if (showSearched) {
        const url = prevPage;   
        axios.get(url, {
            headers: {  
                'Authorization': `${apikey}`  
            }
        }).then(data => {
            console.log(data); 
            let result = data.data.photos;
            console.log(result);
            setImages(result);
            setNextPage(data.data.next_page ?? '');
            setPrevPage(data.data.prev_page ?? '');
            setCurrentPage(data.data.page);
            console.log('search complete');
            setShowSearched(true);
            setShowingCurated(false);
        })
      } else if (showingCurated) {
        const url = prevPage;
        axios.get(url, {
            headers: {  
                'Authorization': `${apikey}`  
            }
        }).then(data => {
            let result = data.data.photos;
            console.log(result);
            setImages(result);
            setNextPage(data.data.next_page ?? '');
            setPrevPage(data.data.prev_page ?? '');
            setCurrentPage(data.data.page);
        })
      }
    }
  }

  let curatedState = showingCurated // determine curated images button style based on state
    ? 'selection-selected'
    : 'selection-unselected'

  let searchState = showSearched // determined searched images button style based on state
    ? 'selection-selected'
    : 'selection-unselected'

  useEffect(() => { //display curated photos on initial page load
    displayCuratedPhotos(); 
  }, []);

  function expandImage(event) { //expand image
    event.preventDefault();
    setExpandSource(event.target.id);
    setAuthor(event.target.name);
    setExpanded(true);
    console.log(expandSource);
    console.log(event.target.id);
  }

  let expandedState = expanded //determine expand module style based on state
    ? 'expand-module-visible'
    : 'expand-module-hidden'

  function download(event) { //download image, code referenced from: https://www.codegrepper.com/code-examples/javascript/react+js+download+image+from+url
    console.log(event.target.id);
    fetch(event.target.id, { //get url
      method: "GET",
      headers: {}
    })
      .then(response => { //save url temporarily and download from link
        response.arrayBuffer().then(function(buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const temp = document.createElement('a');
          temp.href = url;
          temp.setAttribute('download', "MYang-IMG-App-Download.png");
          document.body.appendChild(temp);
          temp.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className='container'>
      <div className='header-bar'>
        <div className='header-bar-container'>
          <div id='logo' className='tab'>
            Photo Search App
          </div>
          <div id='photos-search' className="tab">
            <form onSubmit={displaySearchPhotos}>
              <input
                type="text"
                className="searchbar"
                name="searchbar"
                placeholder="Search for images"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          </div>
          <div id='favorites' className='tab'>
            <a>Powered by PEXELS</a>
          </div>
        </div>
      </div>
      <div className='selector-bar'>
        <div className='selector-container'>
          <div id='photos' className={curatedState} onClick={handleSelection}>
            Curated PHOTOS
          </div>
          <div id='collections' className={searchState} onClick={handleSelection}>
            Search results
          </div>
        </div>
      </div>
      <div className='pages-bar'>
        <div className='pages-container'>
          <div id='prevpage' className='page-selector' onClick={showPrevPage}>
            Prev Page
          </div>
          <div id='pagenumber' className='page-number'>
            Page: {currentPage}
          </div>
          <div id='nextpage' className='page-selector' onClick={showNextPage}>
            Next Page
          </div>
        </div>
      </div>
      {images.length > 0
        ? <ImageGallery
            images = {images}
            setImages = {setImages}
            showSearched = {showSearched}
            expand = {expandImage}
            author = {author}
            setAuthor = {setAuthor}
          /> 
        : <div className='no-results'>
            No results found
          </div>
      }
      <div className={expandedState}>
        <div className='expand-container'>
          <img src={expandSource} alt=''/>
          <i onClick={() => setExpanded(false)} class="fa-solid fa-circle-xmark fa-lg" id='close-button'></i>
        </div>
        <div className='lower-bar'>
          <div className='lower-bar-container'>
            <span className='lower-tab' id='photographer-name'>Photo by: {author}</span>
            <button className='lower-tab' onClick={download} id={expandSource}>
              Download Image
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default App;
