import Header from './Header'
import AddItem from './AddItem'
import SearchItem from './SearchItem'
import Content from './Content'
import Footer from './Footer'
import { useState, useEffect } from 'react'
import apiRequest from './apiRequest'

function App() {
  // Change URL to real REST API server when using the app.
  const API_URL = "https://my-json-server.typicode.com/lilbaby1/notes-json/db"

  //const [items, setItems] = useState(JSON.parse(localStorage.getItem('shoppinglist')) || [ ])
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [search, setSearch] = useState('')
  const [fetchError, setFetchError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw Error('Did not receive expected data.')
        const listItems = await response.json()
        setItems(listItems.items)
        setFetchError(null)
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    setTimeout(() => {
      (async () => await fetchItems())()
    }, 200)
  }, [])

  const addItem = async (item) => {
    const id = items.length ? items[items.length -1].id + 1 : 1
    const newItem = { id, checked: false, item }
    const listItems = [...items, newItem]
    setItems(listItems)

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    }
    const result = await apiRequest(API_URL, postOptions)
  }

  const handleCheck = async (id) => {
    const listItems = items.map(item => (
        item.id === id
            ? {...item, checked: !item.checked}
            : item
    ))
    setItems(listItems)

    const myItem = listItems.filter(i => i.id === id)
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checked: myItem[0].checked })
    }
    const reqUrl = `${API_URL}/${id}`
    const result = await apiRequest(reqUrl, updateOptions)
    console.log(result)
  }

  const handleDelete = async (id) => {
    const listItems = items.filter(i => i.id !== id)
    setItems(listItems)

    const deleteOptions = { method: 'DELETE' }
    const reqUrl = `${API_URL}/${id}`
    const result = await apiRequest(reqUrl, deleteOptions)
  } 

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!newItem) return 
    addItem(newItem)
    setNewItem('')
  }

  return (
    <div className="App">
      <Header />
      <AddItem 
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{color: 'red'}}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content 
          items={items.filter(i => 
            (i["item"]).toLowerCase().includes(search.toLowerCase())
          )} 
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>
      <Footer items={items.filter(i => 
          (i.item).toLowerCase().includes(search.toLowerCase())
        ).length} 
      />
    </div>
  );
}

export default App;