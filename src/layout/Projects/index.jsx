'use client'
import useSWR from 'swr'
import Collection from '../../content/Collection'
import Project from '../../content/Project'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Projects() {
  //getting projects
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, error } = useSWR(`${apiUrl}/wp-json/wp/v2/album`, fetcher)
  if (!data) return <></>

  //replacing fourth Letter for cloning/test purpose
  function replaceFourth(string, newletter) {
    if (string.length < 4) {
      return string
    }
    let characterString = string.split('')
    characterString[3] = newletter
    let newArray = characterString.join('')
    return newArray
  }
  let albums = []
  let initAlbums = []
  let collection = []
  if (data) {
    //cloning albums for testing purpose
    let previousAlbums = JSON.parse(JSON.stringify(data))
    previousAlbums.map((album) => {
      album.date = replaceFourth(album.date, '2')
    })
    initAlbums = JSON.parse(JSON.stringify(data))
    let nextAlbums = JSON.parse(JSON.stringify(data))
    nextAlbums.map((album) => {
      album.date = replaceFourth(album.date, '4')
    })
    albums = [...nextAlbums, ...initAlbums, ...previousAlbums]
    albums.map((album) => {
      album.date = new Date(album.date)
    })
    albums.sort((a, b) => b.date - a.date)
  }

  collection = initAlbums // JSON.parse(JSON.stringify(albums))

  return (
    <>
      {collection
        ? collection.map((album, index) => {
            if (album.acf_data.type === "Collection d'albums") {
              return (
                <Collection
                  album={album}
                  albumIndex={index}
                  featured={album.featured_media}
                  key={`Projet - ${album.slug}-${index}`}
                />
              )
            } else {
              return (
                <Project
                  album={album}
                  albumIndex={index}
                  featured={album.featured_media}
                  key={`Projet - ${album.slug}-${index}`}
                />
              )
            }
          })
        : ''}
    </>
  )
}
