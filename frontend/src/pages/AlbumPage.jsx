import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../utils/api"
import styles from "./AlbumPage.module.css"

function AlbumPage() {
  const { albumId } = useParams()
  const navigate = useNavigate()

  const [album, setAlbum] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState("all") // all, favorites
  const [tagSearch, setTagSearch] = useState("")
  const [shareEmails, setShareEmails] = useState("")
  const [newComment, setNewComment] = useState("")
  const [uploadData, setUploadData] = useState({
    file: null,
    tags: "",
    person: "",
    isFavorite: false
  })
  const [uploadLoading, setUploadLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAlbumAndImages()
  }, [albumId])

  const fetchAlbumAndImages = async () => {
    try {
      // get all albums and find this one
      const albumsRes = await api.get("/albums")
      const found = albumsRes.data.find(a => a.albumId === albumId)
      if (found) setAlbum(found)

      // get images
      const imagesRes = await api.get(`/albums/${albumId}/images`)
      setImages(imagesRes.data)
    } catch (err) {
      console.log("Error", err)
    } finally {
      setLoading(false)
    }
  }

  // filter images based on selected filter
  const getFilteredImages = () => {
    let filtered = images

    if (filter === "favorites") {
      filtered = filtered.filter(img => img.isFavorite)
    }

    if (tagSearch.trim()) {
      filtered = filtered.filter(img =>
        img.tags && img.tags.some(tag =>
          tag.toLowerCase().includes(tagSearch.toLowerCase())
        )
      )
    }

    return filtered
  }

  const handleUpload = async () => {
    if (!uploadData.file) {
      setError("Please select a file")
      return
    }

    setUploadLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", uploadData.file)
      formData.append("tags", uploadData.tags)
      formData.append("person", uploadData.person)
      formData.append("isFavorite", uploadData.isFavorite)

      const res = await api.post(`/albums/${albumId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      setImages([...images, res.data])
      setShowUploadModal(false)
      setUploadData({ file: null, tags: "", person: "", isFavorite: false })
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed")
    } finally {
      setUploadLoading(false)
    }
  }

  const handleFavorite = async (image) => {
    try {
      const res = await api.put(`/albums/${albumId}/images/${image.imageId}/favorite`, {
        isFavorite: !image.isFavorite
      })
      setImages(images.map(img => img.imageId === image.imageId ? res.data : img))
      if (selectedImage && selectedImage.imageId === image.imageId) {
        setSelectedImage(res.data)
      }
    } catch (err) {
      console.log("Error favoriting", err)
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return
    try {
      await api.delete(`/albums/${albumId}/images/${imageId}`)
      setImages(images.filter(img => img.imageId !== imageId))
      setShowImageModal(false)
    } catch (err) {
      alert("Error deleting image")
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      const res = await api.post(`/albums/${albumId}/images/${selectedImage.imageId}/comments`, {
        comment: newComment
      })
      setImages(images.map(img => img.imageId === selectedImage.imageId ? res.data : img))
      setSelectedImage(res.data)
      setNewComment("")
    } catch (err) {
      console.log("Error adding comment", err)
    }
  }

  const handleShare = async () => {
    const emailList = shareEmails.split(",").map(e => e.trim()).filter(e => e)
    if (emailList.length === 0) return

    try {
      await api.post(`/albums/${albumId}/share`, { emails: emailList })
      alert("Album shared successfully!")
      setShowShareModal(false)
      setShareEmails("")
    } catch (err) {
      alert(err.response?.data?.message || "Error sharing album")
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  const filteredImages = getFilteredImages()

  return (
    <div className={styles.page}>
      {/* Album Header */}
      <div className={styles.albumHeader}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
        <div className={styles.albumMeta}>
          <h2 className={styles.albumTitle}>{album?.name}</h2>
          {album?.description && (
            <p className={styles.albumDesc}>{album.description}</p>
          )}
        </div>
        <div className={styles.headerActions}>
          <button className={styles.shareBtn} onClick={() => setShowShareModal(true)}>
            👥 Share
          </button>
          <button className={styles.uploadBtn} onClick={() => setShowUploadModal(true)}>
            + Upload
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === "all" ? styles.activeFilter : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${filter === "favorites" ? styles.activeFilter : ""}`}
          onClick={() => setFilter("favorites")}
        >
          ⭐ Favorites
        </button>
        <input
          className={styles.tagInput}
          type="text"
          placeholder="Search by tag..."
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
        />
      </div>

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🖼️</span>
          <p>No images found</p>
        </div>
      ) : (
        <div className={styles.imageGrid}>
          {filteredImages.map((image) => (
            <div key={image.imageId} className={styles.imageCard}>
              <img
                src={image.url}
                alt={image.name}
                className={styles.image}
                onClick={() => {
                  setSelectedImage(image)
                  setShowImageModal(true)
                }}
              />
              <button
                className={`${styles.starBtn} ${image.isFavorite ? styles.starred : ""}`}
                onClick={() => handleFavorite(image)}
              >
                {image.isFavorite ? "⭐" : "☆"}
              </button>
              <div className={styles.imageOverlay}>
                <span className={styles.imageName}>{image.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Upload Image</h3>
            {error && <p className={styles.errorText}>{error}</p>}
            <div className={styles.fileInputWrapper}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                className={styles.fileInput}
              />
              {uploadData.file && (
                <p className={styles.fileName}>📎 {uploadData.file.name}</p>
              )}
            </div>
            <input
              className={styles.input}
              type="text"
              placeholder="Tags (comma separated, e.g. beach, sunset)"
              value={uploadData.tags}
              onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Person in image (optional)"
              value={uploadData.person}
              onChange={(e) => setUploadData({ ...uploadData, person: e.target.value })}
            />
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={uploadData.isFavorite}
                onChange={(e) => setUploadData({ ...uploadData, isFavorite: e.target.checked })}
              />
              <span>Mark as favorite</span>
            </label>
            <div className={styles.modalBtns}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowUploadModal(false)
                  setError("")
                }}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleUpload}
                disabled={uploadLoading}
              >
                {uploadLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Share Album</h3>
            <p className={styles.shareHint}>Enter email addresses separated by commas</p>
            <textarea
              className={styles.textarea}
              placeholder="friend1@example.com, friend2@example.com"
              value={shareEmails}
              onChange={(e) => setShareEmails(e.target.value)}
              rows={3}
            />
            {album?.sharedWith && album.sharedWith.length > 0 && (
              <div className={styles.alreadyShared}>
                <p className={styles.sharedLabel}>Already shared with:</p>
                {album.sharedWith.map(email => (
                  <span key={email} className={styles.emailTag}>{email}</span>
                ))}
              </div>
            )}
            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setShowShareModal(false)}>
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={handleShare}>
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Detail Modal */}
      {showImageModal && selectedImage && (
        <div className={styles.overlay} onClick={() => setShowImageModal(false)}>
          <div className={styles.imageDetailModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowImageModal(false)}>✕</button>
            <div className={styles.imageDetailContent}>
              <div className={styles.imageDetailLeft}>
                <img src={selectedImage.url} alt={selectedImage.name} className={styles.detailImage} />
              </div>
              <div className={styles.imageDetailRight}>
                <h3 className={styles.detailName}>{selectedImage.name}</h3>

                {selectedImage.person && (
                  <p className={styles.detailMeta}>👤 {selectedImage.person}</p>
                )}

                <p className={styles.detailMeta}>
                  📦 {(selectedImage.size / 1024).toFixed(1)} KB
                </p>

                <p className={styles.detailMeta}>
                  🕒 {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                </p>

                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className={styles.tagsRow}>
                    {selectedImage.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}

                <button
                  className={`${styles.favoriteDetailBtn} ${selectedImage.isFavorite ? styles.favActive : ""}`}
                  onClick={() => handleFavorite(selectedImage)}
                >
                  {selectedImage.isFavorite ? "⭐ Favorited" : "☆ Add to Favorites"}
                </button>

                <div className={styles.commentsSection}>
                  <h4 className={styles.commentsTitle}>Comments</h4>
                  <div className={styles.commentsList}>
                    {selectedImage.comments && selectedImage.comments.length > 0 ? (
                      selectedImage.comments.map((c, i) => (
                        <div key={i} className={styles.commentItem}>💬 {c}</div>
                      ))
                    ) : (
                      <p className={styles.noComments}>No comments yet</p>
                    )}
                  </div>
                  <div className={styles.addComment}>
                    <input
                      className={styles.commentInput}
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    />
                    <button className={styles.commentBtn} onClick={handleAddComment}>
                      Send
                    </button>
                  </div>
                </div>

                <button
                  className={styles.deleteImageBtn}
                  onClick={() => handleDeleteImage(selectedImage.imageId)}
                >
                  🗑️ Delete Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlbumPage
