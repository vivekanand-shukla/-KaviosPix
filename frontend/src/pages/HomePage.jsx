import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import styles from "./HomePage.css"

function HomePage() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newAlbumName, setNewAlbumName] = useState("")
  const [newAlbumDesc, setNewAlbumDesc] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // fetch all albums on load
  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      const res = await api.get("/albums")
      setAlbums(res.data)
    } catch (err) {
      console.log("Error fetching albums", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) {
      setError("Album name is required")
      return
    }

    try {
      const res = await api.post("/albums", {
        name: newAlbumName,
        description: newAlbumDesc
      })
      setAlbums([...albums, res.data])
      setShowCreateModal(false)
      setNewAlbumName("")
      setNewAlbumDesc("")
      setError("")
    } catch (err) {
      setError("Error creating album")
    }
  }

  const handleDeleteAlbum = async (albumId, e) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this album?")) return

    try {
      await api.delete(`/albums/${albumId}`)
      setAlbums(albums.filter(a => a.albumId !== albumId))
    } catch (err) {
      alert("Error deleting album or you are not the owner")
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading your albums...</div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Albums</h2>
        <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
          + New Album
        </button>
      </div>

      {albums.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🖼️</span>
          <p>No albums yet. Create your first album!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {albums.map((album) => (
            <div
              key={album.albumId}
              className={styles.albumCard}
              onClick={() => navigate(`/album/${album.albumId}`)}
            >
              <div className={styles.albumCover}>
                <span className={styles.albumIcon}>📁</span>
              </div>
              <div className={styles.albumInfo}>
                <h3 className={styles.albumName}>{album.name}</h3>
                {album.description && (
                  <p className={styles.albumDesc}>{album.description}</p>
                )}
                {album.sharedWith && album.sharedWith.length > 0 && (
                  <p className={styles.sharedTag}>
                    👥 Shared with {album.sharedWith.length} people
                  </p>
                )}
              </div>
              <button
                className={styles.deleteBtn}
                onClick={(e) => handleDeleteAlbum(album.albumId, e)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Album Modal */}
      {showCreateModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Create New Album</h3>
            {error && <p className={styles.errorText}>{error}</p>}
            <input
              className={styles.input}
              type="text"
              placeholder="Album name *"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
            />
            <textarea
              className={styles.textarea}
              placeholder="Description (optional)"
              value={newAlbumDesc}
              onChange={(e) => setNewAlbumDesc(e.target.value)}
              rows={3}
            />
            <div className={styles.modalBtns}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowCreateModal(false)
                  setError("")
                  setNewAlbumName("")
                  setNewAlbumDesc("")
                }}
              >
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={handleCreateAlbum}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
