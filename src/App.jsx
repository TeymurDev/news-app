import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [news, setNews] = useState({ results: [] });
  const [newsTimes, setNewsTimes] = useState({ docs: [] });
  const [newsOrg, setNewsOrg] = useState([]);
  const [newsOrgPersonal, setNewsOrgPersonal] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchTimesValue, setSearchTimesValue] = useState('');
  const [searchOrgValue, setSearchOrgValue] = useState('');

  const menuButtons = [
    ...new Set(newsOrgPersonal.map((value) => value.source.name)),
  ];

  const menuButtonsAuthor = [
    ...new Set(newsOrgPersonal.map((value) => value.author)),
  ];

  const filterSources = (source) => {
    const newSources = newsOrgPersonal.filter(
      (newValue) => newValue.source.name === source,
    );
    setNewsOrgPersonal(newSources);
  };

  const filterAuthors = (author) => {
    const newAuthors = newsOrgPersonal.filter(
      (newValue) => newValue.author === author,
    );
    setNewsOrgPersonal(newAuthors);
  };

  const fetchData = () => {
    const guardianApi = `https://content.guardianapis.com/search?q=debates&api-key=4922cbcb-eff7-4fb6-b54f-503f82b90a29`;

    axios.get(guardianApi).then((response) => {
      setNews(response.data.response);
    });
  };

  const fetchSearchData = (value) => {
    const searchGuardianApi = `https://content.guardianapis.com/search?q=${value}&api-key=4922cbcb-eff7-4fb6-b54f-503f82b90a29`;

    axios.get(searchGuardianApi).then((response) => {
      setNews(response.data.response);
    });
  };

  const handleChange = (value) => {
    setSearchValue(value);
    fetchSearchData(value);
  };

  const fetchTimesData = () => {
    const nytimesApi = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=vDHadCxYlNmx1A5YcoKCSuHl7SGVFGnj`;

    axios.get(nytimesApi).then((response) => {
      setNewsTimes(response.data.response);
    });
  };

  const fetchSearchTimesData = (value) => {
    const nytimesApi = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${value}&api-key=vDHadCxYlNmx1A5YcoKCSuHl7SGVFGnj`;

    axios.get(nytimesApi).then((response) => {
      setNewsTimes(response.data.response);
    });
  };

  const handleTimesChange = (value) => {
    setSearchTimesValue(value);
    fetchSearchTimesData(value);
  };

  const fetchOrgData = () => {
    const newsApiOrg = `https://newsapi.org/v2/everything?q=apple&sortBy=popularity&apiKey=2eb16498dbe4453897ee3777e432d6f6`;

    axios.get(newsApiOrg).then((response) => {
      setNewsOrg(response.data.articles);
    });
  };

  const fetchSearchOrgData = (value) => {
    const searchNewsApiOrg = `https://newsapi.org/v2/everything?q=${value}&sortBy=popularity&apiKey=2eb16498dbe4453897ee3777e432d6f6`;

    axios.get(searchNewsApiOrg).then((response) => {
      setNewsOrg(response.data.articles);
    });
  };

  const handleOrgChange = (value) => {
    setSearchOrgValue(value);
    fetchSearchOrgData(value);
  };

  const fetchOrgPersonalData = () => {
    const newsApiOrg = `https://newsapi.org/v2/everything?q=apple&sortBy=popularity&apiKey=2eb16498dbe4453897ee3777e432d6f6`;

    axios.get(newsApiOrg).then((response) => {
      setNewsOrgPersonal(response.data.articles);
    });
  };

  useEffect(() => {
    fetchData();
    fetchTimesData();
    fetchOrgData();
    fetchOrgPersonalData();
  }, []);

  return (
    <>
      <header>
        <input
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          className='header-input'
          type='text'
          placeholder='The Guardian API, Filter by Category'
        />
      </header>
      <main>
        <section className='articles'>
          <div className='wrapper'>
            {news.results
              .filter((record) => {
                return searchValue.toLowerCase() === ''
                  ? record
                  : record.sectionId.toLowerCase().includes(searchValue);
              })
              .map((record) => (
                <div className='record' key={record.id}>
                  <span className='mt'>
                    <span>Category:</span>
                    {record.sectionId}
                  </span>
                  <span className='mt'>{record.webTitle}</span>
                </div>
              ))}
          </div>
        </section>
        <section className='articles-nytimes'>
          <div className='nytimes-wrapper'>
            <input
              value={searchTimesValue}
              onChange={(e) => handleTimesChange(e.target.value)}
              className='header-input'
              type='text'
              placeholder='The New York Times API, Filter by Date'
            />
          </div>
          <div className='wrapper mt'>
            {newsTimes.docs
              .filter((record) => {
                return searchTimesValue.toLowerCase() === ''
                  ? record
                  : record.pub_date.toLowerCase().includes(searchTimesValue);
              })
              .map((record) => (
                <div className='record nytimes-height' key={record.id}>
                  <span className='mt'>
                    <span>Date:</span>
                    {record.pub_date}
                  </span>
                  <span className='mt'>{record.snippet}</span>
                </div>
              ))}
          </div>
        </section>
        <section className='articles-newsorg'>
          <div className='newsorg-wrapper'>
            <input
              value={searchOrgValue}
              onChange={(e) => handleOrgChange(e.target.value)}
              className='header-input'
              type='text'
              placeholder='News API Org, Filter by Source'
            />
          </div>
          <div className='wrapper mt'>
            {newsOrg
              .filter((record) => {
                return searchOrgValue.toLowerCase() === ''
                  ? record
                  : record.source.name.toLowerCase().includes(searchOrgValue);
              })
              .map((record) => (
                <div className='record' key={record.id}>
                  <span className='mt'>
                    <span>Source:</span>
                    {record.source.name}
                  </span>
                  <span className='mt'>{record.title}</span>
                </div>
              ))}
          </div>
        </section>
        <section className='personalized'>
          <h1 className='personalized-h1'>
            News API Org, Personalized news feed by sources and authors
          </h1>
          <div className='personalized-buttons'>
            {menuButtons.map((value, id) => (
              <button
                className='personalized-button'
                onClick={() => filterSources(value)}
                key={id}
              >
                {value}
              </button>
            ))}
            {menuButtonsAuthor.map((value, id) => (
              <button
                className='personalized-button'
                onClick={() => filterAuthors(value)}
                key={id}
              >
                {value}
              </button>
            ))}
          </div>
          <div className='wrapper mt'>
            {newsOrgPersonal.map((record) => (
              <div className='record personalized-height' key={record.id}>
                <span className='mt'>
                  <span>Source:</span>
                  {record.source.name}
                </span>
                <span className='mt'>
                  <span>Author:</span>
                  {record.author}
                </span>
                <span className='mt'>{record.title}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
